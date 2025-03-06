import { bearerAuthorization, authorizationHandler, authorizations } from '../../services/autorizationsHandlers.service.js';
import { verifyToken } from '../../services/token.service.js';

// Mock de la función verifyToken
jest.mock('../../services/token.service.js', () => ({
    verifyToken: jest.fn(),
}));


describe('bearerAuthorization', () => {
    it('debe devolver error si no se proporciona un token', async () => {
        const result = await bearerAuthorization();
        expect(result).toEqual({
            error: true,
            message: 'Token requerido',
            data: {}
        });
    });

    it('debe devolver datos si el token es válido', async () => {
        verifyToken.mockResolvedValue({
            error: false,
            message: 'Token válido',
            data: { userId: 1 }
        });

        const result = await bearerAuthorization('valid-token');
        expect(result).toEqual({
            error: false,
            message: 'Token válido',
            data: { userId: 1 }
        });
    });

    it('debe devolver error si el token es inválido', async () => {
        verifyToken.mockResolvedValue({
            error: true,
            message: 'Token inválido',
            data: {}
        });

        const result = await bearerAuthorization('invalid-token');
        expect(result).toEqual({
            error: true,
            message: 'Token inválido',
            data: {}
        });
    });
});

describe('authorizationHandler', () => {
    it('debe devolver error si el tipo de autorización no está soportado', () => {
        const result = authorizationHandler('UnsupportedType');
        expect(result).toEqual({
            error: true,
            message: 'Tipo de autorización no soportado',
            data: {}
        });
    });

    it('debe devolver la función de autorización si el tipo está soportado', () => {
        const result = authorizationHandler('Bearer');
        expect(result).toEqual({
            error: false,
            message: 'Función de autorización encontrada',
            data: expect.any(Function) // Verifica que se devuelva una función
        });
    });
});