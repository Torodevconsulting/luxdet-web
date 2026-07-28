import type { MetadataRoute } from "next"
import { events } from "@/content/events"
import { eventUrl, siteUrl } from "@/content/site"
import { resolveEnd } from "@/lib/events"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = Date.now()

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    // Las páginas de eventos pasados no se retiran nunca: son el archivo de la
    // productora y lo que acumula autoridad. Solo baja su prioridad y su
    // frecuencia de cambio, porque su contenido ya no se mueve.
    ...events.map((event) => {
      const isPast = resolveEnd(event) <= now
      return {
        url: eventUrl(event.slug),
        lastModified: new Date(event.startDate),
        changeFrequency: isPast ? ("yearly" as const) : ("weekly" as const),
        priority: isPast ? 0.5 : 0.8,
      }
    }),
  ]
}
