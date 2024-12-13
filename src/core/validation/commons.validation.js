import Joi from "joi";

export const string = Joi.string().trim().required().messages({
    'string.base': 'debe ser de tipo texto',
    'string.empty': 'no puede estar vacío',
    'any.required': 'es requerido',
});
