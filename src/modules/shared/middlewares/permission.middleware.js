import { CustomError } from '../../../core/middlewares/errorsHandlers.middleware.js';
import { permissionChecker } from '../services/permissions.service.js';
import { getUserPermissions } from '../infrastructura/userPermissions.db.js';

// Middleware que valida que tenga el permiso
export const permissionMiddleware = (req, res, next) => {

    const {
        token: { user: { id: userId }, permissions },
        method, path
    } = req;

    // extraer el modulo y la url 
    const [module, url] = path.split('/').slice(1);

    const permission = permissionChecker(
        {
            permissions,
            module,
            method,
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

