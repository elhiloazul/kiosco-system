# Guía de Migraciones con Prisma

## Requisitos previos

- Node 20 activo: `nvm use 20`
- Estar ubicado en `packages/database/`
- Tener el archivo `.env` con `DATABASE_URL` y `DIRECT_URL`

---

## Flujo normal — Cómo agregar o modificar campos

Este es el flujo que usarás el 99% del tiempo.

**1. Modifica `schema.prisma`** con los cambios que necesitas (nuevos campos, nuevas tablas, etc.)

**2. Crea y aplica la migración:**

```bash
npx prisma migrate dev --name nombre-descriptivo-del-cambio
```

Esto hace tres cosas automáticamente:
- Genera el archivo SQL en `prisma/migrations/`
- Aplica el SQL a la base de datos
- Regenera el Prisma Client

**Ejemplos de nombres:**
```bash
npx prisma migrate dev --name add-menu-fields-to-activity
npx prisma migrate dev --name create-user-table
npx prisma migrate dev --name add-index-to-campaigns
```

---

## Problema: "Drift detected" — La DB no tiene historial de migraciones

Ocurre cuando la base de datos fue creada con `prisma db push` (sin migraciones) y se intenta usar `migrate dev` por primera vez.

**Solución: crear una baseline sin tocar los datos existentes.**

```bash
# 1. Crear el directorio de la migración baseline
mkdir -p prisma/migrations/0_init

# 2. Generar el SQL desde el estado ACTUAL de la DB (no del schema)
npx prisma migrate diff \
  --from-empty \
  --to-schema-datasource prisma/schema.prisma \
  --script > prisma/migrations/0_init/migration.sql

# 3. Marcarla como ya aplicada (Prisma no la ejecuta, solo la registra)
npx prisma migrate resolve --applied 0_init

# 4. Ahora sí correr la migración con los cambios nuevos
npx prisma migrate dev --name nombre-del-cambio
```

> El paso clave es `--to-schema-datasource` (lee la DB real) en lugar de
> `--to-schema-datamodel` (lee el archivo schema.prisma). Así la baseline
> representa lo que ya existe en la DB, no lo que está en el schema.

---

## Problema: "Migration was modified after it was applied"

Ocurre cuando el SQL de una migración ya registrada en la DB fue modificado. Prisma detecta que el checksum no coincide.

**Solución:**

```bash
# 1. Eliminar el registro de esa migración de la DB
psql $DATABASE_URL -c "DELETE FROM \"_prisma_migrations\" WHERE migration_name = '0_init';"

# 2. Re-registrarla con el SQL correcto
npx prisma migrate resolve --applied 0_init
```

---

## Comandos de referencia

| Comando | Qué hace |
|:--------|:---------|
| `npx prisma migrate dev --name <nombre>` | Crea y aplica una migración nueva |
| `npx prisma migrate deploy` | Aplica migraciones pendientes (producción) |
| `npx prisma migrate reset` | Elimina y recrea toda la DB — **borra datos** |
| `npx prisma migrate status` | Muestra el estado de las migraciones |
| `npx prisma migrate resolve --applied <nombre>` | Marca una migración como ya aplicada sin ejecutarla |
| `npx prisma generate` | Regenera el Prisma Client sin tocar la DB |
| `npx prisma db push` | Aplica el schema sin crear migraciones — solo para prototipado |
| `npx prisma studio` | Abre una UI visual para explorar la DB |

---

## Diferencia entre `db push` y `migrate dev`

| | `db push` | `migrate dev` |
|:--|:----------|:--------------|
| Crea archivos de migración | No | Sí |
| Apto para producción | No | Sí |
| Historial de cambios | No | Sí |
| Uso recomendado | Prototipado rápido | Desarrollo y producción |

**Regla:** una vez que usas `migrate dev`, no uses `db push`. Mezclarlos genera el problema de "drift detected".
