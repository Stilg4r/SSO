import { refreshToken } from '../../services/renewToken.service';

describe('refreshToken Service', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
    });

    it('Debe renovar correctamente el token de acceso para un usuario válido', async () => {
        const getUserById = jest.fn().mockResolvedValue({
            hasData: true,
            data: { id: 1 }
        });

        const getToken = jest.fn().mockResolvedValue({
            error: false,
            data: { token: 'mocked-access-token' }
        });

        const findTokenByTokenId = jest.fn().mockResolvedValue({
            hasData: true,
            data: { revoked: false }
        });

        const result = await refreshToken(
            { idUsers: 1, tokenId: 'mocked-uuid' },
            { getUserById, getToken, findTokenByTokenId }
        );

        expect(result.httpCode).toBe(200);
        expect(result.response.message).toBe('Renovación de token correcta');
        expect(result.response.data).toHaveProperty('accessToken', 'mocked-access-token');

        expect(getUserById).toHaveBeenCalledWith({ id: 1 });
        expect(findTokenByTokenId).toHaveBeenCalledWith({ tokenId: 'mocked-uuid' });
        expect(getToken).toHaveBeenCalledWith({
            payload: { user: { id: 1 } },
            options: { expiresIn: '1h' }
        });
    });

    it('Fallo en la búsqueda de usuario', async () => {
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

    it('Fallo en la búsqueda del token', async () => {
        const getUserById = jest.fn().mockResolvedValue({
            hasData: true,
            data: { id: 1 }
        });

        const findTokenByTokenId = jest.fn().mockResolvedValue({
            error: true,
            message: 'Error al buscar token'
        });

        const result = await refreshToken(
            { idUsers: 1, tokenId: 'mocked-uuid' },
            { getUserById, findTokenByTokenId }
        );

        expect(result.httpCode).toBe(500);
        expect(result.response.message).toBe('Error al buscar token');
    });

    it('Fallo por token no encontrado', async () => {
        const getUserById = jest.fn().mockResolvedValue({
            hasData: true,
            data: { id: 1 }
        });

        const findTokenByTokenId = jest.fn().mockResolvedValue({
            hasData: false,
            message: 'Token no encontrado'
        });

        const result = await refreshToken(
            { idUsers: 1, tokenId: 'mocked-uuid' },
            { getUserById, findTokenByTokenId }
        );

        expect(result.httpCode).toBe(404);
        expect(result.response.message).toBe('Token no encontrado');
    });

    it('Fallo por token revocado', async () => {
        const getUserById = jest.fn().mockResolvedValue({
            hasData: true,
            data: { id: 1 }
        });

        const findTokenByTokenId = jest.fn().mockResolvedValue({
            hasData: true,
            data: { revoked: true }
        });

        const result = await refreshToken(
            { idUsers: 1, tokenId: 'mocked-uuid' },
            { getUserById, findTokenByTokenId }
        );

        expect(result.httpCode).toBe(401);
        expect(result.response.message).toBe('Token revocado');
    });

    it('Fallo al generar el token de acceso', async () => {
        const getUserById = jest.fn().mockResolvedValue({
            hasData: true,
            data: { id: 1 }
        });

        const findTokenByTokenId = jest.fn().mockResolvedValue({
            hasData: true,
            data: { revoked: false }
        });

        const getToken = jest.fn().mockResolvedValue({
            error: true,
            message: 'Error al generar el token'
        });

        const result = await refreshToken(
            { idUsers: 1, tokenId: 'mocked-uuid' },
            { getUserById, getToken, findTokenByTokenId }
        );

        expect(result.httpCode).toBe(500);
        expect(result.response.message).toBe('Error al generar el token');
    });
});
