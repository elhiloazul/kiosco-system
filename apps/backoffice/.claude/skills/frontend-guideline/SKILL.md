---
name: frontend-guideline
description: Aplica el Design System y directrices UI/UX del backoffice KioscoSys al construir componentes Angular/Tailwind. Úsalo al crear o modificar vistas del backoffice.
---

Actúa como un Expert UI/UX Engineer especializado en aplicaciones SaaS modernas (tipo Stripe, Vercel, Linear). Aplica estrictamente el siguiente Design System y estructura visual para las vistas del backoffice de Angular/Tailwind.

Adapta estos lineamientos visuales al esquema de datos real, pero no alteres la estética, paleta de colores, ni la jerarquía espacial aquí definida.

---

## 1. Identidad Visual y Estética Global

- **Estilo:** SaaS moderno, clean, profesional, minimalista. Alta densidad de información con uso inteligente del espacio en blanco.
- **Tipografía:** Sans-serif limpia (Inter/Roboto vía Tailwind). Texto general en `text-sm`.

### Paleta de Colores

| Rol | Clase Tailwind | Uso |
|:----|:--------------|:----|
| Fondo de la App | `bg-[#F8FAFC]` (slate-50) | Fondo general |
| Sidebar | `bg-[#0F172A]` (slate-900) | Navegación izquierda |
| Acento Principal | `blue-600` / hover `blue-700` | Botones primarios, estados activos, focus rings |
| Acento Éxito | `emerald-500` | Campaña activa, guardado/sincronizado |
| Bordes claros | `border-slate-200` / `border-slate-100` | Áreas claras |
| Bordes sidebar | `border-slate-800` | Sidebar oscuro |
| Sombras | `shadow-sm`, `shadow-md` | Capas y profundidad |

---

## 2. Layout — Estructura de la Pantalla

La pantalla ocupa todo el viewport: `h-screen w-full overflow-hidden`. Se divide en **tres zonas**:

---

### A. Sidebar — Navegación Global (Izquierda)

- **Ancho fijo:** `w-64`
- **Fondo:** `bg-[#0F172A]`
- **Contenido superior:** Logo / nombre del producto.
- **Zona de contexto:** Dos selectores dropdown para Tenant y Campaña actual.
  - Etiquetas: `text-xs text-slate-500 uppercase tracking-wider`
- **Navegación:** Ítems con iconos SVG.
  - Activo: `bg-blue-600 text-white shadow`
  - Inactivo: `hover:bg-slate-800`

---

### B. Área Principal (Centro-Derecha)

Contenedor: `flex-1 flex flex-col`

#### B.1 Header Superior — Barra de Estado

- `h-16 bg-white border-b border-slate-200 shadow-sm`
- **Izquierda:** Breadcrumbs `Tenant > Campaña > Actividad` con iconos chevron como separadores.
- **Derecha:**
  - Indicador "Cambios guardados" con punto verde `animate-ping`
  - Botón "Previsualizar" (secundario: borde gris, fondo blanco)
  - Botón "Publicar Cambios" (primario: `bg-blue-600 text-white`)

#### B.2 Cuerpo de Edición

Dividido en dos columnas: `flex-1 flex overflow-hidden`

---

### B.2.1 Panel de Secuencia — Timeline (Izquierda del área principal)

- `w-72 bg-white border-r border-slate-200`
- Lista los slides de la actividad actual.

**Tarjetas de Slide:**
- Bloque horizontal con `p-3 rounded-xl border`
- Activo: `border-blue-600 bg-blue-50/50`
- Inactivo: `border-slate-200 hover:border-blue-300`
- Internos: icono drag handle, icono del tipo de slide con fondo redondeado, título truncado, etiqueta del tipo en mayúsculas.

**Footer del Panel:**
- Botón "Añadir Slide": ancho completo, estilo dashed.
- `border-dashed border-slate-300 text-slate-500`

---

### B.2.2 Lienzo de Edición — Canvas Central (Derecha)

- Fondo: `bg-[#F8FAFC] overflow-y-auto`
- Formulario centrado: `max-w-4xl mx-auto bg-white rounded-sm border border-slate-200`

**Cabecera del Formulario:**
- Título: `text-2xl font-bold` con número de orden y nombre del slide.
- Badge con el tipo de slide.

**Campos de Formulario:**
- Labels: `text-sm font-semibold text-slate-700`
- Inputs: `px-4 py-2.5 bg-slate-50` con bordes sutiles.
- Focus: `focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`

**Componentes por tipo de slide:**

