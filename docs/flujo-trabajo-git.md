# 🚀 Ship/Show/Ask

El proyecto adopta el enfoque Ship/Show/Ask para gestionar y comunicar el trabajo del equipo. Este método permite definir prioridades y responsabilidades claras, optimizando la colaboración, ademas del sistema de versionamiento semantico.:

## 🛳 Ship

### Cuando usarlo

- Decisiones independientes que no requieren aprobación previa.
- Se aplica a tareas rutinarias o cambios pequeños que no afectan significativamente a otros módulos.

#### Ejemplos

- Correcciones de errores menores o ajustes en el código que no afectan la API pública ni la lógica principal.
- Refactorizar una función interna en un módulo.
- Corregir un error menor en el código sin impacto externo.

### Vercionamiento Semantico

- Normalmente se aplica a incrementos de PATCH.

#### Ejemplos

- **Acción:** Incrementar el PATCH (1.0.0 → 1.0.1) y publicar el cambio sin necesidad de aprobación previa.
- **Commit:** [Ship] Fix: Error en el middleware de autenticación.

## 👁️ Show

### Cuando usarlo

- Cambios que deben ser comunicados al equipo después de completarse, ya que pueden tener un impacto indirecto o implicar una nueva funcionalidad.

#### Ejemplos

- Introducción de un nuevo helper o utilitario en el módulo shared.
- Actualización en las reglas de validación de un formulario.

### Vercionamiento Semantico

- Se aplica principalmente a incrementos de MINOR.

#### Ejemplos

- **Cambio:** Implementar un nuevo endpoint en la API sin afectar la lógica existente.
- **Acción:** Incrementar el MINOR (1.0.0 → 1.1.0) y compartir los detalles con el equipo en la documentación o notas de versión.
- **Commit:** [Show] Feature: Añadido el endpoint /menu/search.

## ❓ Ask

### Cuando usarlo

- Decisiones críticas que requieren discusión y aprobación previa del equipo.
- Generalmente implican cambios que impactan la arquitectura o afectan múltiples módulos.

#### Ejemplos

- Cambiar el framework principal de la aplicación.
- Rediseñar la base de datos o los esquemas de datos.

### Vercionamiento Semantico

- Se aplica a incrementos de MAJOR.

#### Ejemplos

- **Cambio:** Cambiar el ORM de Sequelize a Prisma o eliminar una funcionalidad obsoleta.
- **Acción:** Abrir una discusión en el equipo, documentar el impacto esperado, y tras aprobación, incrementar el MAJOR (1.0.0 → 2.0.0).
- **Commit:** [Ask] Breaking: Migración de Sequelize a Prisma.

### Ejemplo de mensajes de commit:

```plaintext
[Ship] Refactorizado el middleware de autenticación para mejorar el rendimiento.
[Show] Añadida nueva validación de email al módulo shared/rules.
[Ask] Propuesta para cambiar Sequelize por Prisma como ORM.
```

## Ramas y Pull Requests:

Crea ramas específicas según la categoría de cambio (`ship/`, `show/`, `ask/`), Abre PRs con etiquetas claras indicando el tipo de cambio.

#### Mensajes de Commit:

- Ship: [Ship] Fix: Mensaje claro sobre el bug resuelto.
- Show: [Show] Feature: Descripción de la nueva funcionalidad.
- Ask: [Ask] Breaking: Resumen del cambio crítico.

#### Versionado y Notas de Versión:

Incluye el tipo de cambio (Ship/Show/Ask) en las notas de versión.

- Ejemplo:

```plaintext
## [2.0.0] - 2024-11-19

### Breaking Changes (Ask)

- Migración del ORM de Sequelize a Prisma.

## [1.1.0] - 2024-11-15

### New Features (Show)

- Añadido endpoint `/menu/search` para búsquedas avanzadas.

## [1.0.1] - 2024-11-10

### Fixes (Ship)

Corregido error en middleware de autenticación.
```
