// Modelo de evento y derivaciones. Los campos están mapeados uno a uno sobre
// schema.org/Event para que el JSON-LD del pendiente 4 salga de aquí sin
// rehacer nada.
//
// Este módulo no importa los datos: recibe el array por parámetro. Así
// content/events.ts puede depender de lib/events.ts sin crear un ciclo.

/** Zona de los eventos. Luxdet programa en Ohio. */
export const EVENT_TIME_ZONE = "America/New_York"

/** Duración asumida cuando un evento no declara endDate. */
const DEFAULT_DURATION_HOURS = 8

export type Performer = {
  name: string
  /** Perfil externo: SoundCloud, Instagram… */
  url?: string
  /**
   * Referencia al residente del mismo artista en content/residents.ts, por su
   * `slug`. Opcional porque en cada cartel hay invitados que no están en el
   * roster (Khun Sol, Offlimits, DJ Cale): esos salen solo con su nombre.
   *
   * Se referencia por cadena y no por objeto para que content/events.ts se
   * pueda seguir editando a mano copiando el bloque de plantilla de su
   * cabecera. Lo que evita el fallo silencioso de una referencia mal escrita es
   * `assertResidentRefs` en lib/lineup.ts, que rompe el build.
   *
   * Ojo: no confundir con `LuxdetEvent.slug`, que sí es un segmento de URL.
   */
  residentSlug?: string
}

/**
 * Oferta de entradas. Se modela siempre como `AggregateOffer`: los precios son
 * escalonados (early bird, general, puerta) y se venden en una plataforma
 * externa, así que no existe un precio único que declarar.
 *
 * Por eso el campo se llama `lowPrice` y no `price`: `price` afirmaría que ese
 * importe es el que se cobra, y además no es una propiedad válida de
 * AggregateOffer.
 */
export type Offer = {
  /**
   * Enlace de venta. Opcional a propósito: el precio se suele anunciar antes de
   * que la plataforma de ticketing esté lista, y un CTA sin destino real es un
   * enlace roto.
   */
  url?: string
  /** Tramo más barato disponible. */
  lowPrice?: number
  /** Tope, si se conoce. Muchas veces no, porque la plataforma lo gestiona. */
  highPrice?: number
  priceCurrency?: "USD"
  availability?: "InStock" | "SoldOut" | "PreOrder"
  /**
   * Cuándo abren las ventas, en ISO con offset como startDate. Sirve para los
   * eventos que se anuncian antes de que haya entradas. Si no está, no se
   * emite.
   */
  validFrom?: string
}

/**
 * El venue por confirmar es un estado normal en esta escena, así que es una
 * unión discriminada y no un campo opcional: obliga a maquetar el caso "tba"
 * en lugar de dejar que se cuele un hueco vacío.
 */
export type EventLocation =
  | {
      status: "confirmed"
      name: string
      streetAddress: string
      city: string
      region: string
      postalCode?: string
    }
  | { status: "tba" }

export type LuxdetEvent = {
  slug: string
  /** schema: name */
  name: string
  /**
   * schema: startDate — ISO 8601 CON offset explícito, p. ej.
   * "2026-08-14T23:00:00-04:00". Ohio es -04:00 (EDT) de marzo a noviembre y
   * -05:00 (EST) el resto del año; assertValidEventOffsets lo comprueba en
   * build, así que un offset mal escrito rompe el build.
   */
  startDate: string
  /** schema: endDate — si falta se asume startDate + DEFAULT_DURATION_HOURS */
  endDate?: string
  /** schema: location */
  location: EventLocation
  /** La ciudad se sabe casi siempre, incluso con el venue por confirmar. */
  city: string
  /** schema: performer */
  performer: Performer[]
  /** schema: offers */
  offers?: Offer
  /** schema: isAccessibleForFree */
  isAccessibleForFree: boolean
  /** schema: typicalAgeRange — el campo estándar para la edad mínima ("21+") */
  typicalAgeRange: string
  /** schema: image */
  image?: import("next/image").StaticImageData
  /** Texto alternativo real de la imagen, distinto por evento. */
  imageAlt?: string
  /** schema: description — una línea, para la home y los metadatos */
  description?: string
  /** Cuerpo de la página del evento, en párrafos. */
  longDescription?: string[]
  /** Fotos de la noche, para la página del evento. */
  gallery?: { image: import("next/image").StaticImageData; alt: string }[]
}

