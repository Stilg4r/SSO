import { CustomError } from './errorsHandlers.middleware.js';

export const notFoundError = (req, res, next) => {
    next(new CustomError("well i've been here before ", 404));
};
