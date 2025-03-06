import { V3 } from 'paseto';
import fs from 'fs';
import { saveToken } from '../../authentication/infrastructura/refreshTokens.db.js';
import { createHash } from 'crypto';
import { SYMMETRICKEYPATH } from '../../../../env.cjs';

export const getToken = async ({ payload, options }) => {
    const _options = options || { expiresIn: '1h' };

    if (!fs.existsSync(SYMMETRICKEYPATH)) {
        return {
            error: true,
            message: 'No se encontró la llave privada',
            data: {}
        };
    }
    try {
        const keyHex = fs.readFileSync(SYMMETRICKEYPATH);
        const symmetricKey = Buffer.from(keyHex, 'hex');
        const token = await V3.encrypt(payload, symmetricKey, _options)
        return ({
            error: false,
            message: 'Token generado',
            data: { token }
        });
    } catch (error) {
        console.error(error);
        return {
            error: true,
            message: 'Error al generar el token',
            data: error.toString()
        };
    }
};

export const verifyToken = async ({ token, options = {} }) => {

    if (!fs.existsSync(SYMMETRICKEYPATH)) {
        return {
            error: true,
            message: 'No se encontró la llave pública',
            data: {}
        };
    }
    try {
        const keyHex = fs.readFileSync(SYMMETRICKEYPATH);
        const symmetricKey = Buffer.from(keyHex, 'hex');
        const payload = await V3.decrypt(token, symmetricKey, options);
        return {
            error: false,
            message: 'Token verificado',
            data: payload
        };
    } catch (error) {
        console.error(error);
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