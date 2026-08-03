// ============================================================================
// DATOS PROVISIONALES — NO PUBLICAR ASÍ
//
// Todos los residentes comparten el MISMO set y el MISMO handle, que son de
// Toro. Sirve para maquetar y probar el reproductor, pero tal cual publicado
// atribuiría el trabajo de una persona a las otras cinco, y la atribución
// correcta del autor es justo lo que exigen los términos de SoundCloud.
//
// Antes de publicar hace falta, por residente: su set (o ninguno), sus redes
// reales y su bio propia. Un residente sin `bio` es un caso soportado: su foto
// se muestra pero no abre modal.
//
// Las fotos son de archivo del club, no retratos: se recortan a 3:4 por CSS.
// ============================================================================

import type { Performer } from "@/lib/events"
import djSetupImage from "@/public/dj_setup_1.jpg"
import djGreenImage from "@/public/dj_green1.jpg"
import girlPartyingImage from "@/public/girl_partying1.jpg"
import djBlueImage from "@/public/dj_blue1.jpg"
import bwPartyGirlImage from "@/public/bw_partygirl.jpg"
import djPinkImage from "@/public/dj_pink1.jpg"

export type SocialPlatform = "instagram" | "soundcloud" | "mixcloud" | "ra"

export type Social = {
  platform: SocialPlatform
  url: string
}

export type Mix = {
  platform: "soundcloud" | "mixcloud"
  url: string
  title: string
}

/**
 * Un residente es un `Performer` con ficha propia, así que se puede pasar
 * directamente al line-up de un evento sin duplicar el nombre.
 *
 * `bio` en párrafos y no en un solo string: así se mapea a <p> sin partir texto
 * por saltos de línea en el componente. Sin `bio` la foto no es interactiva.
 */
export type Resident = Performer & {
  slug: string
  role: string
  image: import("next/image").StaticImageData
  imageAlt: string
  bio?: string[]
  socials?: Social[]
  mixes?: Mix[]
}

// PROVISIONAL: el mismo material para todos, ver aviso de arriba.
const sharedSocials: Social[] = [
  { platform: "instagram", url: "https://instagram.com/eltoromusic" },
  { platform: "soundcloud", url: "https://soundcloud.com/torointhehouse" },
]

const sharedMixes: Mix[] = [
  {
    platform: "soundcloud",
    url: "https://soundcloud.com/torointhehouse/gus-i-toro-dj-sessions",
    title: "Gus & Toro DJ Sessions",
  },
]

export const residents: Resident[] = [
  {
    slug: "bejaguz",
    name: "Bejaguz",
    role: "Founder · Tech House & Minimal",
    image: djSetupImage,
    imageAlt: "DJ working the decks seen from behind, bathed in deep red light",
    bio: [
      "Started Luxdet after two years of throwing parties in rooms that were never meant to hold a sound system. Books the line-ups and still plays the closing set most nights.",
      "Leans on stripped-back house and the slower end of techno — long blends, no drops for the sake of drops. If the room is still moving at 3am, that is the whole point.",
    ],
    socials: sharedSocials,
    mixes: [
  { platform: "soundcloud", url: "https://soundcloud.com/bejaguz/bejaguz-rolling-tech-set", title: "Bejaguz - Rolling Tech" },
    ],
  },
  {
    slug: "Venee",
    name: "Venee",
    role: "Resident · Deep House & Dub Techno",
    image: djGreenImage,
    imageAlt: "DJ mixing behind laptops under green light",
    bio: [
      "Resident since the second Substrata. Plays the warm-up more often than the peak, and treats it as the harder job of the two.",
      "Dub techno, deep house and the occasional detour into breaks when the floor asks for it.",
    ],
    socials: sharedSocials,
    mixes: sharedMixes,
  },
  {
    slug: "toro",
    name: "Toro",
    role: "Resident · Techno & Hardgroove",
    image: djBlueImage,
    imageAlt: "Club crowd in blue and pink light with the DJ booth behind",
    bio: [
      "Half of the Gus & Toro sessions and a fixture behind the Luxdet booth. Builds sets around groove rather than genre.",
      "Expect house with a heavy low end, disco edits and the kind of records that work better at two in the morning than on headphones.",
    ],
    socials: sharedSocials,
    mixes: [
  { platform: "soundcloud", url: "https://soundcloud.com/torointhehouse/gus-i-toro-dj-sessions", title: "Gus & Toro DJ Sessions" },
    ],
  },
  {
    slug: "marlo-k",
    name: "Marlo K.",
    role: "Resident · Minimal & Micro-house",
    image: girlPartyingImage,
    imageAlt: "Dancer with an arm raised under teal and pink lights",
    bio: [
      "Joined the roster in 2025 after a run of guest slots. Plays fast and keeps the mixes tight.",
      "Minimal and micro-house, with a habit of dropping something unreasonably melodic right before the lights come up.",
    ],
    socials: sharedSocials,
    mixes: sharedMixes,
  },
  {
    slug: "vellum",
    name: "Vellum",
    role: "Resident · Minimal",
    image: bwPartyGirlImage,
    imageAlt: "Black and white portrait of a dancer on a packed floor",
    bio: [
      "The quietest set of the night and usually the one people ask about afterwards. Minimal in the strict sense: very little happening, all of it on purpose.",
      "Came up playing after-hours rooms, which explains the patience: the first twenty minutes are always a slow build.",
    ],
    socials: sharedSocials,
    mixes: sharedMixes,
  },
  {
    slug: "kessler",
    name: "Kessler",
    role: "Guest · Techno",
    image: djPinkImage,
    imageAlt: "DJ booth under pink neon with the crowd in front",
    bio: [
      "Not a resident but close enough to be on the wall. Plays two or three Luxdet nights a year, always the hard ones.",
      "Straight techno with no interest in subtlety: fast, loud and built for the last hour of the night.",
    ],
    socials: sharedSocials,
    mixes: sharedMixes,
  },
]
