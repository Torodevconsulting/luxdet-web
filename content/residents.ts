import type { Performer } from "@/lib/events"
import djVenee from "@/public/venee.jpg"
import bwPartyGirlImage from "@/public/bw_partygirl.jpg"
import djShoon from "@/public/shoon.jpg"
import djBejaguz from "@/public/bejaguz.jpeg"
import djToro from "@/public/toro.jpeg"
import djTweety from "@/public/tweety.png"

export type SocialPlatform = "instagram" | "soundcloud" | "mixcloud" | "ra"

export type Social = {
  platform: SocialPlatform
  url: string
}

export type Mix = {
  platform: "soundcloud" | "mixcloud"
  url: string
  title: string
  /**
   * De quién es el set. Es obligatorio y no admite valor por defecto a
   * propósito: el line-up de la página de evento SOLO monta mixes "own", y ese
   * filtro tiene que ser una decisión escrita, no una casualidad.
   *
   * - "own": el set es de este DJ. Es el único que se reproduce bajo su nombre
   *   en un evento.
   * - "placeholder": material provisional prestado de otro (hoy, el set de Toro
   *   repetido en varias fichas). Se sigue viendo en el modal de residentes,
   *   donde la línea de crédito dice de quién es, pero NUNCA en el line-up de un
   *   evento: un reproductor rotulado "Gus & Toro DJ Sessions" bajo el nombre de
   *   otra persona le atribuye su trabajo a quien no lo hizo.
   *
   * Al ser un campo requerido, añadir un mix obliga a declarar cuál es: nada se
   * cuela en el line-up por olvido.
   */
  attribution: "own" | "placeholder"
}

export type Resident = Performer & {
  /**
   * Identificador interno, kebab-case ASCII. NO es una URL: no existe ninguna
   * ruta /residents/[slug]. Se usa como `data-resident`, como `id` en el DOM y
   * como referencia desde `performer[].residentSlug` en content/events.ts.
   *
   * El kebab-case no es cosmético. Estos slugs se interpolan en el `id` que
   * lee `aria-labelledby` del diálogo, y ese atributo es una LISTA de IDs
   * separados por espacios: un slug con espacio ("Nischel Soni") apuntaba a dos
   * IDs inexistentes y dejaba al diálogo sin nombre accesible.
   */
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

// PENDIENTE: es el set de Toro repetido en las fichas de Venee, Shoon y
// Nischel Soni porque aún no tenemos sus SoundCloud. Marcado como
// "placeholder", que es lo que lo mantiene fuera del line-up de los eventos.
// Al llegar sus mixes reales, cada uno se mueve a su ficha con "own" y aparece
// solo en las páginas de evento donde toque.
const sharedMixes: Mix[] = [
  {
    platform: "soundcloud",
    url: "https://soundcloud.com/torointhehouse/gus-i-toro-dj-sessions",
    title: "Gus & Toro DJ Sessions",
    attribution: "placeholder",
  },
]

export const residents: Resident[] = [
  {
    slug: "bejaguz",
    name: "Bejaguz",
    role: "Resident · Tech House & Minimal",
    image: djBejaguz,
    imageAlt: "DJ working the decks seen from behind, bathed in deep red light",
    bio: [
      "Bejaguz is an underground selector who chases groove over hype. The sound lives somewhere between rolling tech house, minimal, deep house, and melodic influences, with occasional Latin flavors woven in naturally rather than as a gimmick.",
      "He delivers hypnotic grooves, deep basslines, and seamless transitions that keep the energy flowing. Influenced by the underground scene, every set is a journey where rhythm speaks louder than words.",
    ],
    socials: sharedSocials,
    mixes: [
      {
        platform: "soundcloud",
        url: "https://soundcloud.com/bejaguz/bejaguz-rolling-tech-set",
        title: "Bejaguz - Rolling Tech",
        attribution: "own",
      },
    ],
  },
  {
    slug: "tweety",
    name: "Tweety",
    role: "Resident · Minimal & Tech House",
    image: djTweety,
    imageAlt: "DJ mixing behind laptops under green light",
    bio: [
      "Resident since the second Substrata. Plays the warm-up more often than the peak, and treats it as the harder job of the two.",
      "Dub techno, deep house and the occasional detour into breaks when the floor asks for it.",
    ],
    socials: sharedSocials,
    mixes: [
      {
        platform: "soundcloud",
        url: "https://soundcloud.com/user-581659015/erotic-hau5-deep-tech-minimal",
        title: "Erotic Hau5 - Deep Tech / Minimal",
        attribution: "own",
      },
    ],
  },
  {
    slug: "toro",
    name: "Toro",
    role: "Resident · Techno & Hardgroove",
    image: djToro,
    imageAlt: "Club crowd in blue and pink light with the DJ booth behind",
    bio: [
      "Half of the Gus & Toro sessions and a fixture behind the Luxdet booth. Builds sets around groove rather than genre.",
      "Expect house with a heavy low end, disco edits and the kind of records that work better at two in the morning than on headphones.",
    ],
    socials: sharedSocials,
    mixes: [
      {
        platform: "soundcloud",
        url: "https://soundcloud.com/torointhehouse/gus-i-toro-dj-sessions",
        title: "Gus & Toro DJ Sessions",
        // En la ficha de Toro sí es suyo, al contrario que en las otras tres.
        attribution: "own",
      },
    ],
  },
  {
    slug: "venee",
    name: "Venee",
    role: "Resident · Minimal & Micro-house",
    image: djVenee,
    imageAlt: "Dancer with an arm raised under teal and pink lights",
    bio: [
      "Joined the roster in 2025 after a run of guest slots. Plays fast and keeps the mixes tight.",
      "Minimal and micro-house, with a habit of dropping something unreasonably melodic right before the lights come up.",
    ],
    socials: sharedSocials,
    mixes: sharedMixes,
  },
  {
    slug: "shoon",
    name: "Shoon",
    role: "Resident · Minimal",
    image: djShoon,
    imageAlt: "Black and white portrait of a dancer on a packed floor",
    bio: [
      "The quietest set of the night and usually the one people ask about afterwards. Minimal in the strict sense: very little happening, all of it on purpose.",
      "Came up playing after-hours rooms, which explains the patience: the first twenty minutes are always a slow build.",
    ],
    socials: sharedSocials,
    mixes: sharedMixes,
  },
  {
    slug: "Gussi",
    name: "Gussi",
    role: "Guest · Techno",
    image: bwPartyGirlImage,
    imageAlt: "DJ booth under pink neon with the crowd in front",
    bio: [
      "Not a resident but close enough to be on the wall. Plays two or three Luxdet nights a year, always the hard ones.",
      "Straight techno with no interest in subtlety: fast, loud and built for the last hour of the night.",
    ],
    socials: sharedSocials,
    mixes: sharedMixes,
  },
]
