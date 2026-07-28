/**
 * Origen público del sitio. Lo usan el metadataBase de layout.tsx, el sitemap,
 * robots.txt y las URLs absolutas del JSON-LD, así que vive en un solo sitio.
 *
 * En Vercel hay que definir NEXT_PUBLIC_SITE_URL o todas esas URLs apuntarán a
 * localhost, que es un fallo silencioso: el sitio se ve bien y solo falla lo que
 * leen Google y las previews de enlace.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export const siteName = "LUXDET CULTURE"

// PROVISIONAL: "viscera.studio" viene de la plantilla de v0 y no es un dominio
// de Luxdet. Hace falta la dirección real: además del footer, es el destino del
// CTA de captación cuando no hay fechas anunciadas.
export const contactEmail = "hello@viscera.studio"

/**
 * Destino del CTA cuando no hay eventos próximos. En la fase 3 pasará a ser
 * "#mailing-list"; hasta que esa sección exista, el ancla quedaría colgando.
 */
export const mailingListHref = `mailto:${contactEmail}`

/** URL canónica de la página de un evento. */
export function eventUrl(slug: string) {
  return `${siteUrl}/events/${slug}`
}
