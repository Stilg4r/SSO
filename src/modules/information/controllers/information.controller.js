import { informationApi } from '../services/information.service.js';
import { responseHandler } from '../../../core/services/responsesHandlers.service.js';

export const getInformationApi = async (req, res) => {
    // es una respuesta simple no se necesita manejar errores
    const result = await informationApi();
    return responseHandler(res, result);
};