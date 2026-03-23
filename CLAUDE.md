# Contexto del Proyecto: Kiosco System 

Sistema multi-tenant para la gestión y despliegue de experiencias interactivas en kioscos físicos (PCs con pantallas táctiles).

## 🏗️ Estructura del Workspace (Turborepo)
El proyecto es un Monorepo gestionado con **Turborepo**.

- **`apps/kiosco` (Core/Backend):** API NestJS. Único punto de verdad y acceso a datos.
- **`apps/backoffice` (Admin):** Panel administrativo en Next.js 15 (App Router), orientado al superadmin.
- **`apps/punto-movil-informativo-gramalote`:** Cliente visualizador en Angular. (Esta app ya existe por lo que no es necesario generar código)
- **`packages/database`:** Configuración de Prisma ORM para Vercel Postgres.
- **`packages/domain-shared`:** Contratos, interfaces y DTOs comunes de TypeScript.

---

## 🛠️ Reglas de Arquitectura en `apps/kiosco` (Core)
Se implementa **Domain-Driven Design (DDD)** y **Arquitectura Hexagonal**. Cada subdominio (`tenant`, `campaign`, `activity`) debe tener la siguiente estructura:

1. **Domain Layer:** - Entidades, Agregados, Value Objects e interfaces de Repositorios relacionados a cada subdominio.
   - **Regla:** Prohibido importar dependencias de NestJS, Prisma o librerías externas de infraestructura.
2. **Application Layer:** - Casos de uso (Services). Orquestan la lógica del dominio, definen la barrera transaccional de cada caso de uso.
3. **Infrastructure Layer:** - Implementación de Repositorios con Prisma, adaptadores y módulos de NestJS.
4. **Entrypoints Layer:** - `web/`: Controladores REST.
   - `cli/`: Comandos de consola y scripts de mantenimiento.

---

## 📜 Reglas de Oro del Desarrollo
1. **Single Source of Truth:** El `schema.prisma` reside únicamente en `packages/database`.
2. **Data Isolation:** Todas las consultas deben filtrarse por `tenantId` para garantizar multi-tenancy.
3. **JSONB Content:** El contenido dinámico de los slides se almacena en un campo `Json` de Prisma. La validación lógica ocurre en la capa de **Domain** del Core.
4. **No Direct Access:** El `backoffice` y el cada kiosco (ejemplo: punto-movil-informativo-gramalote) nunca acceden a la DB; siempre consumen la API de `apps/kiosco`.
5. **Type Safety:** Reutilizar interfaces de `packages/domain-shared` en todas las apps para evitar inconsistencias.
6. Usa Zod para asegurar que los DTOs cumplan con los contratos.


---
## Estructura del proyecto

kiosco-system/
├── apps/
│   ├── kiosco/                        # Backend (El Cerebro)
│   │   ├── src/
│   │   │   ├── security/           # Configuraciones globales (Auth, Filters)
│   │   │   │   
│   │   │   ├── entrypoints/
│   │   │   │    ├── web/       # Endpoints REST (WebController)
│   │   │   │    └── cli/       # Entrypoints CLI (Seed, Migrations)
│   │   │   │
│   │   │   └── tenant/
│   │   │   │    ├── domain/         # Agregados, entidades y objectos de valor (Tenant, etc.)
│   │   │   │    ├── application/    # Casos de uso (CreateTenant, UpdateTenant, etc.)
│   │   │   |    └── infrastructure/ # Repositorios Prisma
│   │   │   | 
│   │   │   └── campaing          # Subdominio campaña
│   │   │   │    ├── domain/        # Agregados, entidades y objectos de valor (Campaign etc.)
│   │   │   │    ├── application/    # Casos de uso (CreateCampaign, UpdateCampaign, etc.)
│   │   │   │    └── infrastructure/ # Repositorios Prisma
│   │   │   │   
│   │   │   └── activity        # Subdominio de Actividades
│   │   │       ├── domain          # Agregados, entidades y objectos de valor (Activity, Slide )
│   │   │       ├── application/    # Casos de uso (CreateActivity, UpdateActivity, etc.)
│   │   │       └── infrastructure/ # Repositorios Prisma
│   │   └── nest-cli.json
│   │
│   ├── backoffice/          # Panel Admin (Next.js 15+)
│   │   ├── src/
│   │   │   ├── app/         # App Router (Dashboard, Kiosks, Slides)
│   │   │   ├── components/  # UI Elements (Tailwind + Shadcn)
│   │   │   └── services/    # Llamadas a la API NestJS (Fetch/Query)
│   │   └── next.config.js
│   │
│   └── punto-movil-informativo-gramalote/  # Kiosco punto movil informativo gramalote del tenant Gramalote (Migrado aquí)
│       ├── src/
│       │   ├── app/
│       │   └── assets/
│       └── angular.json
│
├── packages/                       # Código compartido
│   ├── database/                   # Persistencia centralizada
│   │   ├── prisma/
│   │   │   └── schema.prisma       # Definición de Campaign, Activity, Slide, Tenant etc.
│   │   └── index.ts                # Export del PrismaClient
│   │
│   ├── shared-kernel/              # Contratos de TypeScript
│   │       └── domain
│   │              ├── enums/        # SlideType (Video, Image, Text)
│   │              └── interfaces/   # Validaciones compartidas
│   │
│   └── config-eslint/              # Reglas de linter para todo el equipo
│
├── turbo.json                      # Configuración de Orquestación de Turbo
└──  package.json                    # Workspaces y Scripts globales
---
## 📋 Especificación de cada subdominio.
- **`domain`:** Contiene el modelo de dominio: una clase de agregado validada internamente con Zod. Los Value Objects solo se crean cuando el concepto tiene identidad propia o comportamiento más allá de validación (ej. `Email`, `Money`). 
- **`application`:** Contiene los servicios (casos de uso), ademas cada caso de uso puede tener un InputDTO para los parámetos de entrada del caso de uso, y un OutputDTO para los parámetros de salida del caso de uso. Los DTO pueden estar
en un archivo dentro la capa application, si es necesario se puede incluir un mapper para los casos mas complejos.
Usar zod para validar los DTOs.
-**`infrastructure`:** Puede contener la lógica de persistencia del modelo(Agregado)

