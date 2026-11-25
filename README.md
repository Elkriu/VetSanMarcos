# Clínica Veterinaria San Marcos

Sistema web de gestión clínica y tienda veterinaria desarrollado con una arquitectura de microservicios en Spring Boot y un frontend en React con TypeScript.

**Asignatura:** DSY1104 – Desarrollo Fullstack II · **Sección:** 010D

**Integrantes:**

* Cristopher Bustamante
* Jose Recabarren

## Funcionalidades principales

* **Sitio público:** inicio, servicios, nosotros, novedades, tienda con filtros y formulario de contacto.
* **Clientes:** registro, inicio de sesión con JWT, agendamiento de horas médicas, carrito, pago simulado, boleta electrónica (IVA 19 %) e historial en "Mi Cuenta".
* **Recepción:** registro manual de citas, reprogramación y cancelación, mensajes de contacto, directorio de usuarios e inventario.
* **Administración:** indicadores en tiempo real (dashboard), mantenedor de usuarios y roles (crear, editar, suspender, eliminar), supervisión de citas e inventario.

## Arquitectura del sistema

El proyecto utiliza **Netflix Eureka** para el registro y descubrimiento de servicios, y **Spring Cloud Gateway** como punto de entrada único para las peticiones provenientes del frontend. Cada microservicio con persistencia administra su propia base de datos en MySQL (versionada con **Flyway**), mientras que el servicio de dashboard consolida información en tiempo real mediante llamadas HTTP con WebClient.

### Servicios y puertos

| Servicio | Puerto | Base de datos | Rutas principales | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| **Eureka Server** | `8761` | — | `/` | Servidor de registro y descubrimiento de instancias |
| **API Gateway** | `8080` | — | Todas | Enrutamiento centralizado, balanceo de carga y control CORS |
| **ms_usuarios** | `8081` | `bd_usuarios` | `/auth/**`, `/usuarios/**` | Autenticación JWT, registro y gestión de roles |
| **ms_contacto** | `8082` | `bd_contacto` | `/mensajes/**` | Recepción y lectura de mensajes de contacto |
| **ms_citas** | `8083` | `bd_citas` | `/citas/**` | Agendamiento, consulta y gestión de horas médicas |
| **ms_inventario** | `8084` | `bd_inventario` | `/productos/**` | Catálogo de productos, stock y alertas de inventario |
| **ms_ventas** | `8085` | `bd_ventas` | `/boletas/**` | Emisión de boletas y registro de ventas de tienda |
| **ms_pagos** | `8086` | `bd_pagos` | `/pagos/**` | Procesamiento y registro de transacciones de pago |
| **ms_dashboard** | `8087` | — | `/dashboard/**` | Agregador de métricas e indicadores para el panel administrativo |
| **Frontend Web** | `5173` | — | — | Interfaz de usuario para clientes, recepción y administración |

### Roles y seguridad

* Roles: `ADMINISTRADOR`, `RECEPCIONISTA` y `CLIENTE` (más el visitante sin sesión).
* `ms_usuarios` emite un **JWT (HS384, vigencia 2 horas)** al iniciar sesión; las contraseñas se guardan cifradas con **BCrypt**.
* Cada microservicio valida el token con un `JwtFilter` y restringe los endpoints con `@PreAuthorize` (respuestas `401` sin token y `403` sin permisos).
* En el frontend, `RutaProtegida` limita el acceso a `/admin`, `/recepcion` y `/mis-citas` según el rol, y la sesión se renueva automáticamente al recargar (`POST /auth/renovar`).

## Tecnologías utilizadas

* **Backend:** Java 21, Spring Boot 4.2, Spring Cloud (Gateway WebFlux, Netflix Eureka), Spring Security con JWT, Spring Data JPA, Flyway, WebClient y Springdoc OpenAPI (Swagger).
* **Base de datos:** MySQL 8 (en desarrollo se usa Laragon).
* **Frontend:** React, TypeScript, Vite, React Router y Bootstrap 5. Pruebas unitarias con Vitest y Testing Library.

## Requisitos previos

* JDK 21 instalado y configurado en el `PATH` (o `JAVA_HOME`).
* Maven 3.9+ (o uso del wrapper `mvnw` incluido en cada proyecto).
* Servidor MySQL activo en el puerto `3306` con usuario `root` sin contraseña (configurable en cada `application.properties`).
* Node.js 20+ y npm.

## Configuración de bases de datos

No es necesario crear las bases de datos a mano: cada microservicio se conecta con `createDatabaseIfNotExist=true` y **Flyway** crea las tablas y carga los datos iniciales en el primer arranque. Las bases resultantes son:

```
bd_usuarios · bd_contacto · bd_citas · bd_inventario · bd_ventas · bd_pagos
```

Todos los servicios deben compartir el mismo valor de `jwt.secret` en su `application.properties`.

## Ejecución

1. Iniciar MySQL (por ejemplo, desde Laragon).
2. Compilar cada microservicio desde `Backend/<servicio>/<servicio>`:

   ```bash
   ./mvnw clean package -DskipTests
   ```

3. Iniciar los servicios en este orden (desde el IDE ejecutando la clase `*Application`, o con `java -jar target/<servicio>-0.0.1-SNAPSHOT.jar`):

   1. `eureka` (8761)
   2. `gateway` (8080, jar `api-gateway-0.0.1-SNAPSHOT.jar`)
   3. `usuarios`, `contacto`, `citas`, `inventario`, `ventas`, `pagos` y `dashboard`

4. Verificar en [http://localhost:8761](http://localhost:8761) que todos los servicios aparezcan con estado `UP`.
5. Iniciar el frontend desde la raíz del proyecto:

   ```bash
   npm install
   npm run dev
   ```

6. Abrir [http://localhost:5173](http://localhost:5173).

## Documentación de APIs (Swagger)

Cada microservicio publica su documentación OpenAPI:

| Servicio | Swagger UI |
| :--- | :--- |
| ms_usuarios | http://localhost:8081/swagger-ui/index.html |
| ms_contacto | http://localhost:8082/swagger-ui/index.html |
| ms_citas | http://localhost:8083/swagger-ui/index.html |
| ms_inventario | http://localhost:8084/swagger-ui/index.html |
| ms_ventas | http://localhost:8085/swagger-ui/index.html |
| ms_pagos | http://localhost:8086/swagger-ui/index.html |
| ms_dashboard | http://localhost:8087/swagger-ui/index.html |

Para probar endpoints protegidos, obtener un token con `POST /auth/login` y pegarlo en el botón **Authorize** (`Bearer <token>`).

## Usuarios iniciales

Flyway carga tres cuentas de ejemplo: un administrador (`admin@sanmarcos.cl`), una recepcionista (`recepcion@sanmarcos.cl`) y un cliente (`cristianv@gmail.com`). Se recomienda cambiar sus contraseñas y crear las cuentas reales desde el Mantenedor de Usuarios del panel de administración.
