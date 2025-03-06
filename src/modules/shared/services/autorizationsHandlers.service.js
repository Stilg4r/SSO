import { verifyToken as defaultVerifyToken } from './token.service.js';

export const bearerAuthorization = async (token, verifyToken = defaultVerifyToken) => {
    if (!token) {
        return {
            error: true,
            message: 'Token requerido',
            data: {}
        }
    }
    return await verifyToken({ token });
};

// Mapa de tipos de autorización y sus handlers
export const authorizations = new Map([
    ['Bearer', bearerAuthorization],
]);

// Función para obtener el handler de autorización
export const authorizationHandler = (type, authorizationsMap = authorizations) => {
    if (!authorizationsMap.has(type)) {
        return {
            error: true,
            message: 'Tipo de autorización no soportado',
            data: {}
        }
    }
    return {
        error: false,
        message: 'Función de autorización encontrada',
        data: authorizationsMap.get(type)
    }
};