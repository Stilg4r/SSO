export const permissionChecker = (
    { permissions, module, method, url, userId },
    { getUserPermissions }
) => {

    // Buscar si tiene permisos para el módulo
    const foundModule = permissions.find(m => m.name === module);

    if (!foundModule) {
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

    const foundPermission = getUserPermissions({ userId, idModule });
    if (foundPermission.error) { return foundPermission; }

    if (!foundPermission.hasData) {
        return {
            error: true,
            message: 'No tiene permisos granulares para acceder a este módulo',
            data: module
        }
    }

    const { data: urlPermissions } = foundPermission;

    // Buscar si tiene permisos para la url con el método
    const foundUrl = urlPermissions.find(({ url: urlPermission }) => urlPermission === url);
    if (!foundUrl) {
        return {
            error: true,
            message: 'No tiene permisos para acceder a esta url',
            data: url
        }
    }

    // Comprobar si tiene permisos para el método
    const methodPermission = foundUrl[method];
    if (!methodPermission) {
        return {
            error: true,
            message: 'No tiene permisos para acceder a esta url con este método',
            data: method
        }
    }

    // Si llega hasta aquí, tiene permisos
    return {
        error: false,
        message: 'Tiene permisos para acceder a esta url con este método',
        data: { module, url, method }
    }

};