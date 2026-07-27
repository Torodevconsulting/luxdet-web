// ============================================================================
// DATOS PROVISIONALES — SUSTITUIR ANTES DE PUBLICAR
//
// Los nombres coinciden con los line-ups de content/events.ts, pero son
// inventados. Faltan los retratos reales (vertical 3:4, ~1200x1600) y las URLs
// de SoundCloud/Instagram: mientras `url` esté vacío no se renderiza enlace,
// para no dejar destinos que no llevan a ninguna parte.
//
// Las fotos de abajo son de archivo del club, no retratos: sirven para maquetar
// y se recortan a 3:4 por CSS.
// ============================================================================

import type { Performer } from "@/lib/events"
import djSetupImage from "@/public/dj_setup_1.jpg"
import djGreenImage from "@/public/dj_green1.jpg"
import girlPartyingImage from "@/public/girl_partying1.jpg"
import djBlueImage from "@/public/dj_blue1.jpg"
import bwPartyGirlImage from "@/public/bw_partygirl.jpg"
import djPinkImage from "@/public/dj_pink1.jpg"

/**
 * Un residente es un `Performer` con ficha propia, así que se puede pasar
 * directamente al line-up de un evento sin duplicar el nombre.
 */
export type Resident = Performer & {
  slug: string
  role: string
  image: import("next/image").StaticImageData
  imageAlt: string
}

export const residents: Resident[] = [
  {
    slug: "nocta",
    name: "Nocta",
    role: "Founder · Resident",
    image: djSetupImage,
    imageAlt: "DJ working the decks seen from behind, bathed in deep red light",
  },
  {
    slug: "grun",
    name: "Grün",
    role: "Resident",
    image: djGreenImage,
    imageAlt: "DJ mixing behind laptops under green light",
  },
  {
    slug: "sub-urban",
    name: "Sub/Urban",
    role: "Resident",
    image: djBlueImage,
    imageAlt: "Club crowd in blue and pink light with the DJ booth behind",
  },
  {
    slug: "marlo-k",
    name: "Marlo K.",
    role: "Resident",
    image: girlPartyingImage,
    imageAlt: "Dancer with an arm raised under teal and pink lights",
  },
  {
    slug: "vellum",
    name: "Vellum",
    role: "Resident · Minimal",
    image: bwPartyGirlImage,
    imageAlt: "Black and white portrait of a dancer on a packed floor",
  },
  {
    slug: "kessler",
    name: "Kessler",
    role: "Guest · Techno",
    image: djPinkImage,
    imageAlt: "DJ booth under pink neon with the crowd in front",
  },
]
