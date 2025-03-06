import { getUserPermissionsMolules } from '../../infrastructura/modules.db.js';
import db from '../../../../core/infrastructure/dataBase/dbInstance.js';

describe('getUserPermissionsMolules', () => {
    beforeAll(async () => {
        // Aquí puedes ejecutar migraciones/seedings si es necesario.
        // Por ejemplo:
        // await db.migrate.latest({ directory: pathToMigrations });
        // await db.seed.run({ directory: pathToSeeds });
    });

    afterAll(async () => {
        await db.destroy();
    });

    it('Debería retornar los permisos para un usuario existente (id: 3)', async () => {
        const result = await getUserPermissionsMolules({ id: 3 });

        expect(result.error).toBe(false);
        expect(result.message).toBe('Permisos encontrados');
        expect(result.hasData).toBe(true);
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data.length).toBe(2);

        const moduloFullAccess = result.data.find(modulo => modulo.id === 1);
        const moduloGranularAccess = result.data.find(modulo => modulo.id === 2);

        expect(moduloFullAccess).toBeDefined();
        expect(moduloFullAccess.name).toBe('fullAccess');
        expect(moduloFullAccess.fullAccess).toBe(1);

        expect(moduloGranularAccess).toBeDefined();
        expect(moduloGranularAccess.name).toBe('granularAccess');
        expect(moduloGranularAccess.fullAccess).toBe(0);
    });

    it('Debería retornar un array vacío para un usuario sin permisos (id: 999)', async () => {
        const result = await getUserPermissionsMolules({ id: 999 });

        expect(result.error).toBe(false);
        expect(result.message).toBe('Permisos encontrados');
        expect(result.hasData).toBe(true);
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data.length).toBe(0);
    });

    // Opcional: probar el comportamiento cuando se envía un parámetro inválido
    it('Debería manejar el caso cuando no se provee un id válido', async () => {
        const result = await getUserPermissionsMolules({ id: undefined });
        // Dependiendo del comportamiento de la query, se puede esperar un array vacío o un error controlado.
        expect(result).toEqual({
            error: true,
            message: 'Error al buscar permisos',
            hasData: false,
            data: [],
        });
    });
});
