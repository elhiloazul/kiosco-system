# Convenciones Técnicas — Backoffice (Angular 19)

Estas reglas aplican a todo el código de `apps/backoffice`. Son complementarias a las reglas del `CLAUDE.md` raíz y al skill `/frontend-guideline` (UI/UX).

---

## 1. Nomenclatura

| Concepto | Convención | Ejemplo |
|:---------|:-----------|:--------|
| Interfaces de request HTTP | Sufijo `Request` | `LoginRequest`, `RefreshTokenRequest` |
| Interfaces de respuesta HTTP | Sufijo `Response` o nombre del recurso | `AuthTokensResponse`, `AdminProfile` |
| Servicios de datos | Sufijo `Service` | `AuthService`, `TenantService` |
| Guards | Sufijo `Guard` | `AuthGuard` |
| Interceptores | Sufijo `Interceptor` | `AuthInterceptor` |
| Modelos/interfaces de dominio | PascalCase sin sufijo | `AdminProfile`, `AuthTokens` |

---

## 2. Estado y Reactividad

- Usar **`signal()`** y **`computed()`** para estado local del componente. No usar `BehaviorSubject` para esto.
- Usar **`effect()`** solo cuando haya un side-effect real (ej. persistir en localStorage).
- Para estado global compartido entre componentes, usar un **servicio con signals** (`providedIn: 'root'`).

---

## 3. Componentes

- Todos los componentes son **standalone** (`standalone: true`). Sin NgModules.
- Usar el **nuevo Control Flow** de Angular: `@if`, `@else`, `@for`, `@switch`. Nunca `*ngIf`, `*ngFor`.
- Inputs tipados estrictamente. Nunca usar `any`.
- Los componentes de **página** (los que renderizan dentro del `<router-outlet>` del layout) deben declarar `host: { class: 'flex-1 flex flex-col overflow-hidden' }` para que hereden correctamente el espacio del layout. Sin esto, el host element es un bloque y los hijos con `flex-1` no se expanden.

---

## 4. HTTP y Servicios

- Todas las llamadas HTTP se hacen desde **servicios**, nunca desde componentes directamente.
- La URL base se toma siempre de `environment.apiUrl`. Nunca hardcodear URLs.
- Los interceptores se registran en `app.config.ts` con `withInterceptors([...])` (funcional, no basado en clases con `withInterceptorsFromDi`).

---

## 5. Estructura de Archivos

```
src/app/
├── core/
│   ├── auth/           # AuthService, AuthGuard, AuthInterceptor, auth.model.ts
│   └── ...             # Otros servicios globales
├── pages/
│   ├── auth/
│   │   └── login/
│   └── dashboard/
│       ├── layout/
│       └── [feature]/  # tenants/, kiosks/, campaigns/, etc.
└── shared/
    └── components/     # Componentes reutilizables (UI genérico)
```

---

## 6. Tipado

- Reutilizar interfaces de `@kiosco/shared-kernel` cuando estén disponibles.
- Definir modelos locales en `*.model.ts` dentro de la carpeta `core/` o de la feature correspondiente.
- Usar `z.infer<typeof Schema>` de Zod solo si se necesita validación en el cliente; preferir interfaces TypeScript para tipado de respuestas.
