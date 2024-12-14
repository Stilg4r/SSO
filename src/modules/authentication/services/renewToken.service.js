import { randomUUID } from 'crypto';
export const refreshToken = async (
    { idUsers, tokenId },
    {
        getUserById,
        getToken,
        storageToken,
        revokedSingleToken
    }
) => {

    const user = await getUserById({ id: idUsers });
    if (user.error) { return { httpCode: 500, response: user }; }
    if (!user.hasData) { return { httpCode: 404, response: user }; }
    const { data: { id } } = user;

    const resultRevoked = await revokedSingleToken({ tokenId, idUsers });
    if (resultRevoked.error) { return { httpCode: 500, response: resultRevoked }; }
    if (!resultRevoked.hasData) { return { httpCode: 404, response: resultRevoked }; }

    // Generar token refresh y access 
    const newtokenId = randomUUID();
    const refreshToken = await getToken({ payload: { user: { id } }, options: { expiresIn: '7h', jti: newtokenId } });
    if (refreshToken.error) return { httpCode: 500, response: refreshToken };

    const accessToken = await getToken({ payload: { user: { id } }, options: { expiresIn: '1h' } });
    if (accessToken.error) return { httpCode: 500, response: accessToken };

    const saveTokenRefresh = await storageToken({ token: refreshToken.data.token, tokenId: newtokenId });
    if (saveTokenRefresh.error) return { httpCode: 500, response: saveTokenRefresh };

    return {
        httpCode: 200,
        response: {
            message: 'Renovación de token correcta',
            data: {
                refreshToken: refreshToken.data.token,
                accessToken: accessToken.data.token
            }
        }
    };

};