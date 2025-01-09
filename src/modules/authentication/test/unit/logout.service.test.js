import { logOutAll, logOutSingle } from '../../services/logout.service.js';

describe('authenticationByPassword Service', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
    });

    it('Revocar todos los tokens de un usuario - éxito', async () => {
        const mockRevokeAllTokens = jest.fn().mockResolvedValue({
            error: false,
            message: 'Tokens revocados',
            hasData: true,
            data: { revoked: 1 }
        });

        const result = await logOutAll({ idUsers: 1 }, { revokeAllTokens: mockRevokeAllTokens });

        expect(result.httpCode).toEqual(200);
        expect(mockRevokeAllTokens).toHaveBeenCalledTimes(1);
        expect(mockRevokeAllTokens).toHaveBeenCalledWith({ idUsers: 1 });
        expect(result.response).toEqual({
            error: false,
            message: 'Tokens revocados',
            hasData: true,
            data: { revoked: 1 }
        });
    });

    it('Revocar todos los tokens de un usuario - error del servicio', async () => {
        const mockRevokeAllTokens = jest.fn().mockResolvedValue({
            error: true,
            message: 'Error al revocar tokens',
            hasData: false
        });

        const result = await logOutAll({ idUsers: 1 }, { revokeAllTokens: mockRevokeAllTokens });

        expect(result.httpCode).toEqual(500);
        expect(mockRevokeAllTokens).toHaveBeenCalledTimes(1);
        expect(result.response).toEqual({
            error: true,
            message: 'Error al revocar tokens',
            hasData: false
        });
    });

    it('Revocar todos los tokens de un usuario - sin datos', async () => {
        const mockRevokeAllTokens = jest.fn().mockResolvedValue({
            error: false,
            message: 'No se encontraron tokens para revocar',
            hasData: false
        });

        const result = await logOutAll({ idUsers: 1 }, { revokeAllTokens: mockRevokeAllTokens });

        expect(result.httpCode).toEqual(404);
        expect(mockRevokeAllTokens).toHaveBeenCalledTimes(1);
        expect(result.response).toEqual({
            error: false,
            message: 'No se encontraron tokens para revocar',
            hasData: false
        });
    });

    it('Revocar un token individual - éxito', async () => {
        const mockRevokeSingleToken = jest.fn().mockResolvedValue({
            error: false,
            message: 'Token revocado',
            hasData: true,
            data: { revoked: 1 }
        });

        const result = await logOutSingle({ tokenId: 'some-uuid', idUsers: 1 }, { revokeSingleToken: mockRevokeSingleToken });

        expect(result.httpCode).toEqual(200);
        expect(mockRevokeSingleToken).toHaveBeenCalledTimes(1);
        expect(mockRevokeSingleToken).toHaveBeenCalledWith({ tokenId: 'some-uuid', idUsers: 1 });
        expect(result.response).toEqual({
            error: false,
            message: 'Token revocado',
            hasData: true,
            data: { revoked: 1 }
        });
    });

    it('Revocar un token individual - error del servicio', async () => {
        const mockRevokeSingleToken = jest.fn().mockResolvedValue({
            error: true,
            message: 'Error al revocar token',
            hasData: false
        });

        const result = await logOutSingle({ tokenId: 'some-uuid', idUsers: 1 }, { revokeSingleToken: mockRevokeSingleToken });

        expect(result.httpCode).toEqual(500);
        expect(mockRevokeSingleToken).toHaveBeenCalledTimes(1);
        expect(result.response).toEqual({
            error: true,
            message: 'Error al revocar token',
            hasData: false
        });
    });

    it('Revocar un token individual - sin datos', async () => {
        const mockRevokeSingleToken = jest.fn().mockResolvedValue({
            error: false,
            message: 'Token no encontrado para revocar',
            hasData: false
        });

        const result = await logOutSingle({ tokenId: 'some-uuid', idUsers: 1 }, { revokeSingleToken: mockRevokeSingleToken });

        expect(result.httpCode).toEqual(404);
        expect(mockRevokeSingleToken).toHaveBeenCalledTimes(1);
        expect(result.response).toEqual({
            error: false,
            message: 'Token no encontrado para revocar',
            hasData: false
        });
    });
});