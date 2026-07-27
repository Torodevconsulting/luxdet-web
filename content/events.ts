// ============================================================================
// DATOS PROVISIONALES — SUSTITUIR ANTES DE PUBLICAR
//
// Nombres de fiesta, line-ups, direcciones, precios y URLs de entradas son
// inventados para poder maquetar. Nada de esto es real todavía.
// ============================================================================
//
// Al añadir un evento:
//   - startDate/endDate llevan offset explícito: -04:00 (EDT, marzo–noviembre)
//     o -05:00 (EST, resto del año). Si te equivocas, el build falla.
//   - Las fiestas cruzan medianoche: endDate cae el día siguiente.
//   - city se rellena siempre, aunque el venue esté por confirmar.

import {
  assertValidEventOffsets,
  selectPast,
  selectUpcoming,
  type LuxdetEvent,
} from "@/lib/events"
import mainRoomImage from "@/public/main1.jpg"
import djGreenImage from "@/public/dj_green1.jpg"
import djSetupImage from "@/public/dj_setup_1.jpg"
import bwPartyGirlImage from "@/public/bw_partygirl.jpg"

export const events: LuxdetEvent[] = [
  {
    slug: "substrata-004",
    name: "Substrata 004",
    startDate: "2026-08-14T23:00:00-04:00",
    endDate: "2026-08-15T04:00:00-04:00",
    location: {
      status: "confirmed",
      name: "Privé",
      streetAddress: "PROVISIONAL — dirección pendiente",
      city: "Columbus",
      region: "OH",
    },
    city: "Columbus",
    performer: [{ name: "Nocta" }, { name: "Sub/Urban" }, { name: "Marlo K." }],
    // PROVISIONAL: falta la URL real de venta. Sin `url` la sección muestra
    // "Tickets announced soon" en lugar de un CTA que no lleva a ningún sitio.
    offers: {
      price: 20,
      priceCurrency: "USD",
      availability: "InStock",
    },
    isAccessibleForFree: false,
    typicalAgeRange: "21+",
    image: mainRoomImage,
    imageAlt: "Packed main room swept by green laser beams beneath a mirror ball",
    description: "Five hours of hypnotic techno and minimal in the main room.",
  },
  {
    // Venue por confirmar: estado normal en esta escena, no un dato que falte.
    slug: "minimal-depths-002",
    name: "Minimal Depths 002",
    startDate: "2026-09-05T22:00:00-04:00",
    endDate: "2026-09-06T03:00:00-04:00",
    location: { status: "tba" },
    city: "Cleveland",
    performer: [{ name: "Grün" }, { name: "Vellum" }],
    offers: {
      price: 15,
      priceCurrency: "USD",
      availability: "PreOrder",
    },
    isAccessibleForFree: false,
    typicalAgeRange: "21+",
  },
  {
    // Noviembre: el horario de verano ya terminó, por eso -05:00 y no -04:00.
    slug: "warehouse-09",
    name: "Warehouse 09",
    startDate: "2026-11-14T23:00:00-05:00",
    endDate: "2026-11-15T05:00:00-05:00",
    location: { status: "tba" },
    city: "Cincinnati",
    performer: [{ name: "Nocta" }, { name: "Kessler" }],
    isAccessibleForFree: false,
    typicalAgeRange: "21+",
  },
  {
    slug: "substrata-003",
    name: "Substrata 003",
    startDate: "2026-06-12T23:00:00-04:00",
    endDate: "2026-06-13T04:00:00-04:00",
    location: {
      status: "confirmed",
      name: "Privé",
      streetAddress: "PROVISIONAL — dirección pendiente",
      city: "Columbus",
      region: "OH",
    },
    city: "Columbus",
    performer: [{ name: "Grün" }, { name: "Marlo K." }],
    isAccessibleForFree: false,
    typicalAgeRange: "21+",
    image: djGreenImage,
    imageAlt: "DJ mixing behind laptops under green light with the crowd in the foreground",
    description: "Sold out in nine days.",
  },
  {
    slug: "raw-room-001",
    name: "Raw Room 001",
    startDate: "2026-05-15T23:00:00-04:00",
    endDate: "2026-05-16T04:00:00-04:00",
    location: { status: "tba" },
    city: "Cleveland",
    performer: [{ name: "Vellum" }, { name: "Sub/Urban" }],
    isAccessibleForFree: false,
    typicalAgeRange: "21+",
    image: djSetupImage,
    imageAlt: "DJ working the decks seen from behind, bathed in deep red light",
    description: "Warehouse night, location released twelve hours before doors.",
  },
  {
    // Enero: horario estándar, -05:00.
    slug: "substrata-002",
    name: "Substrata 002",
    startDate: "2026-01-17T23:00:00-05:00",
    endDate: "2026-01-18T04:00:00-05:00",
    location: {
      status: "confirmed",
      name: "Privé",
      streetAddress: "PROVISIONAL — dirección pendiente",
      city: "Columbus",
      region: "OH",
    },
    city: "Columbus",
    performer: [{ name: "Nocta" }, { name: "Grün" }, { name: "Kessler" }],
    isAccessibleForFree: false,
    typicalAgeRange: "21+",
    image: bwPartyGirlImage,
    imageAlt: "Black and white shot of people dancing shoulder to shoulder in a packed club",
    description: "The one that started the series.",
  },
]

// Se ejecuta al importar el módulo: un offset mal escrito rompe el build en
// lugar de llegar a producción con una hora de desfase. Es seguro a nivel de
// módulo porque solo mira los datos, no el instante actual.
assertValidEventOffsets(events)

// Ojo: estas funciones NO se pueden cachear en una constante de módulo. Se
// llaman dentro de cada componente para que el resultado se recalcule en cada
// render, incluido el de la regeneración por `revalidate`.
export function getUpcomingEvents() {
  return selectUpcoming(events)
}

export function getPastEvents() {
  return selectPast(events)
}
