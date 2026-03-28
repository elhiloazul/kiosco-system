# Kiosco API

API REST del núcleo del sistema multi-tenant para kioscos interactivos, construida con **NestJS** y **Prisma ORM** sobre PostgreSQL.

---

## Requisitos previos

- Node.js >= 20
- npm >= 10
- PostgreSQL (local o remoto — se recomienda 

---

## Instalación

### 1. Clonar el repositorio e instalar dependencias

Desde la raíz del monorepo:

```bash
git clone <repo-url>
cd kiosco-system
npm install
```

### 2. Configurar variables de entorno

- Crea el archivo `.env` dentro de `apps/kiosco/`:

```env
# URL de conexión pooled (usada por Prisma en runtime)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"

# URL directa (usada por Prisma Migrate)
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"

# Puerto en el que correrá la API (opcional, default: 3000)
PORT=3000
```

> **Nota:** Si usas Vercel Postgres o PgBouncer, `DATABASE_URL` debe apuntar al endpoint con connection pooling y `DIRECT_URL` al endpoint directo.

### 3. Generar el cliente de Prisma

```bash
npm run db:generate
```

### 4. Aplicar migraciones a la base de datos

```bash
npm run db:migrate
```

> Esto ejecuta `prisma migrate dev` desde `packages/database` y aplica todas las migraciones pendientes.

---

## Ejecutar en local

> **Nota:** Asegúrate de usar Node >= 20. Si usas `nvm`: `nvm use 20`

Desde la raíz del monorepo, ejecuta en un solo comando:

```bash
npm run dev:kiosco
```

La API quedará disponible en: `http://localhost:3000`

Para levantar todo el monorepo en paralelo (API + Backoffice):

```bash
npm run dev
```

---

## Scripts disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia la API en modo watch (hot-reload) |
| `npm run build` | Compila el proyecto a `dist/` |
| `npm run start` | Ejecuta el build compilado (`node dist/main`) |
| `npm run test` | Corre los tests |
| `npm run lint` | Analiza el código con ESLint |
| `npm run db:generate` | Genera el cliente de Prisma |
| `npm run db:migrate` | Aplica migraciones (`prisma migrate dev`) |
| `npm run db:push` | Sincroniza el schema sin generar migraciones (`prisma db push`) |

> Todos los comandos `db:*` deben ejecutarse desde la **raíz del monorepo** para que Turborepo los orqueste correctamente.

---

## Convención de commits

Se sigue el estándar [Conventional Commits](https://www.conventionalcommits.org/).

### Formato

```
<tipo>(<scope>): <descripción corta>
```

- El **tipo** y el **scope** van en minúsculas.
- La **descripción** va en minúsculas, sin punto final, en imperativo (ej. "add", "fix", "remove").
- El scope es opcional pero recomendado; usa el nombre del subdominio o módulo afectado.

### Tipos permitidos

| Tipo | Cuándo usarlo |
| :--- | :--- |
| `feat` | Nueva funcionalidad visible para el usuario o el sistema |
| `fix` | Corrección de un bug |
| `chore` | Tareas de mantenimiento que no afectan la lógica (deps, configs, scripts) |
| `refactor` | Cambio de código que no agrega funcionalidad ni corrige un bug |
| `test` | Agregar o corregir tests |
| `docs` | Cambios únicamente en documentación |
| `style` | Formato, espacios, punto y coma — sin cambio de lógica |
| `perf` | Mejora de rendimiento |
| `ci` | Cambios en pipelines de CI/CD |
| `build` | Cambios que afectan el sistema de build o dependencias externas |

### Ejemplos

```bash
feat(tenant): add create tenant use case
fix(campaign): correct tenant isolation filter in list query
chore: upgrade nestjs to v10.4.15
refactor(slide): extract content validator to domain layer
test(activity): add unit tests for create activity service
docs: update local setup instructions in readme
```
