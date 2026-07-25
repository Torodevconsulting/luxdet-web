# LUXDET — Sitio web

Productora de eventos de música electrónica (Ohio, EE.UU.).
Base: template "Viscera" exportado de v0, saneado y actualizado.

## Requisitos

- Node.js 20.9+ (recomendado 22 LTS)
- pnpm 9+ (`corepack enable && corepack prepare pnpm@latest --activate`)

## Inicializar

```bash
pnpm install
cp .env.example .env.local
pnpm dev            # http://localhost:3000
```

Otros comandos:

```bash
pnpm build          # build de producción
pnpm start          # servir el build
pnpm lint           # ESLint
pnpm audit          # auditoría de dependencias
```

> El proyecto se validó con npm; el `package.json` incluye `overrides` (npm)
> y `pnpm.overrides` con el mismo contenido, así que funciona con cualquiera
> de los dos. Usa **uno solo** y commitea su lockfile.

## Estado de seguridad

`npm audit --omit=dev` → **0 vulnerabilidades**.

Se fijaron dos overrides porque Next 16.2.11 todavía empaqueta versiones
antiguas de estas dependencias:

| Paquete | Next trae | Forzado a | Motivo |
|---|---|---|---|
| `postcss` | 8.4.31 | ^8.5.23 | XSS vía `</style>`, lectura de archivos vía `sourceMappingURL` |
| `sharp` | 0.34.5 | ^0.35.3 | CVEs heredados de libvips (CVE-2026-33327/33328/35590/35591) |

**Revisar estos overrides en cada actualización de Next.** Cuando Next
incorpore versiones iguales o superiores, se pueden eliminar.

El árbol de **desarrollo** (solo ESLint) sigue reportando un aviso en
`brace-expansion` / `minimatch`. Es DoS con patrones glob maliciosos, requiere
control del input del linter, nunca llega a producción y **no se puede forzar**:
subir `brace-expansion` a 5.x rompe `minimatch` 3.x. Se deja documentado a
propósito.

## Cambios aplicados sobre el template original

1. `next` 16.0.10 → **16.2.11**, `react`/`react-dom` 19.2.0 → **19.2.8**
   (resuelve ~30 advisories de Next: bypass CSRF en Server Actions, request
   smuggling en rewrites, cache poisoning en RSC, XSS con nonces CSP, SSRF...).
2. **Eliminadas las líneas 415–782 de `app/globals.css`**: 366 líneas / 9,9 KB
   de filtros cosméticos de uBlock Origin que el generador copió del HTML
   original. Eran una única regla `display: none !important` — inertes, pero
   código muerto con selectores genéricos capaces de ocultar contenido legítimo.
   CSS: 22,9 KB → 13,0 KB.
3. Eliminado `typescript.ignoreBuildErrors: true`. Tapaba un error real de
   tipos en `app/page.tsx` (`this` implícitamente `any` en el listener de las
   anclas), ya corregido.
4. Corregida una fuga de memoria: los listeners de click de los enlaces ancla
   no se eliminaban al desmontar.
5. Añadidas cabeceras de seguridad en `next.config.mjs` (CSP, HSTS,
   X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).
6. Añadido ESLint 9 (flat config) con `eslint-config-next`. `components/ui/**`
   y `hooks/**` quedan excluidos por ser scaffold de shadcn.
7. Quitado `images.unoptimized: true`; añadido `remotePatterns` para Unsplash.
8. Metadata migrada a LUXDET con Open Graph y Twitter Card.
9. Eliminados duplicados: `components/ui/use-toast.ts`,
   `components/ui/use-mobile.tsx` y `styles/globals.css` (idénticos a los de
   `hooks/` o sin usar).
10. Añadido `.env.example`.

## Pendiente

- [x] Sustituidas las 6 imágenes hotlinkeadas de `images.unsplash.com` por fotos
      propias de `public/` y migrados todos los `<img>` → `next/image`. ESLint
      queda limpio y `images.unsplash.com` ya no está en la CSP ni en
      `remotePatterns`.
- [ ] Reducir los originales de `public/`: son de 4000 px y 9-14 MB cada uno
      (~78 MB). Redimensionar a ~2560 px con `sharp`.
- [ ] Refactorizar `app/page.tsx`: hoy es un único componente `"use client"`
      con manipulación imperativa del DOM. Separar en componentes de servidor +
      islas de cliente, y pasar los listeners de scroll a `requestAnimationFrame`.
- [ ] Contraste: el footer usa `#555` sobre `#0e0e0e` a 0.8rem → ratio 2.6:1,
      falla WCAG AA. Subir a `#8a8a8a` o superior (relevante por ADA en EE.UU.).
- [ ] JSON-LD `schema.org/Event` por evento → rich results de Google.
- [ ] `app/robots.ts`, `app/sitemap.ts` y `app/opengraph-image.png`.
- [ ] Formulario de booking/newsletter (route handler + Resend + Turnstile).
- [ ] Podar los ~60 componentes de `components/ui/` que no se usan.
- [ ] Endurecer la CSP quitando `'unsafe-inline'` de `style-src` cuando los
      estilos en línea de `page.tsx` pasen a `globals.css`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS v4 ·
shadcn/ui + Radix · lucide-react · Vercel Analytics
