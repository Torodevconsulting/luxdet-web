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
2. **Material real pendiente en `content/`.** Casi todo es provisional; cada
   archivo lo avisa en su cabecera. Lo que más urge:
   - `minimal-depths-002` y `warehouse-09` son eventos **próximos sin `image` ni
     `description`**. Al compartir su URL, la preview de WhatsApp o Instagram
     saldrá genérica, justo en los dos eventos que hay que promocionar. Necesitan
     flyer (4:5, ~1080×1350) y una línea de descripción.
   - Tres eventos tienen `location: { status: "tba" }` porque falta la **dirección
     postal** de Privé, no porque el sitio esté sin confirmar. Al tenerla, volver
     al objeto `confirmed` completo.
   - Ninguna `offers.url`: sin ella la sección NEXT muestra "Tickets announced
     soon" en lugar del CTA de compra.
   - `content/residents.ts`: todos comparten el set y el handle de Toro, lo que
     atribuiría su trabajo a los demás. No publicar así. El line-up de la página
     de evento ya se protege solo: solo monta mixes con `attribution: "own"`.
   - `content/faq.ts`: contenido real, pero **pendiente de revisión legal** y
     con `TODO:` abiertos. Reembolsos y *safer space* son declaraciones públicas
     con consecuencias. Además, dos respuestas prometen datos por evento que el
     modelo no sabe expresar: la política de móviles y el código de vestimenta
     dicen "se indicará en la página del evento", y `LuxdetEvent` no tiene campo
     para ninguna de las dos. O se añaden campos, o esas frases se suavizan.
   - Falta el email real: `content/site.ts` sigue apuntando a `viscera.studio`,
     dominio de la plantilla de v0.
3. ~~Accesibilidad: el footer usa `#555` sobre `#0e0e0e`.~~ **Hecho:** pasó a
   `#8a8a8a` (5.6:1) al quitarle los estilos en línea.
4. ~~JSON-LD `schema.org/Event` por evento.~~ **Hecho:** `eventToJsonLd()` en
   `lib/events.ts`, inyectado en cada `/events/[slug]`, más un `Organization`
   en la home. Comprobar con el Rich Results Test al desplegar con dominio real.
5. ~~`app/robots.ts` y `app/sitemap.ts`.~~ **Hecho.** Queda **`opengraph-image.png`**
   (1200×630): `layout.tsx` ya la declara en `openGraph` y `twitter`, pero el
   archivo no existe, así que las previews al compartir salen sin imagen.
6. ~~Formulario de contacto: route handler + Resend + Turnstile.~~ **Hecho.**
   Es contacto de negocio, no newsletter (Luxdet no envía boletines). Pendiente
   de que verifique el dominio en Resend: hasta entonces el remitente cae a
   `onboarding@resend.dev`, que solo puede enviar a la dirección de la cuenta.
7. **Límite de peticiones en `/api/contact`.** Turnstile frena bots, pero quien
   resuelva un desafío puede enviar en bucle y quemar la cuota de Resend. El
   endpoint no tiene tope por IP. Solución propuesta: `@upstash/ratelimit` con
   Upstash Redis (tiene plan gratuito y es lo que encaja con Vercel), ventana
   deslizante de unos 5 envíos por IP y hora, comprobada **después** de
   Turnstile y **antes** de llamar a Resend, devolviendo 429. Mientras el
   volumen sea bajo no urge, pero es la siguiente capa si aparece abuso.
8. Endurecer la CSP quitando `'unsafe-inline'` de `style-src`. **Ya no quedan
   `style={{}}` propios**: el último era el del footer. Antes de tocar la CSP hay
   que comprobar los que emite `next/image` por su cuenta (el `placeholder="blur"`
   y los estilos de `fill`), que son inline y siguen necesitando permiso.
