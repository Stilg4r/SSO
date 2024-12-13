import { string } from "../../../core/validation/commons.validation.js";
import Joi from "joi";

export const authenticationByPasswordValidation = Joi.object({
    user: string.label('nombre de usuario'),
    pass: string.label('password')
});
