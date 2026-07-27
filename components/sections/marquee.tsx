import { getUpcomingEvents } from "@/content/events"
import { formatEventShortDate } from "@/lib/events"

// La animación .marquee-inner desplaza -50% con el contenido duplicado, así que
// una copia tiene que llenar al menos el ancho del viewport o se ven huecos.
// En .huge-type cada entrada ya mide varias pantallas, así que tres bastan:
// más entradas solo alargan el recorrido y aceleran el desplazamiento aparente
// para una misma duración.
const MIN_ENTRIES_PER_RUN = 3

export function Marquee() {
  // Dentro del componente, para que se recalcule en cada regeneración.
  const upcoming = getUpcomingEvents()

  const dates = upcoming.map((event) => ({
    key: event.slug,
    label: `${formatEventShortDate(event.startDate)} · ${event.city}`,
  }))

  // Sin fechas anunciadas el ticker no se queda vacío.
  const entries =
    dates.length > 0 ? dates.map((date) => date.label) : ["Luxdet", "Culture", "Music", "Dance"]

  const run: string[] = []
  while (run.length < MIN_ENTRIES_PER_RUN) {
    run.push(...entries)
  }
  const text = `${run.join(" — ")} — `

  return (
    <div className="scrolling-marquee">
      {/* El ticker es refuerzo visual: se repite dos veces para el bucle y está
          en movimiento continuo, así que se oculta a la tecnología asistiva. */}
      <div className="marquee-inner" aria-hidden="true">
        <span className="huge-type outline-text">{text}</span>
        <span className="huge-type outline-text">{text}</span>
      </div>

      {/* Las fechas son información real, no decoración: van también en una
          lista estática accesible, que se lee una sola vez y no se mueve. */}
      {dates.length > 0 && (
        <ul className="sr-only">
          {dates.map((date) => (
            <li key={date.key}>{date.label}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
