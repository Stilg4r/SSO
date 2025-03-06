import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

export const authenticationByPassword = async (
    { user, pass },
    {
        getUser,
        getToken,
        storeToken,
        revokeAllTokens,
        getUserPermissionsMolules
    }
) => {

    const userFound = await getUser({ user });
    if (userFound.error) return { httpCode: 500, response: userFound };
    if (!userFound.hasData) return { httpCode: 404, response: userFound };
    const { data: { password: hash, id } } = userFound;

    const isValid = bcrypt.compareSync(pass, hash);
    if (isValid) {

        // Obtener permisos de usuario 
        const modulesAllowed = await getUserPermissionsMolules({ id });
        if (modulesAllowed.error) return { httpCode: 500, response: modulesAllowed };
        if (!modulesAllowed.hasData) return { httpCode: 404, response: modulesAllowed };
        const { data: permissions } = modulesAllowed;

        // Generar token refresh y access 
        const tokenId = randomUUID();
        const refreshToken = await getToken({
            payload: {
                user: { id }
            },
            options: { expiresIn: '7h', jti: tokenId }
        });
        if (refreshToken.error) return { httpCode: 500, response: refreshToken };

        const accessToken = await getToken({
            payload: { user: { id }, permissions },
            options: { expiresIn: '1h' }
        });
        if (accessToken.error) return { httpCode: 500, response: accessToken };

        const resultRevoqued = await revokeAllTokens({ idUsers: id });
        if (resultRevoqued.error) return { httpCode: 500, response: resultRevoqued };

        const saveTokenRefresh = await storeToken({ token: refreshToken.data.token, tokenId });
        if (saveTokenRefresh.error) return { httpCode: 500, response: saveTokenRefresh };

        return {
            httpCode: 200,
            response: {
                message: 'Inicio de sesión correcto',
                data: {
                    refreshToken: refreshToken.data.token,
                    accessToken: accessToken.data.token
                }
            }
        };
    } else {
        return {
            httpCode: 401,
            response: { message: 'Usuario no autorizado', data: {} }
        };
    }
};