// ---------------------------------------------------------------------------
// Validación del offset en build
// ---------------------------------------------------------------------------

const OFFSET_PATTERN = /(?:Z|([+-]\d{2}:\d{2}))$/

/** Offset que la zona tendría realmente en ese instante, p. ej. "-04:00". */
function expectedOffset(iso: string, timeZone = EVENT_TIME_ZONE) {
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "longOffset",
  })
    .formatToParts(new Date(iso))
    .find((part) => part.type === "timeZoneName")?.value

  if (!name) return null
  // "GMT-04:00" → "-04:00"; en UTC exacto devuelve solo "GMT".
  return name.replace("GMT", "") || "+00:00"
}

function writtenOffset(iso: string) {
  const match = OFFSET_PATTERN.exec(iso)
  if (!match) return null
  return match[1] ?? "+00:00"
}

/**
 * Comprueba que el offset escrito a mano coincide con el real de la zona.
 * Un comentario no evita que alguien ponga -04:00 en una fecha de enero: la
 * fiesta saldría con una hora de desfase y nadie se enteraría hasta que
 * alguien llegase tarde. Esto lo convierte en un fallo de build.
 *
 * Opera sobre datos inmutables, así que puede llamarse al cargar el módulo;
 * el filtrado por fecha, que depende del instante actual, no.
 */
export function assertValidEventOffsets(events: readonly LuxdetEvent[]) {
  for (const event of events) {
    // offers.validFrom entra aquí también: lleva offset como las demás y un
    // error ahí anunciaría mal cuándo abren las ventas.
    const dates: [string, string | undefined][] = [
      ["startDate", event.startDate],
      ["endDate", event.endDate],
      ["offers.validFrom", event.offers?.validFrom],
    ]

    for (const [field, iso] of dates) {
      if (!iso) continue

      if (Number.isNaN(new Date(iso).getTime())) {
        throw new Error(`[events] ${event.slug}: ${field} no es una fecha válida ("${iso}")`)
      }

      const written = writtenOffset(iso)
      if (!written) {
        throw new Error(
          `[events] ${event.slug}: ${field} no lleva offset ("${iso}"). ` +
            `Sin offset la hora depende de la zona del servidor. Escribe p. ej. "-04:00".`,
        )
      }

      // Si el offset escrito fuese erróneo el instante se desplaza una hora,
      // lo que solo alteraría este cálculo justo en el salto de DST.
      const expected = expectedOffset(iso)
      if (expected && written !== expected) {
        throw new Error(
          `[events] ${event.slug}: ${field} declara offset ${written} pero ` +
            `${EVENT_TIME_ZONE} está en ${expected} en esa fecha ("${iso}").`,
        )
      }
    }
  }
}

/** Kebab-case ASCII: lo único que produce una URL limpia sin escapar nada. */
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

/**
 * Comprueba que cada slug sirve como segmento de URL y que no hay repetidos.
 *
 * El slug de un evento es una URL permanente: en cuanto alguien la comparte por
 * WhatsApp o queda indexada, cambiarla rompe ese enlace para siempre. Un espacio
 * o una mayúscula darían rutas con %20, y dos eventos con el mismo slug harían
 * que uno tapase al otro sin avisar. Mejor que reviente el build.
 *
 * Como assertValidEventOffsets, solo mira datos inmutables, así que puede
 * llamarse al cargar el módulo.
 */
export function assertValidSlugs(events: readonly LuxdetEvent[]) {
  const seen = new Set<string>()

  for (const event of events) {
    if (!SLUG_PATTERN.test(event.slug)) {
      throw new Error(
        `[events] slug inválido: ${JSON.stringify(event.slug)}. ` +
          `Debe ser kebab-case en minúsculas (p. ej. "the-warehouse-004"): es un segmento de URL.`,
      )
    }

    if (seen.has(event.slug)) {
      throw new Error(
        `[events] slug duplicado: "${event.slug}". Cada evento necesita el suyo o sus páginas se solapan.`,
      )
    }
    seen.add(event.slug)
  }
}

