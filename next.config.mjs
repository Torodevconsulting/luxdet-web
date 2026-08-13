/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === "development"

// La indexación está cerrada salvo que se abra explícitamente. Misma variable
// que gobierna app/robots.ts: las dos capas se abren y cierran juntas.
// Para abrir: NEXT_PUBLIC_ALLOW_INDEXING=true en Vercel + redeploy.
const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true"

// Cabeceras de seguridad aplicadas a todas las rutas.
// 'unsafe-inline' en style-src es necesario mientras la home use estilos en
// línea (style={{...}}). Cuando esos estilos pasen a globals.css, endurecerla.
// 'unsafe-eval' se añade SOLO en desarrollo: React lo usa en modo dev para
// reconstruir stack traces. En producción nunca lo usa, así que no se permite.
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // robots.txt solo pide que no rastreen; esta cabecera es la que garantiza
  // que no se indexe aunque alguien enlace una URL desde fuera.
  ...(allowIndexing
    ? []
    : [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]),
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // challenges.cloudflare.com va en script-src, al revés que los
      // reproductores de abajo: el widget de Turnstile se ejecuta en NUESTRA
      // página, no dentro de un iframe con su propia CSP. La llamada del
      // servidor a siteverify no necesita nada aquí — es servidor a servidor y
      // el navegador no interviene.
      // ---------------------------------------------------------------------
      // GOOGLE ANALYTICS 4
      //
      // Los dominios de Google están PERMITIDOS aquí para todo el mundo, pero
      // eso no significa que se carguen: gtag.js no entra en la página hasta
      // que alguien acepta en el banner (ver lib/consent.ts). La CSP es una
      // cabecera estática igual para todas las rutas, así que no puede
      // depender del consentimiento; permitir no es cargar.
      //
      // ⚠️  SI ALGÚN DÍA SE ENCIENDE GOOGLE SIGNALS en la interfaz de GA4
      //     (Admin → Google Signals), GA4 empezará a pedir
      //     https://stats.g.doubleclick.net y esta CSP lo BLOQUEARÁ EN
      //     SILENCIO: no hay error visible, simplemente no llegan los datos de
      //     audiencias ni los cross-device, y se tarda semanas en atar cabos.
      //     Hoy está apagado a propósito. Si se enciende, hay que añadir ese
      //     dominio a connect-src y a img-src, y además revisar
      //     content/privacy.ts, porque activa finalidades publicitarias que la
      //     política actual no declara.
      // ---------------------------------------------------------------------
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://va.vercel-scripts.com https://challenges.cloudflare.com https://www.googletagmanager.com`,
      "style-src 'self' 'unsafe-inline'",
      // Todas las imágenes son locales, salvo el píxel de respaldo de GA4. Si
      // algún día se sirve una imagen remota propia, hay que añadir su dominio
      // aquí Y en images.remotePatterns.
      "img-src 'self' data: blob: https://*.google-analytics.com",
      "font-src 'self' data:",
      // Reproductores embebidos de las fichas de residente. Solo frame-src: el
      // iframe es un contexto de navegación con su propia CSP, así que nuestro
      // script-src y nuestro img-src no gobiernan lo que carga dentro. Harían
      // falta únicamente si cargásemos la Widget API en nuestra página o
      // pintásemos el artwork nosotros, y no hacemos ninguna de las dos.
      // Turnstile además monta un iframe para el desafío.
      'frame-src https://w.soundcloud.com https://player.mixcloud.com https://challenges.cloudflare.com',
      // Los comodines de GA4 no son pereza: el envío real va a endpoints
      // regionales (region1.google-analytics.com y demás) que cambian según
      // desde dónde se conecte quien visita. Fijar solo www.google-analytics.com
      // funciona en local y falla en producción para media Europa.
      `connect-src 'self'${isDev ? ' ws: http://localhost:*' : ''} https://va.vercel-scripts.com https://*.google-analytics.com https://*.analytics.google.com`,
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
]

const nextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
