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

/**
 * La indexación está CERRADA salvo que se abra explícitamente. Mientras el
 * contenido sea provisional (nombres de fiesta, precios y direcciones
 * inventados) no interesa que se indexe ni que alimente a un sistema de
 * recuperación como si fuera información real sobre Luxdet.
 *
 * Para abrir: NEXT_PUBLIC_ALLOW_INDEXING=true en Vercel + redeploy (el
 * prefijo NEXT_PUBLIC_ se incrusta en build, no se lee en runtime).
 */
const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true"

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    return { rules: [{ userAgent: "*", disallow: "/" }] }
  }

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...RETRIEVAL_BOTS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}