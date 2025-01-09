export const logOutAll = async ({ idUsers }, { revokeAllTokens }) => {

    const resultRevoqued = await revokeAllTokens({ idUsers });
    if (resultRevoqued.error) return { httpCode: 500, response: resultRevoqued };
    if (!resultRevoqued.hasData) return { httpCode: 404, response: resultRevoqued };
    return { httpCode: 200, response: resultRevoqued }

};

export const logOutSingle = async ({ tokenId, idUsers }, { revokeSingleToken }) => {

    const resultRevoqued = await revokeSingleToken({ tokenId, idUsers });
    if (resultRevoqued.error) return { httpCode: 500, response: resultRevoqued };
    if (!resultRevoqued.hasData) return { httpCode: 404, response: resultRevoqued };
    return { httpCode: 200, response: resultRevoqued }

};