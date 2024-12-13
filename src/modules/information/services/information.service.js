export const informationApi = async () => {
    return {
        httpCode: 200,
        response: {
            message: 'Api de sso',
            data: {
                version: '0.1.0',
            },
        }
    }
};