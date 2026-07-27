// ============================================================================
// FOTOS PROVISIONALES — SUSTITUIR ANTES DE PUBLICAR
//
// Son las mismas siete fotos que ya usan el hero, NEXT, ARCHIVE y RESIDENTS:
// aquí se repiten para poder maquetar la galería. Hacen falta 6-9 fotos propias
// de noches pasadas, mezclando horizontales y verticales.
// ============================================================================

import mainRoomImage from "@/public/main1.jpg"
import djBlueImage from "@/public/dj_blue1.jpg"
import girlPartyingImage from "@/public/girl_partying1.jpg"
import djGreenImage from "@/public/dj_green1.jpg"
import bwPartyGirlImage from "@/public/bw_partygirl.jpg"
import djSetupImage from "@/public/dj_setup_1.jpg"

export type DocumentPhoto = {
  id: string
  image: import("next/image").StaticImageData
  alt: string
}

export const documentPhotos: DocumentPhoto[] = [
  {
    id: "main-room",
    image: mainRoomImage,
    alt: "Packed main room swept by green laser beams beneath a mirror ball",
  },
  {
    id: "crowd-blue",
    image: djBlueImage,
    alt: "Club crowd in blue and pink light with the DJ booth in the background",
  },
  {
    id: "dancer-teal",
    image: girlPartyingImage,
    alt: "Dancer with an arm raised amid teal and pink lights",
  },
  {
    id: "booth-green",
    image: djGreenImage,
    alt: "DJ mixing behind laptops under green light",
  },
  {
    id: "floor-bw",
    image: bwPartyGirlImage,
    alt: "Black and white shot of a packed dance floor",
  },
  {
    id: "decks-red",
    image: djSetupImage,
    alt: "DJ working the decks seen from behind under deep red light",
  },
]
