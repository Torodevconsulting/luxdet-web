import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { events } from "@/content/events"
import { eventUrl, siteName, siteUrl } from "@/content/site"
import {
  eventToJsonLd,
  eventVenueLabel,
  formatEventDate,
  formatEventTimeRange,
  formatLineup,
  isPastEvent,
  toJsonLdScript,
} from "@/lib/events"

// Un evento pasado deja de ofrecer entradas, así que el estado se recalcula en
// cada regeneración. Sin esto la página quedaría congelada en el build y
// seguiría vendiendo una fiesta que ya ocurrió. Una hora basta: el cambio de
// estado ocurre de madrugada, al terminar la noche.
export const revalidate = 3600

// Slug que no esté en el contenido devuelve 404 en vez de intentar renderizarse.
export const dynamicParams = false

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }))
}

function findEvent(slug: string) {
  return events.find((event) => event.slug === slug)
}

// `params` es una promesa desde Next 15: hay que esperarla.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const event = findEvent(slug)

  if (!event) return {}

  const url = eventUrl(event.slug)
  const description =
    event.description ?? `${formatEventDate(event.startDate)} · ${event.city} · ${formatLineup(event)}`

  return {
    title: event.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${event.name} — ${siteName}`,
      description,
      ...(event.image ? { images: [{ url: event.image.src, alt: event.imageAlt ?? event.name }] } : {}),
    },
  }
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = findEvent(slug)

  if (!event) notFound()

  // Mismo criterio que getUpcomingEvents: manda el fin, no el inicio, para que
  // una fiesta de 23:00 a 04:00 no se archive mientras se está celebrando.
  const isPast = isPastEvent(event)
  const { location } = event

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: toJsonLdScript(eventToJsonLd(event, { url: eventUrl(event.slug), siteOrigin: siteUrl })),
        }}
      />

      <article className="event-page">
        <div className="container">
          <p className="section-kicker">{isPast ? "Archive" : "Next"}</p>
          <h1 className="event-title">{event.name}</h1>

          <p className="event-when">
            <time dateTime={event.startDate}>{formatEventDate(event.startDate)}</time>
            <span className="event-hours">{formatEventTimeRange(event)}</span>
          </p>

          <dl className="event-meta">
            <div className="event-meta-row">
              <dt>Venue</dt>
              <dd>
                {location.status === "confirmed" ? (
                  <>
                    <span className="event-value">{location.name}</span>
                    <span className="event-detail">
                      {`${location.streetAddress}, ${location.city}, ${location.region}`}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="location-tba">{isPast ? eventVenueLabel(event) : "Location TBA"}</span>
                    <span className="event-detail">
                      {isPast ? "Venue not published" : `${event.city} · address released before doors`}
                    </span>
                  </>
                )}
              </dd>
            </div>

            <div className="event-meta-row">
              <dt>Line-up</dt>
              <dd>
                <ul className="event-lineup">
                  {event.performer.map((performer) => (
                    <li key={performer.name}>{performer.name}</li>
                  ))}
                </ul>
              </dd>
            </div>

            <div className="event-meta-row">
              <dt>Age</dt>
              <dd>
                <span className="event-value">{event.typicalAgeRange}</span>
              </dd>
            </div>
          </dl>

          {/* Un evento pasado no vende entradas. */}
          {!isPast && (
            <div className="event-actions">
              {event.offers?.url ? (
                <a className="cta-button" href={event.offers.url}>
                  {event.offers.availability === "SoldOut" ? "Sold out" : "Get tickets"}
                </a>
              ) : (
                <p className="event-note">Tickets announced soon</p>
              )}

              {event.isAccessibleForFree ? (
                <span className="event-price">Free entry</span>
              ) : (
                event.offers?.price !== undefined && (
                  <span className="event-price">{`$${event.offers.price}`}</span>
                )
              )}
            </div>
          )}

          {event.image && (
            <div className="event-media">
              <Image
                src={event.image}
                alt={event.imageAlt ?? ""}
                className="event-image"
                sizes="(max-width: 767px) 100vw, 900px"
                priority
              />
            </div>
          )}

          {/* PROVISIONAL: falta `longDescription` en content/events.ts, así que
              de momento se muestra la línea corta. */}
          {event.longDescription ? (
            <div className="event-body">
              {event.longDescription.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : (
            event.description && (
              <div className="event-body">
                <p>{event.description}</p>
              </div>
            )
          )}

          {isPast && event.gallery && event.gallery.length > 0 && (
            <div className="event-gallery">
              {event.gallery.map((photo) => (
                <Image
                  key={photo.image.src}
                  src={photo.image}
                  alt={photo.alt}
                  className="event-gallery-image"
                  sizes="(max-width: 767px) 100vw, 450px"
                />
              ))}
            </div>
          )}

          <Link className="event-back" href="/#archive">
            Back to all events
          </Link>
        </div>
      </article>
    </main>
  )
}
