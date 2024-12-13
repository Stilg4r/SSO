import { saveToken, revokedAllToken, revokedSingleToken } from '../../infrastructura/refreshTokens.db.js';
import db from '../../../../core/infrastructure/dataBase/dbInstance.js';
import path from 'path';
import { randomUUID } from 'crypto';

describe('tokens db', () => {
    beforeAll(async () => {
        // const directoryMigration = path.join(__dirname, '/../../../../core/infrastructure/dataBase/migrations/authentication');
        // await db.migrate.latest({ directory: directoryMigration });
        // const directorySeed = path.join(__dirname, '/../../../../core/infrastructure/dataBase/seeds/authentication');
        // await db.seed.run({ directory: directorySeed });
    });

    afterAll(async () => {
        // await db.destroy();
    });

    it('Almacenar un token en la base de datos', async () => {
        const result = await saveToken({
            tokenId: randomUUID(),
            token: randomUUID(),
            expiresAt: new Date(Date.now()).toISOString(),
            idUsers: 1,
            createdBy: 1
        });

        expect(result.error).toBe(false);
        expect(result.hasData).toBe(true);
        expect(result.data.idRefreshTokens).toBeDefined(); // Verificar que se haya guardado un token
        expect(result.data.idRefreshTokens).toBeGreaterThan(0);
    });

    it('Revocar todos los tokens de un usuario', async () => {
        const result = await revokedAllToken({ idUsers: 1 });

        expect(result.error).toBe(false);
        expect(result.hasData).toBe(true);
        expect(result.data.revoked).toBeDefined(); // Verificar que se hayan revocado tokens
        expect(result.data.revoked).toBeGreaterThan(0);
    });

    it('Revocar un token individual', async () => {
        const tokenId = randomUUID(); // Puedes usar un token que hayas creado previamente
        await saveToken({ tokenId, token: randomUUID(), expiresAt: new Date(Date.now()).toISOString(), idUsers: 1, createdBy: 1 });

        const result = await revokedSingleToken({ tokenId, idUsers: 1 });

        expect(result.error).toBe(false);
        expect(result.hasData).toBe(true);
        expect(result.data.revoked).toBeDefined(); // Verificar que se haya revocado el token
        expect(result.data.revoked).toBe(1); // Ajustar según la lógica de tu base de datos
    });
});