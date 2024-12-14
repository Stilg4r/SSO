
import db from '../../../core/infrastructure/dataBase/dbInstance.js';
const TABLE = 'refresh_tokens';

export const saveToken = async (values) => {
    const {
        tokenId,
        token,
        idUsers,
        expiresAt,
        createdBy
    } = values;

    try {
        const result = await db(TABLE).insert({
            token_id: tokenId,
            token,
            id_users: idUsers,
            created_by: createdBy,
            expires_at: expiresAt
        });
        const [idRefreshTokens] = result;
        return {
            error: false,
            message: 'Token guardado',
            hasData: true,
            data: { idRefreshTokens }
        };
    } catch (error) {
        console.error(error);
        return {
            error: true,
            message: 'Error al guardar el token',
        };
    }
};

export const revokedAllToken = async ({ idUsers }) => {

    try {
        const result = await db(TABLE)
            .where({
                id_users: idUsers,
                is_revoked: false
            })
            .update({ is_revoked: true });

        if (result === 0) {
            return {
                error: false,
                message: 'No se encontraron tokens activos',
                hasData: false,
                data: { revoked: result }
            };
        }

        return {
            error: false,
            message: 'Tokens revocados',
            hasData: true,
            data: { revoked: result }
        };

    } catch (error) {
        console.error(error);
        return {
            error: true,
            message: 'Error al revocar los tokens',
            hasData: false,
            data: {}
        };
    }
};

export const revokedSingleToken = async ({ tokenId, idUsers }) => {

    try {
        const result = await db(TABLE)
            .where({
                id_users: idUsers,
                token_id: tokenId,
                is_revoked: false
            })
            .update({ is_revoked: true });

        if (result === 0) {
            return {
                error: false,
                message: 'Token no encontrado',
                hasData: false,
                data: { revoked: result }
            };
        }

        return {
            error: false,
            message: 'Token revocado',
            hasData: true,
            data: { revoked: result }
        };
    } catch (error) {
        console.error(error);
        return {
            error: true,
            message: 'Error al revocar el token',
            hasData: false,
            data: {}
        };
    }
};