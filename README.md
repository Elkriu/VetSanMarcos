# Clínica Veterinaria San Marcos

Sistema web de gestión clínica y tienda veterinaria desarrollado con una arquitectura de microservicios en Spring Boot y un frontend en React con TypeScript.

## Arquitectura del sistema

El proyecto utiliza **Netflix Eureka** para el registro y descubrimiento de servicios, y **Spring Cloud Gateway** como punto de entrada único para las peticiones provenientes del frontend. Cada microservicio con persistencia administra su propia base de datos en MySQL, mientras que el servicio de dashboard consolida información en tiempo real mediante llamadas HTTP con WebClient.

### Servicios y puertos

| Servicio | Puerto | Base de datos | Rutas principales | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| **Eureka Server** | `8761` | — | `/` | Servidor de registro y descubrimiento de instancias |
| **API Gateway** | `8080` | — | Todas | Enrutamiento centralizado, balanceo de carga y control CORS |
| **ms_usuarios** | `8081` | `sanmarcos_usuarios` | `/auth/**`, `/usuarios/**` | Autenticación JWT, registro y gestión de roles |
| **ms_contacto** | `8082` | `sanmarcos_contacto` | `/mensajes/**` | Recepción y lectura de mensajes de contacto |
| **ms_citas** | `8083` | `sanmarcos_citas` | `/citas/**` | Agendamiento, consulta y gestión de horas médicas |
| **ms_inventario** | `8084` | `sanmarcos_inventario` | `/productos/**` | Catálogo de productos, stock y alertas de inventario |
| **ms_ventas** | `8085` | `sanmarcos_ventas` | `/boletas/**` | Emisión de boletas y registro de ventas de tienda |
| **ms_pagos** | `8086` | `sanmarcos_pagos` | `/pagos/**` | Procesamiento y registro de transacciones de pago |
| **ms_dashboard** | `8087` | — | `/dashboard/**` | Agregador de métricas e indicadores para el panel administrativo |
| **Frontend Web** | `5173` | — | — | Interfaz de usuario para clientes, recepción y administración |

## Tecnologías utilizadas

* **Backend:** Java 21, Spring Boot 4.2, Spring Cloud (Gateway WebFlux, Netflix Eureka), Spring Security con JWT, Spring Data JPA, WebClient y Springdoc OpenAPI (Swagger).
* **Base de datos:** MySQL 8.
* **Frontend:** React, TypeScript, Vite y Bootstrap 5.

## Requisitos previos

* JDK 21 instalado y configurado en el `PATH`.
* Maven 3.9+ (o uso del wrapper `mvnw` incluido en cada proyecto).
* Servidor MySQL activo en el puerto `3306`.
* Node.js 20+ y npm.

## Configuración de bases de datos

Antes de iniciar los servicios por primera vez, crea las bases de datos correspondientes en MySQL:

```sql
CREATE DATABASE IF NOT EXISTS sanmarcos_usuarios;
CREATE DATABASE IF NOT EXISTS sanmarcos_contacto;
CREATE DATABASE IF NOT EXISTS sanmarcos_citas;
CREATE DATABASE IF NOT EXISTS sanmarcos_inventario;
CREATE DATABASE IF NOT EXISTS sanmarcos_ventas;
CREATE DATABASE IF NOT EXISTS sanmarcos_pagos;
