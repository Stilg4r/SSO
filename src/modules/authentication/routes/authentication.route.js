import Router from 'express';

import {
    jsonHeader,
    validateRequest,
    validateHttpMethod
} from '../../../core/middlewares/validation.middleware.js';

import {
    postAuthenticationByPassword,
    getLogOut
} from '../controllers/authentication.controller.js';
import { authenticationByPasswordValidation } from '../validation/authentication.validation.js';
import { authorizationMiddleware } from '../../shared/middlewares/autorization.middleware.js';

const endPoints = Router();

endPoints.route('/password')
    .post(
        validateHttpMethod('post'),
        jsonHeader,
        validateRequest(authenticationByPasswordValidation, 'body'),
        postAuthenticationByPassword
    );

endPoints.route('/logout')
    .get(
        validateHttpMethod('get'),
        authorizationMiddleware,
        getLogOut
    );


export default endPoints;


