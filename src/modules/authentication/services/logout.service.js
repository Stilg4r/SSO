export const logOutAll = async ({ idUsers }, { revokedAllToken }) => {

    const resultRevoqued = await revokedAllToken({ idUsers });
    if (resultRevoqued.error) return { httpCode: 500, response: resultRevoqued };
    const { data: { revoked } } = resultRevoqued;

    const message = (revoked > 0) ? 'Todas las sesiones cerradas correctamente' : 'No se encontraron sesiones activas';

    return {
        httpCode: 200,
        response: {
            error: false,
            message,
            data: { revoked }
        }
    }
};

export const logOutSingle = async ({ tokenId, idUsers }, { revokedSingleToken }) => {

    const resultRevoqued = await revokedSingleToken({ tokenId, idUsers });
    if (resultRevoqued.error) return { httpCode: 500, response: resultRevoqued };
    const { data: { revoked } } = resultRevoqued;

    const message = (revoked > 0) ? 'Sesión cerrada correctamente' : 'No se encontraron sesiones';

    return {
        httpCode: 200,
        response: {
            error: false,
            message,
            data: { revoked }
        }
    }

};