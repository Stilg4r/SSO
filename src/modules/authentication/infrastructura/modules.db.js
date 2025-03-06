import db from '../../../core/infrastructure/dataBase/dbInstance.js';
const TABLE = 'modules';
// Consulta para optener los permisos de un usuario por su id
export const getUserPermissionsMolules = async ({ id }) => {
    try {
        const result = await db({ m: TABLE })

            .select({
                id: 'm.id',
                name: 'm.name',
                fullAccess: 'uma.full_access'
            })

            .innerJoin({ uma: "user_module_access" }, function () {
                this.on('m.id', '=', 'uma.module_id')
                    .andOn('m.is_deleted', '=', db.raw('?', [false]));
            })

            .where('uma.user_id', id)
            .andWhere('uma.is_deleted', false);

        return {
            error: false,
            message: 'Permisos encontrados',
            hasData: true,
            data: result,
        };

    } catch (error) {
        console.error(error);
        return {
            error: true,
            message: 'Error al buscar permisos',
            hasData: false,
            data: [],
        };
    }
};