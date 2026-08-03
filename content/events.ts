// ============================================================================
// EVENTOS
//
// Guía completa para añadir uno: docs/como-crear-un-evento.md
//
// Resumen:
//   - startDate/endDate llevan offset explícito: -04:00 (EDT, marzo–octubre)
//     o -05:00 (EST, noviembre–febrero). Si te equivocas, el build falla.
//   - Las fiestas cruzan medianoche: endDate cae el día siguiente.
//   - city se rellena siempre, aunque el venue esté por confirmar.
//   - slug en kebab-case, único, y NO se cambia una vez publicado: es la URL.
// ============================================================================

import {
  assertValidEventOffsets,
  assertValidSlugs,
  selectPast,
  selectUpcoming,
  type LuxdetEvent,
} from "@/lib/events"
import latinNightImage from "@/public/latin_night.jpeg"
import brunchPartyImage from "@/public/brunchparty.jpg"

// Plantilla de referencia. Copia este bloque, descoméntalo y rellénalo.
// La imagen se importa arriba: import fooImage from "@/public/foo.jpg"
//
// {
//   slug: "the-warehouse-005",
//   name: "The Warehouse 005",
//   startDate: "2026-09-12T23:00:00-04:00",
//   endDate: "2026-09-13T04:00:00-04:00",
//   location: {
//     status: "confirmed",
//     name: "Privé",
//     streetAddress: "412 W Town St",
//     city: "Columbus",
//     region: "OH",
//   },
//   // ...o bien, si el venue no está confirmado:
//   // location: { status: "tba" },
//   city: "Columbus",
//   performer: [{ name: "Nocta" }, { name: "Grün" }],
//   offers: {
//     url: "https://dice.fm/event/...",   // omitir si aún no hay venta
//     price: 20,                          // número, sin comillas
//     priceCurrency: "USD",
//     availability: "InStock",            // o "PreOrder"
//   },
//   isAccessibleForFree: false,
//   typicalAgeRange: "21+",
//   image: fooImage,
//   imageAlt: "Descripción real de la foto, en inglés, distinta en cada evento",
//   description: "Una o dos frases. Es lo que sale en el preview de WhatsApp.",
// },

export const events: LuxdetEvent[] = [
  {
    // La fecha del flyer ("08.09") es ambigua; confirmada como 9 de agosto,
    // que además cae en domingo.
    slug: "brunch-party-arepa-passport",
    name: "Brunch Party",
    startDate: "2026-08-09T11:00:00-04:00",
    endDate: "2026-08-09T15:00:00-04:00",
    location: {
      status: "confirmed",
      name: "Cilantro Arepas & Tapas X Bodega Kitchen + Craft Beer",
      streetAddress: "1044 N High St",
      city: "Columbus",
      region: "OH",
      postalCode: "43201",
    },
    city: "Columbus",
    performer: [{ name: "Bejaguz" }],
    // Sin `offers`: no hay entrada que vender, la entrada es libre.
    isAccessibleForFree: true,
    typicalAgeRange: "18+",
    image: brunchPartyImage,
    imageAlt:
      "Brunch Party flyer: a black takeaway box with the event name in green, next to the Arepa Passport booklet",
    description: "The official launch of The Arepa Passport.",
  },
  {
    slug: "festival-latino-afters-2026",
    name: "The Official Festival Latino Afters: Latin Night x Tech House",
    startDate: "2026-08-22T21:00:00-04:00",
    endDate: "2026-08-23T02:30:00-04:00",
    // PENDIENTE: falta la dirección postal de The Cave Bar & Lounge.
    // El evento usa dos venues (The Cave + Bodi Complex) con un solo ticket,
    // pero schema.org/Event solo admite una location: The Cave es la sede
    // principal y Bodi se menciona en longDescription.
    location: {
      status: "confirmed",
      name: "The Cave Bar & Lounge",
      streetAddress: "Lower Level, 122 E Main St",
      city: "Columbus",
      region: "OH",
      postalCode: "43215",
    },
    city: "Columbus",
    performer: [
      { name: "Tweety" },
      { name: "Bejaguz" },
      { name: "Venee" },
      { name: "DJ Cale" },
    ],
    offers: {
      url: "https://posh.vip/e/the-official-festival-latino-afters-latin-night-x-tech-house?u=luxdetpro",
      // El más bajo de los tramos de Posh: se muestra como "Prices from" y en
      // el JSON-LD sale como AggregateOffer/lowPrice.
      price: 11.99,
      priceFrom: true,
      priceCurrency: "USD",
      availability: "InStock",
    },
    isAccessibleForFree: false,
    typicalAgeRange: "21+",
    image: latinNightImage,
    imageAlt:
      "Festival Latino Afters flyer: Latin Night x Tech House at The Cave and Bodi Complex",
    description:
      "Festival Latino doesn't stop when the sun goes down. Two venues, one ticket.",
    longDescription: [
      "The Cave and Bodi Complex come together for the official afterparty, bringing two different sounds across two venues with one ticket.",
      "Tweety, Bejaguz, Venee, and DJ Cale take control with Latin rhythms, tech house, and nonstop energy built to carry the celebration late into the night.",
    ],
  },
]

// Se ejecutan al importar el módulo: un offset mal escrito rompe el build en
// lugar de llegar a producción con una hora de desfase, y un slug inválido o
// repetido lo rompe antes de que esa URL llegue a existir. Es seguro a nivel de
// módulo porque solo miran los datos, no el instante actual.
assertValidEventOffsets(events)
assertValidSlugs(events)

// Ojo: estas funciones NO se pueden cachear en una constante de módulo. Se
// llaman dentro de cada componente para que el resultado se recalcule en cada
// render, incluido el de la regeneración por `revalidate`.
export function getUpcomingEvents() {
  return selectUpcoming(events)
}

export function getPastEvents() {
  return selectPast(events)
}