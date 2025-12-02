# Reporte Técnico: Implementación del Sistema de Recorridos Virtuales Chichén Itzá

## 1. Propuesta de Arquitectura

Para la implementación del sistema de recorridos virtuales de Chichén Itzá, se ha diseñado una **Arquitectura de 3 Tercios (3-Tier Architecture)**. Esta estructura permite desacoplar la interfaz de usuario, la lógica de negocio y el almacenamiento de datos, facilitando la escalabilidad y el mantenimiento.

### a. Responsabilidades de cada Tercio

1.  **Tercio de Presentación (Frontend)**
    *   **Tecnologías**: HTML5, Tailwind CSS, JavaScript (Vanilla).
    *   **Responsabilidades**:
        *   Renderizado de la interfaz gráfica (formularios, visualización de zonas, avatares).
        *   Captura de eventos del usuario (clics, navegación).
        *   Comunicación asíncrona con el servidor mediante API REST (Fetch API).
        *   Gestión del estado local de la sesión del usuario.

2.  **Tercio de Lógica de Negocio (Backend / Application Server)**
    *   **Tecnologías**: Node.js, Express.js.
    *   **Responsabilidades**:
        *   **Gestión de Usuarios**: Registro, autenticación y asignación de roles.
        *   **Gestión de Avatares**: Control de estado, posición y validación de movimientos.
        *   **Gestión de Zonas Geográficas**: Validación de permisos de acceso (público/privado) según el rol.
        *   **Coordinación**: Orquestación de las operaciones distribuidas y sincronización.
        *   Implementación del Modelo de Objetos (Clases `RecorridoVirtual`, `Participante`, etc.).

3.  **Tercio de Datos (Database)**
    *   **Tecnologías**: MySQL.
    *   **Responsabilidades**:
        *   Persistencia de datos (Usuarios, Roles, Zonas, Recorridos).
        *   Integridad referencial y restricciones de datos.

### b. Operaciones Distribuidas

El sistema maneja operaciones distribuidas principalmente a través de una API RESTful.

*   **Conexiones**: El servidor gestiona múltiples conexiones concurrentes. Cuando un usuario se conecta (`POST /api/participants`), se crea una sesión y se asigna un servidor lógico (simulado en la clase `Servidor`).
*   **Estados de Usuario**: El estado del usuario (conectado/desconectado, ubicación actual) se mantiene en memoria en el servidor para acceso rápido y se persiste en la base de datos para durabilidad.
*   **Cambios en los Recorridos**: Cuando un guía inicia un recorrido o un usuario se mueve (`POST /api/move`), el servidor valida la acción, actualiza el estado en la base de datos y confirma al cliente. En una implementación más avanzada, esto podría usar WebSockets para notificar a otros usuarios en tiempo real.

## 2. Implementación del Modelo de Objetos en JavaScript

Se transformó el diseño UML en clases de JavaScript modernas (ES6+), ubicadas en `backend/src/models/models.js`.

### a. Visibilidades y Encapsulamiento
Se utilizaron **campos privados** (sintaxis `#campo`) para asegurar que los atributos internos no sean modificados directamente desde fuera de la clase, exponiendo solo lo necesario a través de getters y métodos públicos.

*   *Ejemplo*: `ZonaGeografica` tiene `#esPrivada`. El acceso se controla mediante el método `permitirAcceso(rol)`.

### b. Asociaciones
Las asociaciones se implementaron como referencias a objetos o arrays de objetos dentro de las clases.

*   *Ejemplo*: `RecorridoVirtual` contiene un array `#participantes` y una referencia a `#guia`.
*   *Ejemplo*: `Participante` tiene una asociación con `Avatar`.

### c. Restricciones de Integridad
*   **Tipos de Datos**: Se validan mediante lógica en los setters o constructores (e.g., verificar `instanceof ZonaGeografica`).
*   **Base de Datos**: Las restricciones de llaves primarias, foráneas y `NOT NULL` se definieron en el script SQL `init.sql`.

## 3. Tareas Realizadas

1.  **Configuración del Entorno**:
    *   Inicialización de proyecto Node.js.
    *   Configuración de Docker y Docker Compose para orquestar la aplicación y la base de datos MySQL.

2.  **Desarrollo del Backend**:
    *   Implementación de servidor Express.
    *   Creación de endpoints API para exponer la funcionalidad del sistema.
    *   Codificación de las clases del modelo de dominio.

3.  **Desarrollo de Base de Datos**:
    *   Diseño del esquema Relacional normalizado.
    *   Script de inicialización con datos semilla (Seed Data) para Zonas y Roles.

4.  **Integración Frontend**:
    *   Adaptación del HTML proporcionado.
    *   Desarrollo de `app.js` para consumir la API y dar vida a la interfaz.

## 4. Extensiones (Puntos Extra)

### a. Consultas AJAX
Se implementaron consultas asíncronas utilizando la **Fetch API** (estándar moderno que reemplaza a `XMLHttpRequest` de jQuery) para:
*   Cargar dinámicamente las zonas geográficas al iniciar la aplicación.
*   Enviar datos de registro de recorridos y participantes sin recargar la página.

### b. Conexión a SGBD
Se implementó una conexión robusta a **MySQL** utilizando el driver `mysql2` con soporte de Promesas (`async/await`). El sistema es capaz de leer y escribir datos persistentes, cumpliendo con el requisito de administrar usuarios y zonas.
