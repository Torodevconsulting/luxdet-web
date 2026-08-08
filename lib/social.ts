// Perfiles sociales, compartidos por los residentes (content/residents.ts), el
// propio Luxdet (content/site.ts) y los eventos (content/events.ts).
//
// Vive en lib/ y no en content/ porque lo usan tres archivos de contenido a la
// vez: dejarlo en cualquiera de ellos obligaría a los otros dos a importar de un
// hermano solo por un tipo.

export type SocialPlatform =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "soundcloud"
  | "mixcloud"
  | "ra"

export type Social = {
  platform: SocialPlatform
  url: string
  /**
   * Arroba visible ("@grovhaus"). Opcional: el modal de residentes rotula sus
   * enlaces con el nombre de la plataforma, mientras que en la página de evento
   * el handle es lo que identifica a quién sigues, que es más útil cuando en el
   * mismo bloque conviven dos cuentas distintas.
   */
  handle?: string
}

export const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  soundcloud: "SoundCloud",
  mixcloud: "Mixcloud",
  ra: "Resident Advisor",
}
