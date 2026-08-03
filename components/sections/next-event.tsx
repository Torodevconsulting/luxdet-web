import Image from "next/image"
import Link from "next/link"
import { getUpcomingEvents } from "@/content/events"
import { contactFormHref } from "@/content/site"
import { formatEventDate, formatEventShortDate, formatEventTimeRange } from "@/lib/events"

export function NextEvent() {
  // Dentro del componente a propósito: en una constante de módulo se evaluaría
  // una sola vez y `revalidate` no cambiaría nunca de evento.
  //
  // selectUpcoming() ya devuelve el orden ascendente por startDate, así que el
  // primero es el más cercano y `rest` sale ordenado sin tocar nada.
  const [event, ...rest] = getUpcomingEvents()

  // Entre temporadas no hay fechas. La sección no desaparece: es justo cuando
  // más interesa captar contactos.
  if (!event) {
    return (
      <section id="next" className="next-event">
        <div className="container">
          <p className="section-kicker">Up Next</p>
          <p className="next-title">No dates announced</p>
          <p className="next-empty-copy">
            We are between rooms right now. Get in touch and you will know the date before it
            goes public.
          </p>
          <a className="cta-button" href={contactFormHref}>
            Get in touch
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
            <h2 className="next-title">
              <Link className="next-title-link" href={`/events/${event.slug}`}>
                {event.name}
              </Link>
            </h2>

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
                // Si la entrada es libre no hay ninguna venta pendiente de
                // anunciar: la nota contradiría al "Free entry" de al lado.
                !event.isAccessibleForFree && <p className="next-note">Tickets announced soon</p>
              )}

              {event.isAccessibleForFree ? (
                <span className="next-price">Free entry</span>
              ) : (
                event.offers?.price !== undefined && (
                  <span className="next-price">{`$${event.offers.price}`}</span>
                )
              )}

              <Link className="next-detail-link" href={`/events/${event.slug}`}>
                Full details
              </Link>
            </div>
          </div>

          {event.image && (
            <div className="next-media">
              {/* El aria-label da el nombre accesible del enlace: el alt de la
                  imagen describe el flyer, no a dónde lleva pulsarlo. */}
              <Link
                className="next-media-link"
                href={`/events/${event.slug}`}
                aria-label={`${event.name} — full details`}
              >
                <Image
                  src={event.image}
                  alt={event.imageAlt ?? ""}
                  className="next-image"
                  /* La columna es de ancho fijo, así que el sizes deja de ser
                     relativo al viewport y pasa a declarar esos píxeles. */
                  sizes="(max-width: 767px) 100vw, (max-width: 1024px) 300px, 400px"
                />
              </Link>
            </div>
          )}
        </div>

        {/* Índice del resto de fechas. Con un solo evento futuro no se
            renderiza nada — ni el encabezado, que se quedaría suelto sobre una
            lista vacía.

            La fila no es un único enlace envolvente: lleva dos destinos (la
            página del evento y la venta de entradas) y un <a> dentro de otro
            <a> es HTML inválido. */}
        {rest.length > 0 && (
          <div className="next-more">
            <h3 className="next-more-heading">Also coming</h3>
            <ul>
              {rest.map((upcoming) => (
                <li className="next-more-row" key={upcoming.slug}>
                  <Link className="next-more-link" href={`/events/${upcoming.slug}`}>
                    <span className="next-more-date">
                      <time dateTime={upcoming.startDate}>
                        {formatEventShortDate(upcoming.startDate)}
                      </time>
                    </span>
                    <span className="next-more-city">{upcoming.city}</span>
                    <span className="next-more-name">{upcoming.name}</span>
                    {upcoming.image && (
                      // Decorativa: el nombre de la fiesta ya está en el enlace
                      <Image
                        src={upcoming.image}
                        alt=""
                        className="next-more-thumb"
                        sizes="80px"
                      />
                    )}
                  </Link>

                  {upcoming.offers?.url && (
                    <a
                      className="next-more-cta"
                      href={upcoming.offers.url}
                      // Varios "Get tickets" en la misma lista son
                      // indistinguibles fuera de contexto: el lector de
                      // pantalla necesita saber de qué fiesta.
                      aria-label={`Get tickets for ${upcoming.name}`}
                    >
                      {upcoming.offers.availability === "SoldOut" ? "Sold out" : "Get tickets"}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
