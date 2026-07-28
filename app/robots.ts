import type { MetadataRoute } from "next"
import { siteUrl } from "@/content/site"

/**
 * Rastreadores de RECUPERACIÓN: buscan y citan la web en respuestas en tiempo
 * real, así que interesa que entren. Se listan de forma explícita para que un
 * endurecimiento futuro del `*` no los deje fuera sin querer.
 *
 * Distintos de los de ENTRENAMIENTO (GPTBot, ClaudeBot, Google-Extended,
 * Applebot-Extended), que alimentan modelos y son una decisión aparte: hoy
 * quedan permitidos por el `*` de abajo. Verificados en julio de 2026; estos
 * nombres cambian, conviene revisarlos de vez en cuando.
 */
const RETRIEVAL_BOTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-User",
  "Claude-SearchBot",
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...RETRIEVAL_BOTS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
