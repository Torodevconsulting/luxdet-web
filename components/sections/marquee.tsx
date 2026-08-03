import { getUpcomingEvents } from "@/content/events"
import { formatEventShortDate } from "@/lib/events"

// La animación .marquee-inner desplaza -50% con el contenido duplicado, así que
// una copia tiene que llenar al menos el ancho del viewport o aparece un hueco
// al girar el bucle.
//
// El mínimo va en caracteres y no en número de entradas porque "Aug 22 ·
// Columbus" y "Nov 14 · Cincinnati" no miden lo mismo, y con una sola fecha
// anunciada la diferencia decide si hay hueco o no.
//
// De dónde sale el 60: el cuerpo del ticker es 7vw y en Syne cada carácter
// avanza ~0.6em, así que una copia mide n × 0.042 viewports. Con 24 caracteres
// ya se cubre una pantalla sea cual sea su ancho —el cuerpo es proporcional—,
// y 60 deja el doble de margen para el mínimo de 2.5rem que fija el clamp en
// móvil.
const MIN_CHARS_PER_RUN = 60

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
  let length = 0
  while (length < MIN_CHARS_PER_RUN) {
    run.push(...entries)
    length = run.join(" — ").length
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
