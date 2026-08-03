import type { Performer } from "@/lib/events"
import girlPartyingImage from "@/public/girl_partying1.jpg"
import bwPartyGirlImage from "@/public/bw_partygirl.jpg"
import djPinkImage from "@/public/dj_pink1.jpg"
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
}

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
    role: "Resident · Tech House & Minimal",
    image: djBejaguz,
    imageAlt: "DJ working the decks seen from behind, bathed in deep red light",
    bio: [
      "Bejaguz is an underground selector who chases groove over hype. The sound lives somewhere between rolling tech house, minimal, deep house, and melodic influences, with occasional Latin flavors woven in naturally rather than as a gimmick.",
      "He delivers hypnotic grooves, deep basslines, and seamless transitions that keep the energy flowing. Influenced by the underground scene, every set is a journey where rhythm speaks louder than words.",
    ],
    socials: sharedSocials,
    mixes: [
  { platform: "soundcloud", url: "https://soundcloud.com/bejaguz/bejaguz-rolling-tech-set", title: "Bejaguz - Rolling Tech" },
    ],
  },
  {
    slug: "Tweety",
    name: "Tweety",
    role: "Resident · Minimal & Tech House",
    image: djTweety,
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
    image: djToro,
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
    slug: "Venee",
    name: "Venee",
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
    slug: "Shoon",
    name: "Shoon",
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
    slug: "Nischel Soni",
    name: "Nischel Soni",
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
