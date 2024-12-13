import { CustomError } from './errorsHandlers.middleware.js';

export const jsonHeader = (req, res, next) => {
    if (req.is('application/json')) {
        return next();
    } else {
        next(new CustomError("La petición debe ser de tipo JSON", 400));
    }
};

export const validateRequest = (schema, type = 'body', options = { abortEarly: false, stripUnknown: true }) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[type], options);
        if (error) {
            const { details } = error;
            const errorMessage = details.map((detail) => {
                const { message } = detail;
                const { context: { label, valor } } = detail;
                return `${label} ${message} y tiene el valor ${valor}`;
            }).join(', ');
            return next(new CustomError(`Errores de validación: ${errorMessage}`, 400));
        }
        req[type] = value;
        next();
    };
};

export const validateHttpMethod = (method) => {
    return (req, res, next) => {
        if (req.method.toLowerCase() === method.toLowerCase()) {
            return next();
        } else {
            next(new CustomError(`El método HTTP debe ser ${method.toUpperCase()}`, 405));
        }
    };
};

