import { authenticationByPassword } from '../services/autenticacionByPassword.service.js';
import { logOutAll, logOutSingle } from '../services/logout.service.js';
import { responseHandler } from '../../../core/services/responsesHandlers.service.js';
import { getUser, getUserById } from '../infrastructura/users.db.js';
import { getToken, storageToken } from '../../shared/services/token.service.js';
import { revokedAllToken, revokedSingleToken, findTokenByTokenId } from '../infrastructura/refreshTokens.db.js';
import { refreshToken } from '../services/renewToken.service.js';

export const postAuthenticationByPassword = async (req, res) => {
    const {
        body: {
            user, pass
        }
    } = req
    const result = await authenticationByPassword(
        { user, pass },
        { getUser, getToken, storageToken, revokedAllToken }
    );
    return responseHandler(res, result);
};

export const getLogOut = async (req, res) => {
    const { token: { user: { id }, jti } } = req;

    if (jti === undefined) {

        const result = await logOutAll(
            { idUsers: id },
            { revokedAllToken }
        );

        return responseHandler(res, result);

    } else {

        const result = await logOutSingle(
            { tokenId: jti, idUsers: id },
            { revokedSingleToken }
        );

        return responseHandler(res, result);
    }

};

export const getRenewToken = async (req, res) => {
    const { token: { user: { id }, jti } } = req;

    const result = await refreshToken(
        { idUsers: id, tokenId: jti },
        { getUserById, getToken, findTokenByTokenId }
    );

    return responseHandler(res, result);

};
