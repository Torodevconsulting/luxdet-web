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

export const contactEmail = "info.luxdetculture@gmail.com"

export const instagram = {
  handle: "@luxdetculture",
  url: "https://instagram.com/luxdetculture",
}

/** Crédito del estudio que desarrolla el sitio. */
export const developer = {
  name: "Toro Developments",
  url: "https://torodevelop.com",
}

/**
 * Destino de los CTA de contacto: el formulario de la home.
 *
 * Sustituye al antiguo `mailingListHref`. No hay newsletter: Luxdet no va a
 * enviar boletines, y un alta que no recibe nada acaba en marcas de spam.
 */
export const contactFormHref = "#contact-form"

/** URL canónica de la página de un evento. */
export function eventUrl(slug: string) {
  return `${siteUrl}/events/${slug}`
}
