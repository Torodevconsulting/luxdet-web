/** @type {import('next').NextConfig} */

// Cabeceras de seguridad aplicadas a todas las rutas.
// La CSP arranca en modo permisivo para no romper el desarrollo: 'unsafe-inline'
// es necesario mientras la home use estilos en línea (style={{...}} en page.tsx).
// Cuando esos estilos pasen a globals.css, endurecerla quitando 'unsafe-inline'.
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://va.vercel-scripts.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
]

const nextConfig = {
  images: {
    // Ya no hay imágenes remotas: todas las fotos viven en public/.
    // Si se añade un dominio externo, hay que declararlo aquí y en la CSP.
    // Next 16 solo sirve los valores de `quality` declarados aquí.
    // 90 es para la foto del hero: mucho detalle y es el LCP.
    qualities: [75, 90],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
