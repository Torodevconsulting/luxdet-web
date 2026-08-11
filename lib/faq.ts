// JSON-LD del FAQ. Aparte de lib/events.ts porque no tiene nada que ver con el
// modelo de evento; reutiliza su serializador, que es genérico.

import type { FaqItem } from "@/content/faq"

/**
 * FAQPage de schema.org con todas las preguntas.
 *
 * OJO CON LAS EXPECTATIVAS: esto NO va a producir un desplegable en los
 * resultados de Google. En agosto de 2023 Google limitó los rich results de
 * FAQPage a webs gubernamentales y sanitarias, y una productora de eventos no
 * entra. Quien vea este marcado y espere ver el acordeón en la SERP se va a
 * llevar un chasco, y no es que esté mal implementado.
 *
 * Se emite porque el valor está en otro sitio: los rastreadores de recuperación
 * que ya se permiten expresamente en app/robots.ts —OAI-SearchBot, PerplexityBot,
 * Claude-SearchBot y compañía— leen este bloque y citan las respuestas cuando
 * alguien les pregunta por la edad mínima o por dónde comprar entradas. Eso es
 * lo que se busca; el rich result no.
 *
 * El texto de la respuesta va como un único string porque `acceptedAnswer.text`
 * es un campo plano: los párrafos se unen con doble salto de línea para no
 * pegar la última frase de uno con la primera del siguiente.
 */
export function faqPageJsonLd(items: readonly FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer.join("\n\n"),
      },
    })),
  }
}
