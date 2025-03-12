import { match } from "path-to-regexp";

export const permissionChecker = async (
    { permissions, module, method, url, userId },
    { getUserPermissions }
) => {
    const PERMISSION_GRANTED = 1;

    // Buscar si tiene permisos para el módulo
    const foundModule = permissions.find(m => m.name === module);

    if (foundModule === undefined) {
        return {
            error: true,
            message: 'No tiene permisos para acceder a este módulo',
            data: module
        }
    }

    const { id: idModule, fullAccess } = foundModule;

    if (fullAccess) {
        return {
            error: false,
            message: 'Tiene permisos para acceder a este módulo',
            data: module
        }
    }

    const foundPermission = await getUserPermissions({ userId, idModule });
    if (foundPermission.error) { return foundPermission; }

    if (!foundPermission.hasData) {
        return {
            error: true,
            message: 'No tiene permisos granulares para acceder a este módulo',
            data: module
        }
    }

    const { data: urlPermissions } = foundPermission;

    // Buscar si tiene permisos para la url con el método incluso si es una url dinámica
    const foundUrl = urlPermissions.find(({ url: urlPermission }) => {
        const matchUrl = match(urlPermission);
        return matchUrl(url);
    });

    if (foundUrl === undefined) {
        return {
            error: true,
            message: 'No tiene permisos para acceder a esta url',
            data: url
        }
    }

    // Verificar si tiene permisos para el método, esto es una propiedad 
    if (!foundUrl.hasOwnProperty(method)) {
        return {
            error: true,
            message: 'El método no está permitido para esta url',
            data: method
        }
    }
    const methodPermission = foundUrl[method];

    // Si el método es 1, tiene permisos para acceder a la url con el método 
    if (methodPermission === PERMISSION_GRANTED) {
        return {
            error: false,
            message: 'Tiene permisos para acceder a esta url con este método',
            data: { module, url, method }
        }
    }

    // Si llega hasta aquí, no tiene permisos
    return {
        error: true,
        message: 'No tiene permisos para acceder a esta url con este método',
        data: { module, url, method }
    }

};