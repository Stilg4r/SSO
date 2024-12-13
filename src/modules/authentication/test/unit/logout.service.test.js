import { logOutAll, logOutSingle } from '../../services/logout.service.js';

describe('authenticationByPassword Service', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
    });

    it('Revocar todos los tokens de un usuario', async () => {

        const mockRevokeAllTokens = jest.fn().mockResolvedValue({
            error: false,
            message: 'Tokens revocados',
            hasData: true,
            data: { revoked: 1 }
        });

        const result = await logOutAll({ idUsers: 1 }, { revokedAllToken: mockRevokeAllTokens });

        expect(result.httpCode).toEqual(200);
        expect(mockRevokeAllTokens).toHaveBeenCalled();
        expect(mockRevokeAllTokens).toHaveBeenCalledTimes(1);
        expect(mockRevokeAllTokens).toHaveBeenCalledWith({ idUsers: 1 });
    });

    it('Revocar un token individual', async () => {
        const tokenId = 'some-uuid'; // Puedes usar un UUID generado manualmente para la prueba
        const idUsers = 1;

        const mockRevokeSingleToken = jest.fn().mockResolvedValue({
            error: false,
            message: 'Token revocado',
            hasData: true,
            data: { revoked: 1 }
        });

        const result = await logOutSingle({ tokenId, idUsers }, { revokedSingleToken: mockRevokeSingleToken });

        expect(result.httpCode).toEqual(200);
        expect(mockRevokeSingleToken).toHaveBeenCalled();
        expect(mockRevokeSingleToken).toHaveBeenCalledTimes(1);
        expect(mockRevokeSingleToken).toHaveBeenCalledWith({ tokenId, idUsers });
    });
});
