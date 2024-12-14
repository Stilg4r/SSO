export const logOutAll = async ({ idUsers }, { revokedAllToken }) => {

    const resultRevoqued = await revokedAllToken({ idUsers });
    if (resultRevoqued.error) return { httpCode: 500, response: resultRevoqued };
    if (!resultRevoqued.hasData) return { httpCode: 404, response: resultRevoqued };
    return { httpCode: 200, response: resultRevoqued }

};

export const logOutSingle = async ({ tokenId, idUsers }, { revokedSingleToken }) => {

    const resultRevoqued = await revokedSingleToken({ tokenId, idUsers });
    if (resultRevoqued.error) return { httpCode: 500, response: resultRevoqued };
    if (!resultRevoqued.hasData) return { httpCode: 404, response: resultRevoqued };
    return { httpCode: 200, response: resultRevoqued }

};