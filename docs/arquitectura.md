# Proyecto Basado en Arquitectura Limpia

## 🌟 **¿Qué es la Arquitectura Limpia?**

La Arquitectura Limpia es un enfoque de diseño de software que separa la lógica de negocio (dominio) de la infraestructura (base de datos, frameworks, etc.). Esto permite que el sistema sea:

- **Independiente de frameworks:** Puedes cambiar de framework sin impactar la lógica de negocio.
- **Facilidad de pruebas:** La separación de responsabilidades facilita el testing.
- **Escalable y mantenible:** Un código modular reduce la complejidad a medida que el sistema crece.

## 🚀 **Por qué Usar Esta Arquitectura**

1. **Mantenimiento Simplificado:** La separación de responsabilidades facilita la localización y solución de problemas.
2. **Escalabilidad:** Nuevas funcionalidades pueden añadirse sin impactar otros módulos.
3. **Pruebas Efectivas:** Las capas desacopladas hacen que las pruebas unitarias e integrales sean más sencillas.
4. **Modularidad:** Los módulos específicos permiten reusar y extender el código fácilmente.
5. **Flexibilidad:** Puedes cambiar la base de datos, frameworks o tecnologías sin afectar la lógica del dominio.

---

## 🏗️ **Estructura del Proyecto**

```plaintext
project-root/
├── src/
│   ├── modules/                # Módulos organizados por dominios
│   │   ├── shared/             # Recursos comunes reutilizables
│   │   ├── menu/               # Ejemplo de módulo de negocio
│   │   │   ├── controllers/    # Manejo de solicitudes HTTP
│   │   │   ├── services/       # Lógica de negocio
│   │   │   ├── rules/          # Validaciones específicas
│   │   │   ├── routes/         # Definición de rutas
│   │   │   └── middlewares/    # Middleware específicos
│   └── core/                   # Infraestructura base
│       ├── database/           # Conexión y modelos de base de datos
│       ├── config/             # Configuraciones generales
│       ├── errors/             # Manejo centralizado de errores
│       └── utils/              # Funciones auxiliares
├── public/                     # Archivos estáticos
├── env.js                      # Configuración de entorno
├── index.js                    # Punto de entrada principal
├── package.json                # Dependencias y scripts
└── README.md                   # Documentación del proyecto
```

---

## 🧩 **Detalles de la Estructura**

### 1. `src/modules/`

Almacena módulos organizados por dominio. Cada módulo contiene:

- `controllers/`: Manejan las solicitudes y delegan tareas a servicios.
- `services/`: Encapsulan la lógica de negocio.
- `rules/`: Validaciones específicas del módulo.
- `routes/`: Define las rutas del módulo.
- `middlewares/`: Procesan aspectos específicos como permisos o validaciones.

Ejemplo de módulo: `menu`

```
menu/
├── controllers/
│   └── menu.controller.js    # Controlador de solicitudes del menú
├── services/
│   └── menu.service.js       # Lógica para gestionar menús
├── rules/
│   └── menu.rules.js         # Validaciones específicas del menú
├── routes/
│   └── menu.routes.js        # Define las rutas del módulo
└── middlewares/
    └── menu.middleware.js    # Middleware de permisos o lógica transversal
```

### 1.1 `src/modules/shared`

El módulo shared se utiliza para contener componentes reutilizables y transversales que no están directamente relacionados con un dominio específico, pero que son necesarios en múltiples módulos. Esto incluye middlewares, helpers, servicios genéricos, y cualquier recurso común entre diferentes partes de la aplicación.

Estructura del Módulo shared

```plaintext

src/modules/shared/
├── controllers/
├── middlewares/
│ ├── error.middleware.js
│ └── auth.middleware.js
├── rules/
│ └── validation.rules.js
├── services/
│ └── email.service.js
├── helpers/
│ └── format.helper.js
├── utils/
│ └── date.util.js

```

### 2. `src/core/`

Base de la infraestructura del sistema, proporciona componentes esenciales:

- Define abstracciones de infraestructura, como la conexión a la base de datos, sin acoplarse al dominio.
- Maneja errores y configuraciones de manera centralizada.

  Ejemplo: Conexión a la base de datos.

```javascript
// src/core/database/connection.js
const { Sequelize } = require("sequelize");
const { DATABASES } = require("../../env");

const sequelize = new Sequelize(DATABASES.MYSQL.default);

module.exports = sequelize;
```

- `database/:` Configura la conexión a la base de datos.
- `errors/:` Manejadores de errores centralizados.
- `utils/:` Funciones auxiliares (formateo de fechas, logs, etc.).

### 3. `src/modules/shared/`

Contiene recursos reutilizables como middlewares, helpers y servicios genéricos.

Ejemplo de middleware de autenticación:

javascript

```javascript
// src/modules/shared/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../../env");

exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No autorizado" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Token inválido" });
  }
};
```

### 4. `public/`

Archivos estáticos como index.html o documentación de la API (api-docs.html).

### 5. `env.js`

Archivo centralizado para manejar configuraciones sensibles:

```javascript
// env.js
const DATABASES = {
  MYSQL: {
    default: {
      HOST: "localhost",
      USER: "root",
      PASSWORD: "",
      DATABASE: "project_db",
    },
  },
};

const PORT = 5000;

module.exports = { DATABASES, PORT };
```

### 6. `index.js`

Punto de entrada principal que inicia el servidor y conecta las piezas.

### 7. `package.json`

Gestor de dependencias y scripts, simplifica el despliegue y el flujo de desarrollo.
