import { responseHandler } from '../services/responsesHandlers.service.js';

export const errorHandler = (err, req, res, next) => {
    // Determinar el código de estado
    const statusCode = err.status ?? 500;

    // Estructura de la respuesta de error
    const response = {
        error: true,
        message: err.message,
        data: err.data ?? { method: req.method, url: req.originalUrl, api: 'sso-api' },
    };

    return responseHandler(res, { httpCode: statusCode, response });

};

export class CustomError extends Error {
    constructor(message, status = 500, data = null) {
        super(message);
        this.status = status;
        this.data = data;
    }
}