// ---------------------------------------------------------------------------
// Selección y orden
// ---------------------------------------------------------------------------

/** Fin real del evento: el declarado o el inicio + la duración asumida. */
export function resolveEnd(event: LuxdetEvent) {
  if (event.endDate) return new Date(event.endDate).getTime()
  return new Date(event.startDate).getTime() + DEFAULT_DURATION_HOURS * 3600_000
}

const byStartAscending = (a: LuxdetEvent, b: LuxdetEvent) =>
  new Date(a.startDate).getTime() - new Date(b.startDate).getTime()

/**
 * Próximos eventos, el más cercano primero.
 *
 * Se filtra por el FIN, no por el inicio: una fiesta de 23:00 a 06:00 sigue
 * siendo "la próxima" mientras se está celebrando. El orden es explícito
 * porque el array de content/ se edita a mano y su orden no es fiable.
 */
export function selectUpcoming(events: readonly LuxdetEvent[], now = Date.now()) {
  return events.filter((event) => resolveEnd(event) > now).sort(byStartAscending)
}

/** Eventos terminados, el más reciente primero: es lo que espera un archivo. */
export function selectPast(events: readonly LuxdetEvent[], now = Date.now()) {
  return events.filter((event) => resolveEnd(event) <= now).sort((a, b) => byStartAscending(b, a))
}

/**
 * Si el evento ya terminó, con el mismo criterio que selectUpcoming/selectPast.
 *
 * La lectura del reloj vive aquí y no en el componente por la misma razón que
 * en los selectores de arriba: un componente que llama a Date.now() en su
 * cuerpo deja de ser idempotente. En una página con `revalidate` el resultado
 * se recalcula en cada regeneración, que es justo lo que se busca.
 */
export function isPastEvent(event: LuxdetEvent, now = Date.now()) {
  return resolveEnd(event) <= now
}

// ---------------------------------------------------------------------------
// Formateo
// ---------------------------------------------------------------------------
//
// Siempre con timeZone explícita: en Vercel el servidor renderiza en UTC y sin
// ella imprimiría una hora con 4-5 h de desfase respecto a Ohio.
//
// Devuelven texto en capitalización natural; las mayúsculas las pone el CSS
// con text-transform, que además se lee mejor con lector de pantalla.

/** "Friday, Aug 14, 2026" */
export function formatEventDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: EVENT_TIME_ZONE,
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso))
}

/** "11:00 PM" */
export function formatEventTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: EVENT_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso))
}

/** "Aug 14" — versión corta para el ticker */
export function formatEventShortDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: EVENT_TIME_ZONE,
    month: "short",
    day: "numeric",
  }).format(new Date(iso))
}

/** Rango de horas de la noche: "11:00 PM – 4:00 AM" */
export function formatEventTimeRange(event: LuxdetEvent) {
  const start = formatEventTime(event.startDate)
  if (!event.endDate) return start
  return `${start} – ${formatEventTime(event.endDate)}`
}

/** Line-up como texto plano, para metadatos y descripciones. */
export function formatLineup(event: LuxdetEvent) {
  return event.performer.map((performer) => performer.name).join(" · ")
}

/**
 * Precio de entrada tal y como se muestra, o null si no hay nada que enseñar.
 *
 * Nunca un importe a secas: los tramos los gestiona la plataforma de venta, así
 * que enseñar solo el más barato prometería un precio que puede haberse
 * agotado. Con tope conocido se muestra el rango; sin él, "From $X".
 */
export function formatEventPrice(event: LuxdetEvent) {
  if (event.isAccessibleForFree) return "Free entry"

  const { lowPrice, highPrice } = event.offers ?? {}
  if (lowPrice === undefined) return null

  if (highPrice !== undefined) return `$${lowPrice} – $${highPrice}`
  return `From $${lowPrice}`
}

/**
 * Número de edición para el archivo, sacado del sufijo del slug
 * ("substrata-004" → "004"). Sin sufijo numérico cae al año, así que nunca
 * queda vacío.
 */
