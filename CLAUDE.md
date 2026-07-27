# LUXDET — Contexto del proyecto

Sitio web para **Luxdet**, productora de eventos de música electrónica en Ohio (EE.UU.).
Cliente de Toro Development Agency.

## Stack

Next.js 16.2.11 (App Router) · React 19.2.8 · TypeScript 5 (strict) ·
Tailwind CSS v4 (CSS-first, **no hay `tailwind.config`**) · Vercel Analytics.
Gestor: pnpm. Deploy: Vercel.

Quedan 7 dependencias de producción. El scaffold de shadcn/ui se podó entero
(ver pendiente 7): no hay `components/ui/`, ni `hooks/`, ni Radix, ni
lucide-react. Se conservan `components.json` y `lib/utils.ts` (`cn`) para poder
regenerar componentes con `npx shadcn@latest add <componente>`, que reinstala
sus dependencias. También se conserva `sonner`, elegido como sistema de toast.

## Origen y estado

Partimos de un template exportado de v0.app que fue auditado y saneado antes de
empezar. Contexto importante para no reintroducir problemas ya resueltos:

- `app/globals.css` contenía 366 líneas de filtros cosméticos de uBlock Origin
  copiadas del HTML original. **Ya eliminadas.** Si vuelven a aparecer selectores
  tipo `.ad-zone`, `tsyndicate`, `yandex` o `taboola`, es regresión.
- `next.config.mjs` tenía `typescript.ignoreBuildErrors: true`. **Ya eliminado.**
  No volver a añadirlo: tapaba un error de tipos real.
- `package.json` tiene `overrides` / `pnpm.overrides` fijando `postcss` ^8.5.23 y
  `sharp` ^0.35.3 porque Next 16.2.11 empaqueta versiones con CVEs. **No quitar
  sin comprobar antes `npm audit --omit=dev`.** Revisarlos al actualizar Next.

## Convenciones

- Sin punto y coma, comillas dobles en `app/`, comillas simples en `components/ui/`
  (así lo generó shadcn; respetar el estilo de cada archivo).
- Alias de imports: `@/*` → raíz del proyecto.
- Componentes nuevos propios van en `components/`; los de secciones de la home,
  en `components/sections/`. Si se regenera algo con el CLI de shadcn aparecerá
  en `components/ui/`: eso es scaffold, **no se edita a mano** y hay que volver
  a excluirlo en `eslint.config.mjs`.
- Idioma del sitio: **inglés** (`lang="en"`, público de Ohio). Los comentarios de
  código y la comunicación conmigo, en español.

## Comandos

```bash
pnpm dev      # desarrollo
pnpm build    # debe pasar sin errores de tipos antes de cada commit
pnpm lint     # debe quedar limpio: 0 warnings
pnpm audit    # producción debe quedar en 0 vulnerabilidades
```

## Reglas de trabajo

- **Ejecuta `pnpm build` antes de dar por terminada cualquier tarea.** El
  proyecto ya no ignora errores de TypeScript.
- No añadir dependencias sin justificarlo: ya hay ~60 componentes de shadcn sin
  usar. Antes de instalar algo, comprobar si Radix o shadcn ya lo cubren.
- No tocar `.env.local` ni escribir secretos en el código. Las claves van en
  variables de entorno documentadas en `.env.example`.
- La CSP de `next.config.mjs` es restrictiva. Cualquier script, iframe o dominio
  de imagen externo (widgets de ticketing, embeds de SoundCloud/Spotify) hay que
  añadirlo explícitamente ahí o fallará en silencio en producción.

## Pendientes (orden sugerido)

1. **Reducir el peso de las fotos de `public/`.** Ya no hay imágenes remotas: las
   fotos propias están integradas con `next/image` (todos los `<img>` migrados,
   ESLint limpio). Pero los originales son de 4000 px y pesan 9-14 MB cada uno,
   ~78 MB en total en el repo. Redimensionar a ~2560 px de ancho con `sharp`
   (está instalado por el override de `package.json`).
   Nota: el hero ya no lleva foto (es rejilla + tipografía), así que **ninguna
   imagen usa `priority` y el LCP de la home es ahora el `<h1>`**. Cualquier
   medición de rendimiento debe partir de eso: no hay imagen en la primera
   pantalla que optimizar. `public/dj_pink1.jpg` se conserva porque la usa
   `content/residents.ts`.
2. ~~Refactorizar `app/page.tsx`.~~ **Hecho:** troceado en Server Components
   (`components/sections/`) con dos islas de cliente, `CursorBlob` y
   `ParallaxProvider`. Este último ya usa `requestAnimationFrame` y se
   desactiva entero bajo `prefers-reduced-motion`.
3. Accesibilidad: el footer usa `#555` sobre `#0e0e0e` → contraste 2.6:1, falla
   WCAG AA. Subir a `#8a8a8a` o más. Relevante por ADA en EE.UU.
4. JSON-LD `schema.org/Event` por evento (rich results de Google). Es la mayor
   palanca de SEO para una productora de eventos.
5. `app/robots.ts`, `app/sitemap.ts`, `app/opengraph-image.png`.
6. Formulario de booking/newsletter: route handler + Resend + Cloudflare Turnstile.
7. ~~Podar los componentes de `components/ui/` que no se usen.~~ **Hecho:**
   borrados los 55 componentes, `components/theme-provider.tsx` y `hooks/`
   (ninguno se usaba), y desinstaladas 43 dependencias de producción (50 → 7).
   Al abordar el pendiente 6 habrá que traer con el CLI los componentes del
   formulario; el wrapper `ui/sonner.tsx` de shadcn depende de `next-themes`,
   que ya no está instalado.
8. Endurecer la CSP quitando `'unsafe-inline'` de `style-src` cuando los estilos
   en línea de `page.tsx` pasen a `globals.css`.
