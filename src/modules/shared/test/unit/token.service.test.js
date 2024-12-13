import * as tokenService from '../../services/token.service';
import * as refreshTokens from '../../../authentication/infrastructura/refreshTokens.db';
import { randomUUID } from 'crypto';
import fs from 'fs';
import { PRIVATEKEYPATH } from '../../../../../env.cjs';

jest.mock('../../../authentication/infrastructura/refreshTokens.db'); // Mockea el módulo completo

describe('getToken service', () => {


    beforeAll(() => {
        if (!fs.existsSync(PRIVATEKEYPATH)) {
            throw new Error(`Clave privada no encontrada en ${PRIVATEKEYPATH}`);
        }
    });

    afterEach(() => {
        jest.restoreAllMocks()
    });

    it('Debe generar un token correctamente', async () => {
        const token = {
            payload: { user: { id: 1 } },
            options: { expiresIn: '1h' },
        }
        const result = await tokenService.getToken(token);

        expect(result.error).toBe(false);
        expect(result.message).toBe('Token generado');
        expect(result.data).toHaveProperty('token');
        expect(result.data.token).toBeTruthy();
    });

    it('Debe verificar un token correctamente', async () => {

        const generatedToken = await tokenService.getToken({
            payload: { user: { id: 1 } },
            options: {
                expiresIn: '1h',
                jti: randomUUID()
            }
        });

        const result = await tokenService.verifyToken({ token: generatedToken.data.token });

        expect(result.error).toBe(false);
        expect(result.message).toBe('Token verificado');
        expect(result.data).toHaveProperty('user');
        expect(result.data.user).toHaveProperty('id');
        expect(result.data.user.id).toBe(1);
        expect(result.data).toHaveProperty('jti');
    });

    it('Debe guardar el token en la base de datos', async () => {

        const mockVerifyToken = jest.fn().mockResolvedValue({
            error: false,
            message: 'Token verificado',
            data: { user: { id: 1 }, exp: '2024-12-10T20:05:05.404Z' },
        });

        refreshTokens.saveToken.mockResolvedValue({
            error: false,
            message: 'Token de refresco guardado',
            hasData: true,
            data: { idRefreshTokens: 1 }
        });

        const tokenId = randomUUID();

        const result = await tokenService.storageToken({ token: 'mocked-token', tokenId }, mockVerifyToken);

        expect(result.error).toBe(false);
        expect(result.hasData).toBe(true);
        expect(result.data).toHaveProperty('idRefreshTokens');
        expect(result.data.idRefreshTokens).toBe(1);

        // Verificar que se llamó a la función de verificación
        expect(mockVerifyToken).toHaveBeenCalled();
        expect(mockVerifyToken).toHaveBeenCalledTimes(1);
        expect(mockVerifyToken).toHaveBeenCalledWith({ token: 'mocked-token' });

        // verificar que se llamó a la función de guardado
        expect(refreshTokens.saveToken).toHaveBeenCalled();
        expect(refreshTokens.saveToken).toHaveBeenCalledTimes(1);
        expect(refreshTokens.saveToken).toHaveBeenCalledWith({
            tokenId,
            token: '006067c04010989b7c152ed9d8b8317cde16975f8d6e986c47b05123d5d9cdb8',
            idUsers: 1,
            expiresAt: '2024-12-10T20:05:05.404Z',
            createdBy: 1,
        });

    });

});
