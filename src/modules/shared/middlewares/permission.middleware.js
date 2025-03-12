import { CustomError } from '../../../core/middlewares/errorsHandlers.middleware.js';
import { permissionChecker } from '../services/permissions.service.js';
import { getUserPermissions } from '../infrastructura/userPermissions.db.js';

// funcion que descompone la url 
const getModuleAndUrl = (path) => {
    try {
        const regex = /^\/([^\/]*)(?:\/(.*))?$/;
        const match = path.match(regex);
        if (match) {
            return {
                module: match[1],
                url: match[2] ?? ''
            };
        }
        throw new CustomError('No se pudo descomponer la url', 500);
    }
    catch (error) {
        console.error(error);
        throw new CustomError(error.toString(), 500);
    }
}

// Middleware que valida que tenga el permiso
export const permissionMiddleware = async (req, res, next) => {

    const {
        token: { user: { id: userId }, permissions },
        method, path
    } = req;

    const { module, url } = getModuleAndUrl(path);
    const permission = await permissionChecker(
        {
            permissions,
            module,
            method: method.toUpperCase(),
            url,
            userId
        },
        { getUserPermissions }
    );

    if (permission.error) {
        throw new CustomError(permission.message, 403, permission.data);
    }

    next();
};

