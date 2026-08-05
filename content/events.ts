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
import dropCulture from "@/public/dropcultureparty.jpeg"

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
    slug: "drop-culture-vol-ii",
    name: "Drop Culture Vol. II",
    startDate: "2026-07-25T21:00:00-04:00",
    endDate: "2026-07-26T03:00:00-04:00",
    location: {
      status: "confirmed",
      name: "The Cave",
      streetAddress: "46 E Long St",
      city: "Columbus",
      region: "OH",
      postalCode: "43215",
    },
    city: "Columbus",
    performer: [
      { name: "Venee" },
      { name: "Bejaguz" },
      { name: "Khun Sol" },
      { name: "Shoon" },
    ],
    isAccessibleForFree: false,
    typicalAgeRange: "21+",
    image: dropCulture,
    imageAlt:
      "Drop Culture Vol. II flyer: figure in a Luxdet tee facing a psychedelic Columbus skyline",
    description:
      "Four DJs, six hours of tech house at The Cave. The second volume of Drop Culture.",
    longDescription: [
      "Drop Culture returned to The Cave for its second volume, and the room answered. Venee, Bejaguz, Khun Sol and Shoon took turns building something that never let up — hypnotic, rolling tech house that kept the floor moving from the first hour to the last.",
      "The night was built on more than a good lineup. Luxdet Culture and The Cave programmed it as a conversation with the crowd: introducing sounds people hadn't heard yet, pushing the direction the scene is moving in, and making room for the tracks that built electronic music in the first place.",
      "That's the work. Not just booking a good night, but adding something to the culture that gave us all of this.",
    ],
  },
  {
    slug: "brunch-party-arepa-passport",
    name: "Brunch Party: The Arepa Passport Launch",
    startDate: "2026-08-09T11:00:00-04:00",
    endDate: "2026-08-09T15:00:00-04:00",
    location: {
      status: "confirmed",
      name: "Cilantro Latin Fusion",
      streetAddress: "1044 N High St",
      city: "Columbus",
      region: "OH",
      postalCode: "43201",
    },
    city: "Columbus",
    performer: [{ name: "Bejaguz" }],
    isAccessibleForFree: true,
    typicalAgeRange: "all ages",
    image: brunchPartyImage,
    imageAlt:
      "Brunch Party flyer: black Smiley Box on a cream background announcing the Arepa Passport launch",
    description:
      "Free daytime brunch party with DJ Bejaguz. Only 100 Arepa Passports available.",
    longDescription: [
      "Not every Luxdet night happens at night. Cilantro Latin Fusion and Bodega open the doors at 11am on Sunday for a daytime party built around food, and Bejaguz takes the booth for four hours of house and Latin rhythms while the kitchen works.",
      "The occasion is the official launch of the Arepa Passport: twelve arepas, a sticker for each one, and a route through the Cilantro Republic of Latin Flavor that ends with you as a citizen. Only 100 passports exist for the launch.",
      "Free entry, all ages. Doors at 11am, last track at 3pm.",
    ],
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
      // El más bajo de los tramos de Posh. No hay `highPrice` porque el tope lo
      // gestiona la plataforma y no lo conocemos.
      lowPrice: 11.99,
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