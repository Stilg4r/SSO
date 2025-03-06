import { authenticationByPassword } from '../../services/authenticationByPassword.service';
import crypto from 'crypto';

describe('authenticationByPassword Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Autorización con credenciales válidas', async () => {
        const getUser = jest.fn().mockResolvedValue({
            hasData: true,
            data: {
                id: 1,
                // Hash de bcrypt para "123"
                password: "$2a$10$ZeOv7/NVULy60cY/6TBxLeWKy3X9ztiYRGu3PT9MuMJAERGrDtR.S"
            }
        });

        const getUserPermissionsMolules = jest.fn().mockResolvedValue({
            error: false,
            message: 'Permisos encontrados',
            hasData: true,
            data: [
                { id: 1, name: 'fullAccess', fullAccess: 1 },
                { id: 2, name: 'granularAccess', fullAccess: 0 }
            ]
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

        // Se simula el UUID para el token refresh
        jest.spyOn(crypto, 'randomUUID').mockReturnValue('mocked-uuid');

        const result = await authenticationByPassword(
            { user: 'test', pass: '123' },
            { getUser, getUserPermissionsMolules, getToken, storeToken, revokeAllTokens }
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

        // Validar que se haya llamado a getToken dos veces, con los parámetros correctos
        expect(getToken).toHaveBeenCalledTimes(2);
        expect(getToken).toHaveBeenNthCalledWith(1, expect.objectContaining({
            payload: { user: { id: 1 } },
            options: { expiresIn: '7h', jti: 'mocked-uuid' }
        }));
        expect(getToken).toHaveBeenNthCalledWith(2, expect.objectContaining({
            payload: {
                user: { id: 1 }, permissions: [
                    { id: 1, name: 'fullAccess', fullAccess: 1 },
                    { id: 2, name: 'granularAccess', fullAccess: 0 }
                ]
            },
            options: { expiresIn: '1h' }
        }));

        expect(storeToken).toHaveBeenCalledTimes(1);
        expect(storeToken).toHaveBeenCalledWith({
            token: 'mocked-token', tokenId: 'mocked-uuid'
        });

        expect(revokeAllTokens).toHaveBeenCalledTimes(1);
        expect(revokeAllTokens).toHaveBeenCalledWith({ idUsers: 1 });
    });

    it('Falla por contraseña incorrecta', async () => {
        const getUser = jest.fn().mockResolvedValue({
            hasData: true,
            data: {
                id: 1,
                // Hash de bcrypt para "123"
                password: "$2a$10$ZeOv7/NVULy60cY/6TBxLeWKy3X9ztiYRGu3PT9MuMJAERGrDtR.S"
            }
        });

        // Se incluye getUserPermissionsMolules, aunque no se debería llamar al no validar la contraseña
        const getUserPermissionsMolules = jest.fn();

        const result = await authenticationByPassword(
            { user: 'test', pass: 'wrong' },
            { getUser, getUserPermissionsMolules }
        );

        expect(result.httpCode).toBe(401);
        expect(result.response.message).toBe('Usuario no autorizado');
    });

    it('Falla por usuario no encontrado', async () => {
        const getUser = jest.fn().mockResolvedValue({ hasData: false });

        // Se incluye la dependencia dummy para completar los parámetros
        const getUserPermissionsMolules = jest.fn();

        const result = await authenticationByPassword(
            { user: 'wrong', pass: '123' },
            { getUser, getUserPermissionsMolules }
        );

        expect(result.httpCode).toBe(404);
    });

    it('Falla en la generación del token', async () => {
        const getUser = jest.fn().mockResolvedValue({
            hasData: true,
            data: {
                id: 1,
                // Hash de bcrypt para "123"
                password: "$2a$10$ZeOv7/NVULy60cY/6TBxLeWKy3X9ztiYRGu3PT9MuMJAERGrDtR.S"
            }
        });

        const getUserPermissionsMolules = jest.fn().mockResolvedValue({
            error: false,
            message: 'Permisos encontrados',
            hasData: true,
            data: [
                { id: 1, name: 'fullAccess', fullAccess: 1 },
                { id: 2, name: 'granularAccess', fullAccess: 0 }
            ]
        });

        const getToken = jest.fn().mockResolvedValue({
            error: true,
            message: 'Error al generar el token',
        });

        const result = await authenticationByPassword(
            { user: 'test', pass: '123' },
            { getUser, getUserPermissionsMolules, getToken }
        );

        expect(result.httpCode).toBe(500);
    });
});
