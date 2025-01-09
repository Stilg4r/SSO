import { V3, errors as pasetoErros } from 'paseto';
import fs from 'fs';
import { saveToken } from '../../authentication/infrastructura/refreshTokens.db.js';
import { createHash } from 'crypto';
import { PRIVATEKEYPATH, PUBLICKEYPATH } from '../../../../env.cjs';

export const getToken = async ({ payload, options }) => {
    const _options = options || { expiresIn: '1h' };

    if (!fs.existsSync(PRIVATEKEYPATH)) {
        return {
            error: true,
            message: 'No se encontró la llave privada',
            data: {}
        };
    }
    try {
        const privateKey = fs.readFileSync(PRIVATEKEYPATH);
        const token = await V3.sign(payload, privateKey.toString(), _options);
        return ({
            error: false,
            message: 'Token generado',
            data: { token }
        });
    } catch (error) {
        return {
            error: true,
            message: 'Error al generar el token',
            data: error.toString()
        };
    }
};

export const verifyToken = async ({ token, options = {} }) => {

    if (!fs.existsSync(PUBLICKEYPATH)) {
        return {
            error: true,
            message: 'No se encontró la llave pública',
            data: {}
        };
    }
    try {
        const publicKey = fs.readFileSync(PUBLICKEYPATH);
        const payload = await V3.verify(token, publicKey.toString(), options);
        return {
            error: false,
            message: 'Token verificado',
            data: payload
        };
    } catch (error) {
        return {
            error: true,
            message: error.toString(),
            data: {}
        };
    }
};

export const storeToken = async ({ token, tokenId }, verifyFn = verifyToken) => {
    const validToken = await verifyFn({ token });
    if (validToken.error) { return validToken };
    const { data: { user: { id }, exp } } = validToken;

    const resultSalved = await saveToken({
        tokenId,
        token: createHash('sha256').update(token).digest('hex'),
        idUsers: id,
        expiresAt: exp,
        createdBy: id,
    });

    return resultSalved;

};