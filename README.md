# CV Portfolio — Angular 19 + GSAP

CV web multipágina (no landing) con animaciones de scroll y de componentes. Se compila a
**HTML estático prerenderizado** por ruta: se puede subir a Vercel, Netlify, GitHub Pages o
cualquier hosting estático, sin servidor Node.

## Comandos

```bash
npm install
npm start                                   # dev en http://localhost:4200
npm run build                               # estático en dist/cv-portfolio/browser
node scripts/generate-illustrations.mjs     # regenera las ilustraciones SVG de /public/images
```

## Qué editar primero

| Archivo | Qué contiene |
|---|---|
| `src/app/core/data/profile.data.ts` | Nombre, correo, redes, resumen, valores y trayectoria |
| `src/app/core/data/experience.data.ts` | Experiencias (hoy: Oficina Virtual), agentes, pipeline, capas de seguridad |
| `src/app/core/data/skills.data.ts` | Áreas de habilidades y niveles |
| `public/images/avatar.svg` | Retrato ilustrado: reemplázalo por tu foto (mismo nombre o cambia la ruta) |

Las páginas solo leen de `core/data/`: para actualizar el CV no hace falta tocar plantillas.

## Páginas (rutas lazy + prerender)

| Ruta | Página | Animaciones destacadas |
|---|---|---|
| `/` | Inicio | Timeline de entrada, hero que se aleja con scroll, marquesina que reacciona a la velocidad del scroll, contadores, tarjetas con tilt 3D |
| `/sobre-mi` | Sobre mí | Párrafo que se ilumina palabra a palabra (scrub), retrato sticky con parallax, línea de trayectoria que se llena |
| `/experiencia` | Experiencia | Columna lateral sticky, portada con clip-reveal + parallax |
| `/experiencia/oficina-virtual` | Caso de estudio | Chat de Telegram fijado (pin) que se reproduce con el scroll, diagrama de arquitectura que se dibuja, pipeline con scroll horizontal fijado, tarjetas de seguridad apiladas, tablero que se aplana en 3D |
| `/habilidades` | Habilidades | Scroll horizontal fijado con barras que se llenan por tarjeta (`containerAnimation`) |
| `/contacto` | Contacto | Copiar correo, formulario reactivo que arma un `mailto` (sin backend) |
| `**` | 404 | |

Entre páginas: **View Transitions API** (`withViewTransitions`). Todo respeta `prefers-reduced-motion`.

## Arquitectura

```
src/app/
├── core/
│   ├── data/            # fuente única de verdad del CV (perfil, experiencia, skills)
│   ├── motion/          # MotionService: registra GSAP/ScrollTrigger una vez, refresh por ruta
│   └── seo/             # meta description por ruta (data.description)
├── shared/
│   ├── motion/          # useGsap() + 7 directivas de animación reutilizables
│   │   ├── use-gsap.ts           # afterNextRender + gsap.context(scope) + revert en DestroyRef
│   │   ├── reveal.directive.ts   # [appReveal] aparición al entrar (up/left/right/scale/clip/blur), stagger con [data-reveal-item]
│   │   ├── split-words.directive.ts # [appSplitWords] titulares palabra a palabra ('rise') o iluminado con scroll ('scrub')
│   │   ├── parallax.directive.ts # [appParallax] scrub, reducido en móvil con gsap.matchMedia
│   │   ├── draw-svg.directive.ts # [appDrawSvg] stroke-dashoffset + nodos ligados al scroll
│   │   ├── counter.directive.ts  # [appCounter] cuenta hasta el valor al aparecer
│   │   ├── tilt.directive.ts     # [appTilt] inclinación 3D + brillo con quickTo
│   │   └── magnetic.directive.ts # [appMagnetic] botón magnético
│   └── ui/              # icon (Lucide), section-heading, chip, next-page
├── layout/              # header (se oculta al bajar, menú móvil con clip-path), footer, barra de progreso
└── pages/               # una carpeta por ruta; cada página es un chunk lazy
```

Decisiones:

- **Estático con prerender** (`outputMode: "static"`): cada ruta sale como su propio `index.html`,
  bueno para SEO y para compartir enlaces del CV. Angular hidrata ese HTML (`provideClientHydration`).
- **GSAP solo en el navegador**: todo pasa por `useGsap()`, que corre en `afterNextRender`
  (nunca en el prerender) y revierte tweens/ScrollTriggers al destruir el componente. Así no hay
  fugas al navegar entre páginas con pins.
- **Sin parpadeo**: un script en `index.html` añade `html.motion` (solo con JS y sin reduced-motion);
  el CSS oculta `[data-reveal]` y `[data-split='rise']` solo bajo esa clase. Sin JS, todo es visible.
- **Ilustraciones propias en SVG** (generadas por script), no capturas del sistema real.
- `src/main.server.ts` pasa el `BootstrapContext` a `bootstrapApplication`: Angular 19.2.x lo exige
  en el servidor (sin eso el prerender falla con `NG0401`).

## Despliegue

Sube `dist/cv-portfolio/browser`. Para que rutas inexistentes caigan en la app (404 propio),
configura el fallback a `index.csr.html`:

- **Vercel**: `vercel.json` con `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.csr.html" }] }`
  (los archivos existentes tienen prioridad sobre el rewrite).
- **Netlify**: `public/_redirects` con `/*  /index.csr.html  200`.
