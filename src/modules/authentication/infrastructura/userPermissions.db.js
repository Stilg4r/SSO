import db from '../../../core/infrastructure/dataBase/dbInstance.js';
const TABLE = 'user_permissions';

// Dado un usuario, y un modulo, se obtienen los permisos que tiene el usuario sobre el modulo
export const getUserPermissions = async ({ userId, moduleId }) => {
    try {
        const result = await db({ up: TABLE })

            .select({
                name: 'm.name',
                url: 'u.url',
                delete: 'up.can_delete',
                get: 'up.can_get',
                post: 'up.can_post',
                put: 'up.can_put',
                patch: 'up.can_patch'
            })

            .innerJoin({ u: 'urls' }, function () {
                this.on('u.id', '=', 'up.url_id')
                    .andOn('u.is_deleted', '=', db.raw('?', [false]))
                    .andOn('u.module_id', '=', db.raw('?', [moduleId]))
            })

            .innerJoin({ m: 'modules' }, function () {
                this.on('u.module_id', '=', 'm.id')
                    .andOn('m.is_deleted', '=', db.raw('?', [false]))
            })

            .where('up.user_id', userId)
            .andWhere('up.is_deleted', false);

        return {
            error: false,
            message: 'Permisos encontrados',
            hasData: true,
            data: result
        }
    } catch (error) {
        console.error(error);
        return {
            error: true,
            message: 'Error al buscar permisos',
            hasData: false,
            data: []
        }
    }
};
