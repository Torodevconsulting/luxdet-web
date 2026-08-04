// ============================================================================
// FOTOS PROVISIONALES — SUSTITUIR ANTES DE PUBLICAR
//
// Son las mismas siete fotos que ya usan el hero, NEXT, ARCHIVE y RESIDENTS:
// aquí se repiten para poder maquetar la galería. Hacen falta 6-9 fotos propias
// de noches pasadas, mezclando horizontales y verticales.
// ============================================================================

import partyImageOne from "@/public/party1.jpg"
import partyImageTwo from "@/public/party2.jpg"
import partyImageThree from "@/public/party3.jpg"
import partyImageFour from "@/public/party4.jpg"
import partyImageFive from "@/public/party5.jpg"
import partyImageSix from "@/public/party8.jpg"

export type DocumentPhoto = {
  id: string
  image: import("next/image").StaticImageData
  alt: string
}

export const documentPhotos: DocumentPhoto[] = [
  {
    id: "main-room",
    image: partyImageOne,
    alt: "Packed main room swept by green laser beams beneath a mirror ball",
  },
  {
    id: "crowd-blue",
    image: partyImageTwo,
    alt: "Club crowd in blue and pink light with the DJ booth in the background",
  },
  {
    id: "dancer-teal",
    image: partyImageThree,
    alt: "Dancer with an arm raised amid teal and pink lights",
  },
  {
    id: "booth-green",
    image: partyImageFour,
    alt: "DJ mixing behind laptops under green light",
  },
  {
    id: "floor-bw",
    image: partyImageFive,
    alt: "Black and white shot of a packed dance floor",
  },
  {
    id: "decks-red",
    image: partyImageSix,
    alt: "DJ working the decks seen from behind under deep red light",
  },
]
