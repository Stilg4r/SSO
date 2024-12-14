import { refreshToken } from '../../services/renewToken.service';
import crypto from 'crypto';

describe('refreshToken Service', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
    });

    it('Debe renovar correctamente los tokens para un usuario válido', async () => {
        const getUserById = jest.fn().mockResolvedValue({
            hasData: true,
            data: { id: 1 }
        });

        const getToken = jest.fn()
            .mockResolvedValueOnce({ error: false, data: { token: 'mocked-refresh-token' } })
            .mockResolvedValueOnce({ error: false, data: { token: 'mocked-access-token' } });

        const storageToken = jest.fn().mockResolvedValue({
            error: false,
            message: 'Token guardado',
            hasData: true,
            data: { idRefreshTokens: 1 }
        });

        const revokedSingleToken = jest.fn().mockResolvedValue({
            error: false,
            hasData: true
        });

        jest.spyOn(crypto, 'randomUUID').mockImplementation(() => 'mocked-uuid');

        const result = await refreshToken(
            { idUsers: 1, tokenId: 'mocked-uuid' },
            { getUserById, getToken, storageToken, revokedSingleToken }
        );

        expect(result.httpCode).toBe(200);
        expect(result.response.message).toBe('Renovación de token correcta');
        expect(result.response.data).toHaveProperty('refreshToken', 'mocked-refresh-token');
        expect(result.response.data).toHaveProperty('accessToken', 'mocked-access-token');

        expect(getToken).toHaveBeenCalledTimes(2);
        expect(getToken).toHaveBeenNthCalledWith(1, expect.objectContaining({
            payload: { user: { id: 1 } }, options: { expiresIn: '7h', jti: 'mocked-uuid' }
        }));
        expect(getToken).toHaveBeenNthCalledWith(2, expect.objectContaining({
            payload: { user: { id: 1 } }, options: { expiresIn: '1h' }
        }));

        expect(storageToken).toHaveBeenCalled();
        expect(storageToken).toHaveBeenCalledWith({
            token: 'mocked-refresh-token', tokenId: 'mocked-uuid'
        });

        expect(revokedSingleToken).toHaveBeenCalled();
        expect(revokedSingleToken).toHaveBeenCalledWith({ tokenId: 'mocked-uuid', idUsers: 1 });
    });


    it('Fallo en la busqueda usuario para renovar token', async () => {
        const getUserById = jest.fn().mockResolvedValue({
            error: true,
            message: 'Error al buscar usuario'
        });

        const result = await refreshToken(
            { idUsers: 9999, tokenId: 'mocked-uuid' },
            { getUserById }
        );

        expect(result.httpCode).toBe(500);
        expect(result.response.message).toBe('Error al buscar usuario');
    });

    it('Fallo por usuario no encontrado', async () => {
        const getUserById = jest.fn().mockResolvedValue({
            hasData: false,
            message: 'Usuario no encontrado'
        });

        const result = await refreshToken(
            { idUsers: 9999, tokenId: 'mocked-uuid' },
            { getUserById }
        );

        expect(result.httpCode).toBe(404);
        expect(result.response.message).toBe('Usuario no encontrado');
    });

    it('Fallo en la revocación del token', async () => {
        const getUserById = jest.fn().mockResolvedValue({
            hasData: true,
            data: { id: 1 }
        });

        const revokedSingleToken = jest.fn().mockResolvedValue({
            error: true,
            message: 'Error al revocar el token'
        });

        const result = await refreshToken(
            { idUsers: 1, tokenId: 'mocked-uuid' },
            { getUserById, revokedSingleToken }
        );

        expect(result.httpCode).toBe(500);
        expect(result.response.message).toBe('Error al revocar el token');
    });

    it('Token no encontrado para revocar', async () => {
        const getUserById = jest.fn().mockResolvedValue({
            hasData: true,
            data: { id: 1 }
        });

        const revokedSingleToken = jest.fn().mockResolvedValue({
            hasData: false,
            message: 'Token no encontrado'
        });

        const result = await refreshToken(
            { idUsers: 1, tokenId: 'mocked-uuid' },
            { getUserById, revokedSingleToken }
        );

        expect(result.httpCode).toBe(404);
        expect(result.response.message).toBe('Token no encontrado');
    });

    it('Error al generar token de refresh o access', async () => {
        const getUserById = jest.fn().mockResolvedValue({
            hasData: true,
            data: { id: 1 }
        });

        const getToken = jest.fn().mockResolvedValue({
            error: true,
            message: 'Error al generar el token',
        });

        const revokedSingleToken = jest.fn().mockResolvedValue({
            hasData: true
        });

        const result = await refreshToken(
            { idUsers: 1, tokenId: 'mocked-uuid' },
            { getUserById, getToken, revokedSingleToken }
        );

        expect(result.httpCode).toBe(500);
        expect(result.response.message).toBe('Error al generar el token');
    });
});

