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
}

export type Offer = {
  /**
   * Enlace de venta. Opcional a propósito: el precio se suele anunciar antes de
   * que la plataforma de ticketing esté lista, y un CTA sin destino real es un
   * enlace roto.
   */
  url?: string
  price?: number
  priceCurrency?: "USD"
  availability?: "InStock" | "SoldOut" | "PreOrder"
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
  /** schema: description */
  description?: string
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
    for (const field of ["startDate", "endDate"] as const) {
      const iso = event[field]
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
