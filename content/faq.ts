// ============================================================================
// PREGUNTAS FRECUENTES
//
// ⚠️  PENDIENTE DE REVISIÓN LEGAL. El bloque de reembolsos y el de safer space
//     son declaraciones públicas con consecuencias. Antes de considerarlos
//     definitivos deberían pasar por un abogado con licencia en Ohio.
//
// ⚠️  Buscar "TODO:" antes de publicar.
//
// Este contenido absorbe lo que iba a ser la sección THE RULES: mismo fondo,
// formato pregunta-respuesta, que es el que entienden los buscadores y los
// sistemas de recuperación.
//
// ⚠️  Sobre el JSON-LD que emite lib/faq.ts: Google restringió los rich results
//     de FAQPage a sitios gubernamentales y sanitarios (agosto de 2023), así que
//     esto NO va a salir desplegado en los resultados de búsqueda. Se emite
//     porque los sistemas de recuperación —ChatGPT, Perplexity, Claude— sí lo
//     leen y lo citan, y ese es todo el valor que se le pide.
// ============================================================================

export type FaqItem = {
  question: string
  answer: string[]
}

/** Encabezado de la sección. Aquí y no en el JSX, como el resto del contenido. */
export const faqHeading = "Frequently asked"

export const faq: FaqItem[] = [
  {
    question: "What is Luxdet Culture?",
    answer: [
      "Luxdet Culture is an electronic music event producer based in Columbus, Ohio. We program house, minimal and tech house across formats — from Sunday brunch parties to warehouse afterhours.",
    ],
  },
  {
    question: "How old do I have to be?",
    answer: [
      "Most of our events are 21+. Some are 18+, and daytime events are often all ages. The age requirement is listed on every event page — check it before you buy, and bring valid ID.",
    ],
  },
  {
    question: "Where do I buy tickets?",
    answer: [
      // TODO: confirmar si siempre es Posh o varía según el evento.
      "Through the ticket link on each event page. Tickets are sold by third-party platforms; we don't process payments on this site.",
    ],
  },
  {
    question: 'Why does an event say "location TBA"?',
    answer: [
      "Some of our events don't announce the venue until closer to the date. The city is always listed, and the full address goes out to ticket holders by email 48 hours before doors. Keep an eye on the inbox you used to buy.",
    ],
  },
  {
    question: "Can I get a refund?",
    answer: [
      // TODO: verificar contra los términos de organizador de Posh. Que la
      // venta pase por un tercero no traslada automáticamente la
      // responsabilidad: depende de quién sea el comerciante de registro.
      "Tickets are sold and processed by third-party platforms, so refund requests go through the platform you bought from, under their refund policy. We can't issue refunds directly.",
      // TODO: este párrafo es un compromiso. Confirmar que es cumplible.
      "If we cancel an event, ticket holders will be contacted by email and refunds will be handled through the platform. If an event is rescheduled, your ticket stays valid for the new date.",
    ],
  },
  {
    question: "Can I bring my phone?",
    answer: [
      "Yes. Phones and photos are fine at our events unless a specific event says otherwise — some nights have their own policy, and we'll say so on the event page.",
    ],
  },
  {
    question: "What's your door policy?",
    answer: [
      "Valid ID at the door, always. Dress code depends on the venue and will be listed when it applies. Firearms, knives and any other weapon are not permitted at our events, and our security enforces that.",
    ],
  },
  {
    question: "Is Luxdet a safe space?",
    answer: [
      // TODO: revisión legal. Redactado como compromiso de conducta, no como
      // garantía de resultado, a propósito.
      "That's the standard we hold ourselves to. Harassment, aggression and predatory behaviour get you removed — no warnings, no discussion. If someone is making you uncomfortable, find a member of staff or security and we'll deal with it.",
      "We work with venue security at every event, and we'd rather lose a ticket sale than let the room turn.",
    ],
  },
  {
    question: "Can I book Luxdet for my venue or event?",
    answer: [
      'Yes. Use the contact form and select "Venue rental" or "Partnership". We reply within two business days.',
    ],
  },
  {
    question: "How do I get booked to play?",
    answer: [
      'Send us a link to your mixes through the contact form, selecting "DJ booking". We listen to everything, but we only book what fits the room.',
    ],
  },
]

