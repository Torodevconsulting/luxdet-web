/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === "development"

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
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://va.vercel-scripts.com`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://images.unsplash.com",
      "font-src 'self' data:",
      `connect-src 'self'${isDev ? ' ws: http://localhost:*' : ''} https://va.vercel-scripts.com`,
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
]

const nextConfig = {
  images: {
    // Next 16 exige declarar las calidades usadas. Por defecto solo admite [75].
    qualities: [75, 90],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig