import { string } from "../../../core/validation/commons.validation.js";
import Joi from "joi";

export const authenticationByPasswordValidation = Joi.object({
    user: string.label('nombre de usuario'),
    pass: string.label('password')
});

export const renewTokenValidation = Joi.object({
    jti: Joi.string().uuid().required().messages({
        'any.required': 'El id del token es requerido, use el token de refresco',
    })
}).options({
    abortEarly: false,
    stripUnknown: false,
    allowUnknown: true
});
