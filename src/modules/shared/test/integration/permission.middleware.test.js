import request from 'supertest';
import express from 'express';
import { permissionMiddleware } from '../../middlewares/permission.middleware.js';
import { CustomError } from '../../../../core/middlewares/errorsHandlers.middleware.js';
import { permissionChecker } from '../../services/permissions.service.js';

jest.mock('../../services/permissions.service.js', () => ({
    permissionChecker: jest.fn(),
}));

jest.mock('../../../../core/middlewares/errorsHandlers.middleware.js', () => ({
    CustomError: jest.fn((message, statusCode, data) => ({ message, statusCode, data })),
}));

const app = express();
app.use(express.json());

// Middleware para simular que req.token ya fue agregado (por ejemplo, en un middleware de autenticación)
app.use((req, res, next) => {
    req.token = {
        user: { id: 1 },
        // Semilla de permisos del usuario (por ejemplo, de la base de datos o el token)
        permissions: [
            {
                name: 'granularAccess',
                url: 'roles',
                get: 1,
                post: 0,
                put: 0,
                delete: 0,
                patch: 0,
            },
        ],
    };
    next();
});

// Uso del middleware de permisos
app.use(permissionMiddleware);

// Ruta dummy para verificar que el middleware permita el acceso
app.get('/granularAccess/roles', (req, res) =>
    res.status(200).json({ message: 'Access granted' })
);

// Middleware de manejo de errores para capturar CustomError lanzados por el middleware
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ message: err.message, data: err.data });
});

describe('permissionMiddleware', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debería permitir el acceso si permissionChecker retorna permiso válido', async () => {
        // Simulamos que el chequeo de permisos es exitoso
        permissionChecker.mockReturnValue({
            error: false,
            message: 'Permission granted',
            data: { module: 'granularAccess', url: 'roles', method: 'GET' },
        });

        const response = await request(app).get('/granularAccess/roles');

        // Verificar que permissionChecker se llamó con los parámetros correctos
        expect(permissionChecker).toHaveBeenCalledWith(
            {
                permissions: [
                    {
                        name: 'granularAccess',
                        url: 'roles',
                        get: 1,
                        post: 0,
                        put: 0,
                        delete: 0,
                        patch: 0,
                    },
                ],
                module: 'granularAccess',
                method: 'GET',
                url: 'roles',
                userId: 1,
            },
            { getUserPermissions: expect.any(Function) }
        );

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Access granted' });
    });

    it('debería lanzar un CustomError y retornar error 403 si permissionChecker retorna error', async () => {
        // Simulamos que no se tienen permisos granulares para el módulo solicitado
        permissionChecker.mockReturnValue({
            error: true,
            message: 'No permission for this module',
            data: 'granularAccess',
        });

        const response = await request(app).get('/granularAccess/roles');

        expect(CustomError).toHaveBeenCalledWith('No permission for this module', 403, 'granularAccess');
        expect(response.status).toBe(403);
        expect(response.body).toEqual({
            message: 'No permission for this module',
            data: 'granularAccess',
        });
    });
});
