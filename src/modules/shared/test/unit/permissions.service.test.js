import { permissionChecker } from '../../services/permissions.service';

describe('permissionChecker', () => {
  // Semilla de permisos definida para el usuario
  const permissions = [
    { id: 1, name: 'fullAccess', fullAccess: 1 },
    { id: 2, name: 'granularAccess', fullAccess: 0 }
  ];

  // Caso 1: El módulo tiene acceso completo
  it('debe retornar acceso completo si el módulo tiene fullAccess', async () => {
    // No se requiere llamar a getUserPermissions ya que se valida el fullAccess
    const getUserPermissions = jest.fn();
    const params = {
      permissions,
      module: 'fullAccess', // módulo solicitado
      method: 'get',
      url: 'roles',
      userId: 1,
    };

    const result = await permissionChecker(params, { getUserPermissions });
    expect(result).toEqual({
      error: false,
      message: 'Tiene permisos para acceder a este módulo',
      data: 'fullAccess'
    });
  });

  // Caso 2: Módulo no encontrado en permissions
  it('debe retornar error si el módulo no está en permissions', async () => {
    const getUserPermissions = jest.fn();
    const params = {
      permissions,
      module: 'inexistente', // módulo no presente en la semilla
      method: 'get',
      url: 'roles',
      userId: 1,
    };

    const result = await permissionChecker(params, { getUserPermissions });
    expect(result).toEqual({
      error: true,
      message: 'No tiene permisos para acceder a este módulo',
      data: 'inexistente'
    });
  });

  // Caso 3: Módulo granular pero sin permisos granulares (getUserPermissions no retorna data)
  it('debe retornar error si no hay permisos granulares para el módulo', async () => {
    const getUserPermissions = jest.fn().mockResolvedValue({
      error: false,
      hasData: false,
      data: []
    });
    const params = {
      permissions,
      module: 'granularAccess',
      method: 'get',
      url: 'roles',
      userId: 1,
    };

    const result = await permissionChecker(params, { getUserPermissions });
    expect(result).toEqual({
      error: true,
      message: 'No tiene permisos granulares para acceder a este módulo',
      data: 'granularAccess'
    });
  });

  // Caso 4: Permisos granulares encontrados pero la URL solicitada no existe en los permisos
  it('debe retornar error si la URL no está en los permisos granulares', async () => {
    const getUserPermissions = jest.fn().mockResolvedValue({
      error: false,
      hasData: true,
      data: [{
        name: 'granularAccess',
        url: 'otroUrl', // URL diferente a la solicitada ("roles")
        get: 1,
        post: 0,
        put: 0,
        delete: 0,
        patch: 0
      }]
    });
    const params = {
      permissions,
      module: 'granularAccess',
      method: 'get',
      url: 'roles', // se solicita "roles"
      userId: 1,
    };

    const result = await permissionChecker(params, { getUserPermissions });
    expect(result).toEqual({
      error: true,
      message: 'No tiene permisos para acceder a esta url',
      data: 'roles'
    });
  });

  // Caso 5: Permisos granulares encontrados y URL existe, pero el método no está permitido
  it('debe retornar error si el método no está permitido en la URL', async () => {
    const getUserPermissions = jest.fn().mockResolvedValue({
      error: false,
      hasData: true,
      data: [{
        name: 'granularAccess',
        url: 'roles',
        // No se incluye la propiedad "get" para simular que el método no está permitido
        post: 1,
        put: 0,
        delete: 0,
        patch: 0
      }]
    });
    const params = {
      permissions,
      module: 'granularAccess',
      method: 'get', // se solicita método "get"
      url: 'roles',
      userId: 1,
    };

    const result = await permissionChecker(params, { getUserPermissions });
    expect(result).toEqual({
      error: true,
      message: 'El método no está permitido para esta url',
      data: 'get'
    });
  });

  // Caso 6: Permiso granular concedido para la URL y método solicitados
  it('debe retornar éxito si tiene permisos granulares para la URL y método', async () => {
    const getUserPermissions = jest.fn().mockResolvedValue({
      error: false,
      hasData: true,
      data: [{
        name: 'granularAccess',
        url: 'roles', // coincide con la URL solicitada
        get: 1, // Método permitido
        post: 0,
        put: 0,
        delete: 0,
        patch: 0
      }]
    });
    const params = {
      permissions,
      module: 'granularAccess',
      method: 'get',
      url: 'roles',
      userId: 1,
    };

    const result = await permissionChecker(params, { getUserPermissions });
    expect(result).toEqual({
      error: false,
      message: 'Tiene permisos para acceder a esta url con este método',
      data: { module: 'granularAccess', url: 'roles', method: 'get' }
    });
  });

  // Caso 7: Error retornado por getUserPermissions
  it('debe retornar el error si getUserPermissions retorna error', async () => {
    const errorResponse = {
      error: true,
      message: 'Error en permisos',
      data: 'detalle del error'
    };
    const getUserPermissions = jest.fn().mockResolvedValue(errorResponse);
    const params = {
      permissions,
      module: 'granularAccess',
      method: 'get',
      url: 'roles',
      userId: 1,
    };

    const result = await permissionChecker(params, { getUserPermissions });
    expect(result).toEqual(errorResponse);
  });
});
