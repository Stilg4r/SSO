import request from 'supertest';
import express from 'express';
import { authorizationMiddleware } from '../../middlewares/autorization.middleware.js';
import { authorizationHandler } from '../../services/autorizationsHandlers.service.js';
import { CustomError } from '../../../../core/middlewares/errorsHandlers.middleware.js';

jest.mock('../../services/autorizationsHandlers.js', () => ({
    authorizationHandler: jest.fn(),
}));

jest.mock('../../../../core/middlewares/errorsHandlers.middleware.js', () => ({
    CustomError: jest.fn((message, statusCode) => ({ message, statusCode })),
}));

const app = express();

// Middleware y ruta de prueba
app.use(express.json());
app.use(authorizationMiddleware);
app.get('/', (req, res) => res.status(200).send({ token: req.token }));

describe('authorizationMiddleware', () => {
    let mockHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        mockHandler = jest.fn();
    });

    it('debería retornar error si no se proporciona el encabezado Authorization', async () => {
        const response = await request(app).get('/');

        expect(CustomError).toHaveBeenCalledWith("Token requerido", 401);
        expect(response.status).toBe(401);
        expect(response.body).toEqual({});
    });

    it('debería manejar el token correctamente si el encabezado es válido', async () => {
        mockHandler.mockResolvedValue({
            error: false,
            message: 'Token válido',
            data: { userId: 123 },
        });
        authorizationHandler.mockReturnValue({
            error: false,
            message: 'Función de autorización encontrada',
            data: mockHandler,
        });

        const response = await request(app)
            .get('/')
            .set('Authorization', 'Bearer validToken');

        expect(authorizationHandler).toHaveBeenCalledWith('Bearer');
        expect(mockHandler).toHaveBeenCalledWith('validToken');
        expect(response.status).toBe(200);
        expect(response.body.token).toEqual({ userId: 123 });
    });

    it('debería retornar error si el tipo de autorización no es soportado', async () => {
        authorizationHandler.mockReturnValue({
            error: true,
            message: 'Tipo de autorización no soportado',
        });

        const response = await request(app)
            .get('/')
            .set('Authorization', 'Unsupported validToken');

        expect(authorizationHandler).toHaveBeenCalledWith('Unsupported');
        expect(CustomError).toHaveBeenCalledWith('Tipo de autorización no soportado', 401);
        expect(response.status).toBe(401);
    });

    it('debería retornar error si el token es inválido', async () => {
        mockHandler.mockResolvedValue({
            error: true,
            message: 'Token inválido',
            data: {},
        });
        authorizationHandler.mockReturnValue({
            error: false,
            message: 'Función de autorización encontrada',
            data: mockHandler,
        });

        const response = await request(app)
            .get('/')
            .set('Authorization', 'Bearer invalidToken');

        expect(authorizationHandler).toHaveBeenCalledWith('Bearer');
        expect(mockHandler).toHaveBeenCalledWith('invalidToken');
        expect(CustomError).toHaveBeenCalledWith('Token inválido', 401);
        expect(response.status).toBe(401);
    });

    it('debería retornar error si el formato del token es inválido', async () => {
        const response = await request(app)
            .get('/')
            .set('Authorization', 'InvalidFormatToken');

        expect(CustomError).toHaveBeenCalledWith('Formato inválido', 400);
        expect(response.status).toBe(400);
    });

    it('debería manejar errores inesperados correctamente', async () => {
        authorizationHandler.mockImplementation(() => {
            throw new Error('Unexpected error');
        });

        const response = await request(app)
            .get('/')
            .set('Authorization', 'Bearer validToken');

        expect(CustomError).toHaveBeenCalledWith('Error en la autorización', 401);
        expect(response.status).toBe(401);
    });
});