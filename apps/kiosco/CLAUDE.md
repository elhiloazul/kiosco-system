# Convenciones Técnicas — Kiosco API (NestJS + DDD)

Estas reglas aplican a todo el código de `apps/kiosco`. Son complementarias a las reglas del `CLAUDE.md` raíz.

---

## 1. Arquitectura por Subdominio

Cada subdominio (`tenant`, `campaign`, `activity`, `slide`, `kiosk`) sigue esta estructura obligatoria:

```
src/<subdominio>/
├── domain/
│   ├── <aggregate>.ts           # Clase agregada validada con Zod
│   └── <aggregate>.repository.ts  # Interfaz IXxxRepository + Symbol token
├── application/
│   ├── <use-case>.service.ts    # Un archivo por caso de uso
│   └── <subdominio>.dto.ts      # InputDto + OutputDto (Zod schemas + tipos inferidos)
└── infrastructure/
    ├── <aggregate>-prisma.repository.ts  # Implementación del repositorio
    └── <subdominio>.module.ts   # NestJS Module que conecta todo
```

---

## 2. Capa de Dominio

- El agregado es una **clase** con constructor privado, factory `create()` y `reconstitute()`.
- El schema Zod se define **dentro del mismo archivo** del agregado para validar `props`.
- Los getters exponen las propiedades. No exponer `props` directamente.
- **Prohibido** importar NestJS, Prisma o cualquier librería de infraestructura en esta capa.
- Los Value Objects solo se crean cuando el concepto tiene identidad propia o comportamiento más allá de validación (ej. `Email`, `Money`).

```typescript
// Patrón del agregado
const XxxSchema = z.object({ ... });
type XxxProps = z.infer<typeof XxxSchema>;

export class Xxx {
  private constructor(private readonly props: XxxProps) {}
  static create(input: { ... }): Xxx { ... }
  static reconstitute(input: XxxProps): Xxx { ... }
  get id() { return this.props.id; }
}
```

---

## 3. Repositorios

- La interfaz `IXxxRepository` y su token `XXX_REPOSITORY = Symbol('IXxxRepository')` viven en `domain/`.
- La implementación `XxxPrismaRepository` vive en `infrastructure/` e implementa la interfaz.
- El token se inyecta en los servicios con `@Inject(XXX_REPOSITORY)`.
- Toda consulta a Prisma **debe filtrar por `tenantId`** (multi-tenancy).
- El repositorio trabaja con agregados, no con objetos Prisma crudos. Usar `reconstitute()` al leer.

```typescript
// Patrón de repositorio Prisma
async findById(id: string): Promise<Xxx | null> {
  const row = await this.prisma.xxx.findUnique({ where: { id } });
  if (!row) return null;
  return Xxx.reconstitute(row);
}
```

---

## 4. Capa de Aplicación (Casos de Uso)

- Un archivo por caso de uso: `create-xxx.service.ts`, `update-xxx.service.ts`, etc.
- Los DTOs de entrada y salida se definen en `<subdominio>.dto.ts` usando Zod:
  - Naming: `CreateXxxInputDto`, `XxxOutputDto` (Zod schema + tipo inferido en el mismo archivo).
  - El controlador parsea el body con `XxxInputDto.parse(body)` antes de llamar al servicio.
- Los servicios reciben el InputDto ya validado; no re-validan internamente.
- El servicio orquestra: repositorio → agregado → persistencia → retorno del OutputDto.

```typescript
// Patrón DTO
export const CreateXxxInputDto = z.object({ ... });
export type CreateXxxInputDto = z.infer<typeof CreateXxxInputDto>;
```

---

## 5. Capa de Infraestructura — Módulo NestJS

- Cada subdominio tiene **un único módulo** que declara: controladores, providers (servicios + repositorio), y el `PrismaService`.
- El repositorio se registra como provider con el token Symbol:

```typescript
{
  provide: XXX_REPOSITORY,
  useClass: XxxPrismaRepository,
}
```

- `PrismaService` se importa desde `../../shared/infrastructure/prisma.service`.

---

## 6. Entrypoints (Controladores REST)

- Viven en `src/entrypoints/web/<subdominio>/`.
- El controlador **no contiene lógica de negocio**: parsea el body, llama al servicio, retorna el resultado.
- Prefijo global de versión: `/v1` (configurado en `main.ts`).
- Usar `@Body() body: unknown` y parsear con el InputDto Zod en el método del controlador.
- Rutas protegidas por defecto con JWT Guard global. Marcar rutas públicas con `@Public()`.

---

## 7. Nomenclatura General

| Concepto | Convención | Ejemplo |
|:---------|:-----------|:--------|
| Agregado | PascalCase | `Tenant`, `Campaign` |
| Interfaz de repositorio | Prefijo `I` | `ITenantRepository` |
| Token de inyección | UPPER_SNAKE_CASE + `Symbol` | `TENANT_REPOSITORY` |
| Repositorio Prisma | `XxxPrismaRepository` | `TenantPrismaRepository` |
| DTO de entrada | `CreateXxxInputDto`, `UpdateXxxInputDto` | `CreateTenantInputDto` |
| DTO de salida | `XxxOutputDto` | `TenantOutputDto` |
| Caso de uso | `<accion>-<entidad>.service.ts` | `create-tenant.service.ts` |
| Módulo | `<subdominio>.module.ts` | `tenant.module.ts` |
