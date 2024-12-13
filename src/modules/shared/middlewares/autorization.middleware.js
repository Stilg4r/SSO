import { CustomError } from '../../../core/middlewares/errorsHandlers.middleware.js';
import { authorizationHandler } from '../services/autorizationsHandlers.js';

export const authorizationMiddleware = async (req, res, next) => {
    const { headers: { authorization } } = req;

    if (!authorization) {
        return next(new CustomError("Token requerido", 401));
    }

    try {
        const regex = /(\w+)\s+(.+)/;
        const match = authorization.match(regex);

        if (match) {
            const type = match[1];
            const token = match[2];

            const handler = authorizationHandler(type);

            if (handler.error) {
                return next(new CustomError(handler.message, 401));
            }

            const { data: handlerFunction } = handler;

            const decodedToken = await handlerFunction(token);
            if (decodedToken.error) {
                return next(new CustomError(decodedToken.message, 401));
            }

            req.token = decodedToken.data;
            next();
        } else {
            return next(new CustomError("Formato inválido", 400));
        }
    } catch (error) {
        console.error('Authorization error:', error);
        return next(new CustomError("Error en la autorización", 401));
    }
};