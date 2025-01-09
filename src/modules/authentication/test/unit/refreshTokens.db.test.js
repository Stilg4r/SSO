import { saveToken, revokeAllTokens, revokeSingleToken } from '../../infrastructura/refreshTokens.db.js';
import db from '../../../../core/infrastructure/dataBase/dbInstance.js';
import { randomUUID } from 'crypto';

describe('tokens db', () => {
    beforeAll(async () => {
        // await db.migrate.latest({ directory: directoryMigration });
        // const directorySeed = path.join(__dirname, '/../../../../core/infrastructure/dataBase/seeds/authentication');
        // await db.seed.run({ directory: directorySeed });
    });

    afterAll(async () => {
        await db.destroy();
    });

    it('Debería almacenar un token en la base de datos', async () => {
        const tokenId = randomUUID();
        const token = randomUUID();
        const expiresAt = new Date(Date.now()).toISOString();

        const result = await saveToken({
            tokenId,
            token,
            expiresAt,
            idUsers: 1,
            createdBy: 1
        });

        expect(result.error).toBe(false);
        expect(result.hasData).toBe(true);
        expect(result.data).toHaveProperty('idRefreshTokens');
        expect(result.data.idRefreshTokens).toBeGreaterThan(0);
    });

    it('Debería manejar un error al intentar guardar un token', async () => {
        const result = await saveToken({
            // Falta algún valor obligatorio para provocar un error
            tokenId: null,
            token: randomUUID(),
            expiresAt: new Date(Date.now()).toISOString(),
            idUsers: 1,
            createdBy: 1
        });

        expect(result.error).toBe(true);
        expect(result.message).toBe('Error al guardar el token');
    });

    it('Debería revocar todos los tokens de un usuario', async () => {
        const result = await revokeAllTokens({ idUsers: 1 });

        expect(result.error).toBe(false);
        expect(result.hasData).toBe(true);
        expect(result.data).toHaveProperty('revoked');
        expect(result.data.revoked).toBeGreaterThan(0);
    });

    it('Debería manejar el caso cuando no hay tokens para revocar', async () => {
        const result = await revokeAllTokens({ idUsers: 999 }); // Usuario inexistente

        expect(result.error).toBe(false);
        expect(result.hasData).toBe(false);
        expect(result.data).toHaveProperty('revoked');
        expect(result.data.revoked).toBe(0);
        expect(result.message).toBe('No se encontraron tokens activos');
    });

    it('Debería revocar un token individual', async () => {
        const tokenId = randomUUID();
        await saveToken({
            tokenId,
            token: randomUUID(),
            expiresAt: new Date(Date.now()).toISOString(),
            idUsers: 1,
            createdBy: 1
        });

        const result = await revokeSingleToken({ tokenId, idUsers: 1 });

        expect(result.error).toBe(false);
        expect(result.hasData).toBe(true);
        expect(result.data).toHaveProperty('revoked');
        expect(result.data.revoked).toBe(1);
    });

    it('Debería manejar el caso cuando un token no existe', async () => {
        const result = await revokeSingleToken({ tokenId: randomUUID(), idUsers: 1 });

        expect(result.error).toBe(false);
        expect(result.hasData).toBe(false);
        expect(result.data).toHaveProperty('revoked');
        expect(result.data.revoked).toBe(0);
        expect(result.message).toBe('Token no encontrado');
    });

    it('Debería manejar cuando no se encuentra un token por su ID', async () => {
        const result = await findTokenByTokenId({ tokenId: randomUUID() });

        expect(result.error).toBe(false);
        expect(result.hasData).toBe(false);
        expect(result.message).toBe('Token no encontrado');
    });

});