---

## 📋 Especificación de API v1 (Vista Súper Admin)

| Módulo | Método | Endpoint | Parámetro Path | Descripción |
| :--- | :---: | :--- | :--- | :--- |
| **Tenant** | `POST` | `/v1/tenants` | - | Registra una nueva marca/empresa raíz. |
| | `GET` | `/v1/tenants` | - | Lista todos los tenants registrados en el sistema. |
| **Campañas** | `POST` | `/v1/tenants/:tenantId/campaigns` | `tenantId` | Crea una campaña vinculada a un tenant específico. |
| | `GET` | `/v1/tenants/:tenantId/campaigns` | `tenantId` | Lista todas las campañas que pertenecen a un tenant. |
| | `PATCH` | `/v1/campaigns/:id` | `id` | Modifica metadatos o estado de una campaña existente. |
| **Actividades**| `POST` | `/v1/campaigns/:campaignId/activities` | `campaignId` | Añade una interacción (Trivia, Registro) a una campaña. |
| | `GET` | `/v1/campaigns/:campaignId/activities` | `campaignId` | Lista la secuencia de actividades de la campaña. |
| | `PATCH` | `/v1/activities/:id` | `id` | Actualiza la configuración o lógica de una actividad. |
| **Slides** | `POST` | `/v1/activities/:activityId/slides` | `activityId` | Crea contenido (JSONB) dentro de una actividad. |
| | `GET` | `/v1/activities/:activityId/slides` | `activityId` | Lista los slides que componen una actividad. |
| | `GET` | `/v1/slides/:id` | `id` | Obtiene el detalle técnico y JSON de un slide. |
| | `PATCH` | `/v1/slides/:id` | `id` | Actualiza el contenido dinámico del slide. |
| **Kioscos** | `POST` | `/v1/tenants/:tenantId/kiosks` | `tenantId` | Registra un dispositivo físico para un tenant. |
| | `GET` | `/v1/tenants/:tenantId/kiosks` | `tenantId` | Lista los puntos físicos instalados para ese tenant. |
| | `PATCH` | `/v1/kiosks/:id` | `id` | Asocia una campaña activa a un kiosco específico. |

---

## 🔐 Especificación de API: Autenticación (Súper Admin)

| Módulo | Método | Endpoint | Cuerpo (Body) | Descripción |
| :--- | :---: | :--- | :--- | :--- |
| **Auth** | `POST` | `/v1/auth/login` | `{ "email": "...", "password": "..." }` | Valida credenciales y entrega `accessToken` y `refreshToken`. |
| | `POST` | `/v1/auth/refresh` | `{ "refreshToken": "..." }` | Renueva el `accessToken` usando un token de refresco válido. |
| | `POST` | `/v1/auth/logout` | `{ "refreshToken": "..." }` | Invalida la sesión actual y elimina el token de la base de datos. |
| | `GET` | `/v1/auth/me` | - | Retorna la información del perfil del administrador autenticado. |
| **Profile** | `PATCH` | `/v1/auth/profile` | `{ "name": "...", "password": "..." }` | Actualiza los datos personales o la contraseña del Súper Admin. |

