import { getUserPermissions } from '../../infrastructura/userPermissions.db.js'; // Ajusta la ruta según tu estructura de proyecto
import db from '../../../../core/infrastructure/dataBase/dbInstance.js';

describe('getUserPermissions', () => {
    beforeAll(async () => {
        // Ejecuta migraciones/seedings si es necesario.
        // Ejemplo:
        // await db.migrate.latest({ directory: pathToMigrations });
        // await db.seed.run({ directory: pathToSeeds });
    });

    afterAll(async () => {
        await db.destroy();
    });

    it('Debería retornar los permisos para un usuario y módulo existentes (userId: 3, moduleId: 2)', async () => {
        const result = await getUserPermissions({ userId: 3, moduleId: 2 });

        expect(result.error).toBe(false);
        expect(result.message).toBe('Permisos encontrados');
        expect(result.hasData).toBe(true);
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data.length).toBe(1);

        const permiso = result.data[0];
        expect(permiso).toHaveProperty('name', 'granularAccess');
        expect(permiso).toHaveProperty('url', 'roles');
        expect(permiso).toHaveProperty('delete', 0);
        expect(permiso).toHaveProperty('get', 1);
        expect(permiso).toHaveProperty('post', 0);
        expect(permiso).toHaveProperty('put', 0);
        expect(permiso).toHaveProperty('patch', 0);
    });

    it('Debería retornar un array vacío para un usuario sin permisos (userId: 999)', async () => {
        const result = await getUserPermissions({ userId: 999, moduleId: 2 });

        expect(result.error).toBe(false);
        expect(result.message).toBe('Permisos encontrados');
        expect(result.hasData).toBe(true);
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data.length).toBe(0);
    });

    it('Debería manejar el caso cuando no se provee un userId válido', async () => {
        const result = await getUserPermissions({ userId: undefined, moduleId: 2 });
        expect(result).toEqual({
            error: true,
            message: 'Error al buscar permisos',
            hasData: false,
            data: [],
        });
    });

    // Opcional: también se puede probar el comportamiento cuando moduleId es inválido
    it('Debería manejar el caso cuando no se provee un moduleId válido', async () => {
        const result = await getUserPermissions({ userId: 3, moduleId: undefined });
        expect(result).toEqual({
            error: true,
            message: 'Error al buscar permisos',
            hasData: false,
            data: [],
        });
    });
});
