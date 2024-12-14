# Prueba de consepto Single Sign On 


## Descripción
Este proyecto es un servidor backend desarrollado en **Node.js** y **Express**, diseñado para ser modular, escalable y seguro. Incluye funcionalidades avanzadas como la generación y rotación de claves PASETO, manejo de errores centralizado, y pruebas unitarias con **Jest**. Además, aprovecha múltiples núcleos del CPU mediante el uso de `cluster` para maximizar el rendimiento. Se trato de seguir arquitectura limpia y kiss

---

## Características Principales
- **Rotación de claves PASETO**:
  - Generación automática de claves públicas y privadas con rotación cada 30 días.
  - Respaldo de claves antiguas y registro de eventos en logs.
- **Estructura modular**:
  - Las rutas se generan dinámicamente a partir de módulos específicos.
  - Los middlewares están centralizados para un mantenimiento más sencillo.
- **Escalabilidad**:
  - Uso del módulo `cluster` para soportar múltiples núcleos de CPU.
- **Seguridad**:
  - Implementación de PASETO para tokens.
  - Manejo de errores seguro y centralizado.
- **Pruebas unitarias**:
  - Pruebas con **Jest** para garantizar la calidad del código y evitar regresiones.
