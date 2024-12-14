import { getUser, getUserById } from '../../infrastructura/users.db.js';
import db from '../../../../core/infrastructure/dataBase/dbInstance.js';
import path from 'path';

describe('Servicios de usuario', () => {
    // beforeAll(async () => {
    //     const directoryMigration = path.join(__dirname, '/../../../../core/infrastructure/dataBase/migrations/authentication');
    //     await db.migrate.latest({ directory: directoryMigration });
    //     const directorySeed = path.join(__dirname, '/../../../../core/infrastructure/dataBase/seeds/authentication');
    //     await db.seed.run({ directory: directorySeed });
    // });

    // afterAll(async () => {
    //     await db.destroy();
    // });

    describe('getUser', () => {
        it('Debe retornar un usuario válido', async () => {
            const result = await getUser({ user: 'test' });

            expect(result.error).toBeUndefined();
            expect(result.hasData).toBe(true);
            expect(result.message).toBe('Usuario encontrado');
            expect(result.data).toHaveProperty('id', 1);
            expect(result.data).toHaveProperty('password');
        });

        it('Debe retornar mensaje si el usuario no existe', async () => {
            const result = await getUser({ user: 'nonexistent' });

            expect(result.error).toBeUndefined();
            expect(result.hasData).toBe(false);
            expect(result.message).toBe('Usuario no encontrado');
            expect(result.data).toEqual({});
        });

        it('Debe ignorar usuarios marcados como eliminados', async () => {
            const result = await getUser({ user: 'deleted_user' });

            expect(result.error).toBeUndefined();
            expect(result.hasData).toBe(false);
            expect(result.message).toBe('Usuario no encontrado');
            expect(result.data).toEqual({});
        });

    });

    describe('getUserById', () => {
        it('Debe retornar un usuario válido por ID', async () => {
            const result = await getUserById({ id: 1 });

            expect(result.error).toBeUndefined();
            expect(result.hasData).toBe(true);
            expect(result.message).toBe('Usuario encontrado');
            expect(result.data).toHaveProperty('id', 1);
            expect(result.data).toHaveProperty('user', 'test');
        });

        it('Debe retornar mensaje si no encuentra un usuario por ID', async () => {
            const result = await getUserById({ id: 9999 });

            expect(result.error).toBeUndefined();
            expect(result.hasData).toBe(false);
            expect(result.message).toBe('Usuario no encontrado');
            expect(result.data).toEqual({});
        });

        it('Debe ignorar usuarios marcados como eliminados al buscar por ID', async () => {
            const result = await getUserById({ id: 2 });

            expect(result.error).toBeUndefined();
            expect(result.hasData).toBe(false);
            expect(result.message).toBe('Usuario no encontrado');
            expect(result.data).toEqual({});
        });
    });
});
