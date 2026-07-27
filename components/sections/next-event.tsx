import Image from "next/image"
import { getUpcomingEvents } from "@/content/events"
import { mailingListHref } from "@/content/site"
import { formatEventDate, formatEventTimeRange } from "@/lib/events"

export function NextEvent() {
  // Dentro del componente a propósito: en una constante de módulo se evaluaría
  // una sola vez y `revalidate` no cambiaría nunca de evento.
  const [event] = getUpcomingEvents()

  // Entre temporadas no hay fechas. La sección no desaparece: es justo cuando
  // más interesa captar contactos.
  if (!event) {
    return (
      <section id="next" className="next-event">
        <div className="container">
          <p className="section-kicker">Up Next</p>
          <p className="next-title">No dates announced</p>
          <p className="next-empty-copy">
            We are between rooms right now. Get on the list and you will know the date before it
            goes public.
          </p>
          <a className="cta-button" href={mailingListHref}>
            Get on the list
          </a>
        </div>
      </section>
    )
  }

  const { location } = event

  return (
    <section id="next" className="next-event">
      <div className="container">
        <p className="section-kicker">Next</p>

        <div className="next-layout">
          <div className="next-main">
            <h2 className="next-title">{event.name}</h2>

            <p className="next-when">
              <time dateTime={event.startDate}>{formatEventDate(event.startDate)}</time>
              <span className="next-hours">{formatEventTimeRange(event)}</span>
            </p>

            <dl className="next-meta">
              <div className="next-meta-row">
                <dt>Venue</dt>
                <dd>
                  {location.status === "confirmed" ? (
                    <>
                      <span className="next-venue">{location.name}</span>
                      <span className="next-detail">
                        {`${location.streetAddress}, ${location.city}, ${location.region}`}
                      </span>
                    </>
                  ) : (
                    <>
                      {/* Venue por confirmar: estado maquetado, no un hueco vacío */}
                      <span className="location-tba">Location TBA</span>
                      <span className="next-detail">
                        {`${event.city} · address released before doors`}
                      </span>
                    </>
                  )}
                </dd>
              </div>

              <div className="next-meta-row">
                <dt>Line-up</dt>
                <dd>
                  <ul className="next-lineup">
                    {event.performer.map((performer) => (
                      <li key={performer.name}>
                        {performer.url ? (
                          <a href={performer.url} target="_blank" rel="noopener noreferrer">
                            {performer.name}
                          </a>
                        ) : (
                          performer.name
                        )}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>

              <div className="next-meta-row">
                <dt>Age</dt>
                <dd>
                  <span className="next-venue">{event.typicalAgeRange}</span>
                </dd>
              </div>
            </dl>

            <div className="next-actions">
              {/* Sin URL de venta no se renderiza el CTA: un enlace a un ancla
                  inexistente no lleva a ninguna parte. */}
              {event.offers?.url ? (
                <a className="cta-button" href={event.offers.url}>
                  {event.offers.availability === "SoldOut" ? "Sold out" : "Get tickets"}
                </a>
              ) : (
                <p className="next-note">Tickets announced soon</p>
              )}

              {event.isAccessibleForFree ? (
                <span className="next-price">Free entry</span>
              ) : (
                event.offers?.price !== undefined && (
                  <span className="next-price">{`$${event.offers.price}`}</span>
                )
              )}
            </div>
          </div>

          {event.image && (
            <div className="next-media">
              <Image
                src={event.image}
                alt={event.imageAlt ?? ""}
                className="next-image"
                sizes="(max-width: 767px) 100vw, 40vw"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
