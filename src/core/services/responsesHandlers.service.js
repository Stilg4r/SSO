const httpCodes = new Map([
    [200, 'Ok, la petición fue correcta'],
    [401, 'No tiene autorización para este recurso'],
    [500, 'Error interno del servidor'],
]);
export const responseHandler = (res, dataResponse) => {
    try {
        const {
            httpCode = 500,
            response = { error: true, message: "Sin datos de respuesta", data: dataResponse },
        } = dataResponse;

        const {
            message = httpCodes.get(httpCode) ?? "Código sin mensaje",
            ...rest
        } = response;

        return res.status(httpCode).json({
            error: false,
            message,
            ...rest,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            message: "Ocurrió un error en el servidor, al procesar la respuesta",
            data: error.toString()
        });
    }
};