| Tipo | Componente de medios | Notas |
|:-----|:--------------------|:------|
| `VIDEO` | `SmartMediaInput` con icono `Lucide.Video` | Preview: `<video>` con `aspect-video` |
| `IMAGE` | `SmartMediaInput` con icono `Lucide.Image` | Preview: `<img>` con `aspect-video object-cover` |
| `DOCUMENT` | `SmartMediaInput` con icono `Lucide.File` | Preview: enlace con nombre del archivo |
| `TEXT` | Contenedor WYSIWYG: barra `bg-slate-50` con botones B/I/U, textarea limpio debajo | Sin medios |
| `CUSTOM` | Campo `component` con input estándar y descripción del componente a renderizar | Sin medios |

---

## 3. Smart Media Input — Componente Reutilizable

Sustituye los dropzones tradicionales. El valor final siempre es un `string` (URL).

### Estructura visual

```
┌─────────────────────────────────────────────────────┐
│ [icono tipo] [input URL placeholder]  [Validar] [📁] │  ← bg-slate-50, rounded-xl
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│            [ Preview del recurso ]                  │  ← Solo si URL válida
└─────────────────────────────────────────────────────┘
```

### Especificación del input

- Contenedor: `bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 px-3`
- Icono izquierdo: cambia según el tipo del slide (`Lucide.Video`, `Lucide.Image`, `Lucide.File`), color `text-slate-400`
- Input texto: `flex-1 bg-transparent outline-none text-sm`, placeholder "Pega la URL del recurso..."
- **Botón "Validar"** (prioridad actual): `text-blue-600 text-sm font-medium hover:text-blue-700` — verifica que la URL sea accesible (HTTP HEAD request)
- **Botón "Biblioteca"** (preparación futura): icono `Lucide.FolderOpen`, `text-slate-400 hover:text-slate-600`, tooltip "Próximamente: Gestiona tus archivos"

### Estados visuales

| Estado | Estilo |
|:-------|:-------|
| Vacío | Placeholder gris, sin preview |
| Cargando / validando | Spinner `text-blue-600` dentro del input |
| URL válida | Borde `border-slate-200`, preview visible debajo |
| URL inválida | `border-red-200 bg-red-50/30`, mensaje `text-red-500 text-xs` "URL no válida o privada" |

### Preview del recurso

- Contenedor: `mt-2 rounded-lg overflow-hidden border border-slate-200`
- VIDEO: `<video controls class="w-full aspect-video">`
- IMAGE: `<img class="w-full aspect-video object-cover">`
- DOCUMENT: fila con icono + nombre extraído de la URL + enlace "Abrir"
- Usa `@if` / `@else` de Angular (nuevo Control Flow) para alternar entre vacío y preview.

### File Manager — Modal futuro

- Punto de entrada: botón "Biblioteca" activa un drawer/modal lateral.
- **Header:** buscador + filtros por tipo (Imágenes, Videos, Documentos).
- **Grid:** cards con miniatura. Al seleccionar, la URL se inyecta en el input del slide.
- **Upload:** área de carga en esquina superior. Archivos filtrados estrictamente por `tenantId`.
- Por ahora el botón muestra un tooltip "Próximamente"; el modal no se implementa hasta que se habilite el File Manager.

**Footer del Formulario:**
- `bg-slate-50 border-t`
- Botón "Cancelar" (secundario) alineado a la izquierda.
- Botón "Guardar Cambios" (primario `bg-blue-600`) alineado a la derecha.

---

## 3. Reglas para el Asistente

1. **Mantén Tailwind:** Usa estas clases como base. No introduzcas CSS personalizado salvo para colores exactos (`bg-[#F8FAFC]`, `bg-[#0F172A]`).
2. **Adapta el modelo de datos:** Integra los campos reales del backend (validaciones Zod, campos JSONB) en el Lienzo de Edición manteniendo el estilo de inputs definido.
3. **Mantén la estructura:** La disposición `Sidebar → Timeline → Canvas` es obligatoria. No la cambies.
4. **Standalone components:** Usa Angular standalone components (`standalone: true`) con imports explícitos. Sin NgModules.
5. **Signals para estado local:** Usa `signal()` y `computed()` de Angular. Evita `BehaviorSubject` para estado del componente.
6. **Control Flow moderno:** Usa `@if`, `@else`, `@for` de Angular (no `*ngIf`, `*ngFor`).
7. **Tipado estricto:** Usa las interfaces de `@kiosco/shared-kernel` cuando estén disponibles. No uses `any`.
8. **URLs, no archivos:** El valor de cualquier campo multimedia siempre es un `string` (URL). No asumas carga local de archivos. El sistema está preparado para CDN propio o de terceros.
9. **Multi-tenancy en File Manager:** Cuando se implemente, los assets deben filtrarse siempre por `tenantId`.
