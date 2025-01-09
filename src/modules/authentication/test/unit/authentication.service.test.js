import { authenticationByPassword } from '../../services/autenticacionByPassword.service';
import crypto from 'crypto';

describe('authenticationByPassword Service', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
    });

    it('Autorizacion con credenciales validas', async () => {

        const getUser = jest.fn().mockResolvedValue({
            hasData: true,
            data: {
                id: 1,
                password: "$2a$10$ZeOv7/NVULy60cY/6TBxLeWKy3X9ztiYRGu3PT9MuMJAERGrDtR.S"// Hash de bcrypt para "123"
            }
        });

        const getToken = jest.fn().mockResolvedValue({
            error: false,
            message: 'Token generado',
            data: { token: 'mocked-token' },
        });

        const storeToken = jest.fn().mockResolvedValue({
            error: false,
            message: 'Token guardado',
            hasData: true,
            data: { idRefreshTokens: 1 }
        });

        const revokeAllTokens = jest.fn().mockResolvedValue({
            error: false,
            message: 'Tokens revocados',
            hasData: true,
            data: { revoked: 1 }
        });

        jest.spyOn(crypto, 'randomUUID').mockImplementation(() => 'mocked-uuid');

        const result = await authenticationByPassword(
            { user: 'test', pass: '123' },
            { getUser, getToken, storeToken, revokeAllTokens }
        );

        expect(result.httpCode).toBe(200);
        expect(result).toEqual({
            httpCode: 200,
            response: {
                message: 'Inicio de sesión correcto',
                data: {
                    refreshToken: 'mocked-token',
                    accessToken: 'mocked-token'
                }
            }
        });

        expect(getToken).toHaveBeenCalled();
        expect(getToken).toHaveBeenCalledTimes(2);

        expect(getToken).toHaveBeenNthCalledWith(1, expect.objectContaining({
            payload: { user: { id: 1 } }, options: { expiresIn: '7h', jti: 'mocked-uuid' }
        }));

        expect(getToken).toHaveBeenNthCalledWith(2, expect.objectContaining({
            payload: { user: { id: 1 } }, options: { expiresIn: '1h' }
        }));

        expect(storeToken).toHaveBeenCalled();
        expect(storeToken).toHaveBeenCalledTimes(1);
        expect(storeToken).toHaveBeenCalledWith({
            token: 'mocked-token', tokenId: 'mocked-uuid'
        });

        expect(revokeAllTokens).toHaveBeenCalled();
        expect(revokeAllTokens).toHaveBeenCalledTimes(1);
        expect(revokeAllTokens).toHaveBeenCalledWith({ idUsers: 1 });

    });

    it('Fallo por contraseña incorrecta', async () => {
        const getUser = jest.fn().mockResolvedValue({
            hasData: true,
            data: {
                id: 1,
                password: "$2a$10$ZeOv7/NVULy60cY/6TBxLeWKy3X9ztiYRGu3PT9MuMJAERGrDtR.S"// Hash de bcrypt para "123"
            }
        });

        const result = await authenticationByPassword(
            { user: 'test', pass: 'wrong' },
            { getUser }
        );

        expect(result.httpCode).toBe(401);
        expect(result.response.message).toBe('Usuario no autorizado');
    });

    it('Fallo por usuario no encontrado', async () => {
        const getUser = jest.fn().mockResolvedValue({ hasData: false });

        const result = await authenticationByPassword(
            { user: 'wrong', pass: '123' },
            { getUser }
        );

        expect(result.httpCode).toBe(404);
    });

    it('Fallo en la generación del token', async () => {

        const getUser = jest.fn().mockResolvedValue({
            hasData: true,
            data: {
                id: 1,
                password: "$2a$10$ZeOv7/NVULy60cY/6TBxLeWKy3X9ztiYRGu3PT9MuMJAERGrDtR.S"// Hash de bcrypt para "123"
            }
        });

        const getToken = jest.fn().mockResolvedValue({
            error: true,
            message: 'Error al generar el token',
        });

        const result = await authenticationByPassword(
            { user: 'test', pass: '123' },
            { getUser, getToken }
        );

        expect(result.httpCode).toBe(500);

    });
});
