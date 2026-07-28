import Image from "next/image"
import Link from "next/link"
import { getPastEvents } from "@/content/events"
import {
  eventEdition,
  eventVenueLabel,
  formatEventDate,
  formatLineup,
  type LuxdetEvent,
} from "@/lib/events"

// Mismo markup y mismas clases estructurales que la antigua sección work
// (.project-row, .project-info, .project-media, .project-image,
// .floating-label): cambia de dónde salen los datos y qué significan.
// Los estilos en línea que traía work.tsx pasan aquí a clases, según la regla
// de no añadir style={{}} nuevos (pendiente 8: quitar 'unsafe-inline').
function ArchiveRow({ event, reversed }: { event: LuxdetEvent; reversed: boolean }) {
  return (
    <div className={reversed ? "project-row project-row--reversed" : "project-row"}>
      <div className="project-info">
        <span className="archive-kicker">{`${eventEdition(event)} / ${eventVenueLabel(event)}`}</span>
        <h3 className="archive-title">
          <Link className="archive-link" href={`/events/${event.slug}`}>
            {event.name}
          </Link>
        </h3>
        {event.description && <p>{event.description}</p>}
        <div className="divider"></div>
        <p className="archive-meta">
          <time dateTime={event.startDate}>{formatEventDate(event.startDate)}</time>
        </p>
        <p className="archive-lineup">{formatLineup(event)}</p>
      </div>
      <div className="project-media">
        {event.image && (
          <Image
            src={event.image}
            alt={event.imageAlt ?? ""}
            className="project-image"
            sizes="(max-width: 767px) 100vw, (max-width: 1024px) 60vw, 800px"
          />
        )}
        <div
          className={
            reversed
              ? "floating-label huge-type outline-text floating-label--left"
              : "floating-label huge-type outline-text"
          }
          aria-hidden="true"
        >
          {event.city}
        </div>
      </div>
    </div>
  )
}

export function Archive() {
  // Dentro del componente, para que se recalcule en cada regeneración.
  const past = getPastEvents()

  return (
    <section id="archive" className="container">
      <div className="sticky-type" aria-hidden="true">
        Archive
      </div>

      {past.length === 0 ? (
        <p className="archive-empty">The first night is still ahead of us.</p>
      ) : (
        past.map((event, i) => <ArchiveRow key={event.slug} event={event} reversed={i % 2 === 1} />)
      )}
    </section>
  )
}
