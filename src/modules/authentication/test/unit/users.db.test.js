import { getUser } from '../../infrastructura/users.db.js';
import db from '../../../../core/infrastructure/dataBase/dbInstance.js';
import path from 'path';


describe('getUser service', () => {
    beforeAll(async () => {
        // const directoryMigration = path.join(__dirname, '/../../../../core/infrastructure/dataBase/migrations/authentication');
        // await db.migrate.latest({ directory: directoryMigration });
        // const directorySeed = path.join(__dirname, '/../../../../core/infrastructure/dataBase/seeds/authentication');
        // await db.seed.run({ directory: directorySeed });
    });

    afterAll(async () => {
        // await db.destroy();
    });

    it('Debe retornar un usuario válido', async () => {
        const result = await getUser({ user: 'test' });

        expect(result.hasData).toBe(true);
        expect(result.message).toBe('Usuario encontrado');
        expect(result.data).toHaveProperty('password');
        expect(result.data).toHaveProperty('id');
    });

    it('Debe retornar error si el usuario no existe', async () => {
        const result = await getUser({ user: 'nonexistent' });

        expect(result.hasData).toBe(false);
        expect(result.message).toBe('Usuario no encontrado');
        expect(result.data).toEqual({});
    });

    it('Debe ignorar usuarios marcados como eliminados', async () => {
        const result = await getUser({ user: 'deleted_user' });

        expect(result.hasData).toBe(false);
        expect(result.message).toBe('Usuario no encontrado');
        expect(result.data).toEqual({});
    });
});
