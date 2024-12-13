import db from '../../../core/infrastructure/dataBase/dbInstance.js';
export const getUser = async ({ user }) => {
    try {
        const userFound = await db
            .select(
                'id',
                'password',
            )
            .from('users')
            .where({
                user,
                is_deleted: 0,
            })
            .first();
        if (userFound) {
            return {
                message: 'Usuario encontrado',
                hasData: true,
                data: userFound,
            };
        } else {
            return {
                message: 'Usuario no encontrado',
                hasData: false,
                data: {},
            };
        }
    } catch (error) {
        console.error(error);
        return {
            error: true,
            message: 'Error al busar usuario',
        };
    }
};