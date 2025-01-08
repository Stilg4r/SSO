export const refreshToken = async (
    { idUsers, tokenId },
    {
        getUserById,
        getToken,
        findTokenByTokenId
    }
) => {

    const user = await getUserById({ id: idUsers });
    if (user.error) { return { httpCode: 500, response: user }; }
    if (!user.hasData) { return { httpCode: 404, response: user }; }
    const { data: { id } } = user;

    // buscar el token en la base de datos y validar si existe y si no ha sido revocado
    const token = await findTokenByTokenId({ tokenId });
    if (token.error) return { httpCode: 500, response: token };
    if (!token.hasData) return { httpCode: 404, response: token };
    const { data: { revoked } } = token;
    if (revoked) return { httpCode: 401, response: { message: 'Token revocado', data: {} } };

    // Generar token accesso
    const accessToken = await getToken({ payload: { user: { id } }, options: { expiresIn: '1h' } });
    if (accessToken.error) return { httpCode: 500, response: accessToken };

    return {
        httpCode: 200,
        response: {
            message: 'Renovación de token correcta',
            data: {
                accessToken: accessToken.data.token
            }
        }
    };

};