export function eventEdition(event: LuxdetEvent) {
  const match = /-(\d+)$/.exec(event.slug)
  if (match) return match[1]
  return new Intl.DateTimeFormat("en-US", {
    timeZone: EVENT_TIME_ZONE,
    year: "numeric",
  }).format(new Date(event.startDate))
}

/** Venue si está confirmado; si no, la ciudad, que casi siempre se sabe. */
export function eventVenueLabel(event: LuxdetEvent) {
  return event.location.status === "confirmed" ? event.location.name : event.city
}

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

/** Todas las ciudades del contenido son de Ohio. */
const EVENT_REGION = "OH"
const EVENT_COUNTRY = "US"

/**
 * Mapea un evento a schema.org/Event. Los campos del tipo se eligieron para
 * esto, así que aquí no hay que inventar nada.
 *
 * `siteOrigin` y `url` llegan por parámetro para no acoplar lib/ a content/.
 */
export function eventToJsonLd(event: LuxdetEvent, { url, siteOrigin }: { url: string; siteOrigin: string }) {
  const place =
    event.location.status === "confirmed"
      ? {
          "@type": "Place",
          name: event.location.name,
          address: {
            "@type": "PostalAddress",
            streetAddress: event.location.streetAddress,
            addressLocality: event.location.city,
            addressRegion: event.location.region,
            ...(event.location.postalCode ? { postalCode: event.location.postalCode } : {}),
            addressCountry: EVENT_COUNTRY,
          },
        }
      : {
          // Google exige `location` aunque el sitio esté por confirmar; sin él
          // el evento no es válido. La ciudad sí la sabemos.
          "@type": "Place",
          name: "To be announced",
          address: {
            "@type": "PostalAddress",
            addressLocality: event.city,
            addressRegion: EVENT_REGION,
            addressCountry: EVENT_COUNTRY,
          },
        }

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    startDate: event.startDate,
    ...(event.endDate ? { endDate: event.endDate } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url,
    location: place,
    performer: event.performer.map((performer) => ({
      "@type": "Person",
      name: performer.name,
      ...(performer.url ? { url: performer.url } : {}),
    })),
    organizer: {
      "@type": "Organization",
      name: "Luxdet Culture",
      url: siteOrigin,
    },
    isAccessibleForFree: event.isAccessibleForFree,
    typicalAgeRange: event.typicalAgeRange,
    ...(event.description ? { description: event.description } : {}),
    ...(event.image ? { image: [`${siteOrigin}${event.image.src}`] } : {}),
    ...(event.offers
      ? {
          offers: {
            // Siempre AggregateOffer: precios escalonados y venta en plataforma
            // externa. Sus propiedades de precio son lowPrice/highPrice, nunca
            // `price`, que pertenece a Offer.
            "@type": "AggregateOffer",
            // Google pide url en la oferta. Sin enlace de venta todavía, la
            // propia página del evento es donde se informa del precio.
            url: event.offers.url ?? url,
            ...(event.offers.lowPrice !== undefined
              ? { lowPrice: event.offers.lowPrice }
              : {}),
            ...(event.offers.highPrice !== undefined
              ? { highPrice: event.offers.highPrice }
              : {}),
            priceCurrency: event.offers.priceCurrency ?? "USD",
            ...(event.offers.availability
              ? { availability: `https://schema.org/${event.offers.availability}` }
              : {}),
            ...(event.offers.validFrom ? { validFrom: event.offers.validFrom } : {}),
          },
        }
      : {}),
  }
}

/**
 * Serializa para meterlo en un <script type="application/ld+json">.
 *
 * Escapar "<" es lo que impide que un dato de contenido pueda cerrar la
 * etiqueta e inyectar markup: "</script>" dentro de un string se convierte en
 * "</script>", que el parser de JSON entiende igual y el de HTML ya no.
 */
export function toJsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

/** Organization de Luxdet, para la home. */
export function organizationJsonLd({ siteOrigin, name }: { siteOrigin: string; name: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: siteOrigin,
    description: "Electronic music event production in Ohio.",
    address: {
      "@type": "PostalAddress",
      addressRegion: EVENT_REGION,
      addressCountry: EVENT_COUNTRY,
    },
  }
}
