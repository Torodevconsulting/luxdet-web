import { hero } from "@/content/hero"

// Seis columnas para dibujar la rejilla. Van dentro de un .container para que
// las líneas caigan donde caen los márgenes del resto de secciones, en lugar de
// ser un patrón superpuesto que no coincide con nada.
const GRID_COLUMNS = 6

export function Hero() {
  return (
    <section id="hero">
      {/* Decorativa: no transporta información. El wrapper va aparte de
          .hero-grid porque es este el que se desplaza con el scroll, y las
          reglas horizontales deben quedarse ancladas al layout. */}
      <div className="hero-grid-wrap" aria-hidden="true">
        <div className="container">
          <div className="hero-grid">
            {Array.from({ length: GRID_COLUMNS }, (_, i) => (
              <span key={i} />
            ))}
          </div>
        </div>
      </div>

      <h1 className="hero-title-container">
        <span className="huge-type hero-title parallax-text" data-speed="-2">
          {/* Los tramos se apilan en móvil (LUX / DET), ver globals.css */}
          <span className="hero-title-part">LUX</span>
          <span className="hero-title-part">DET</span>
        </span>
        <span className="huge-type hero-tagline outline-text parallax-text" data-speed="2">
          CULTURE
        </span>
      </h1>

      <div className="hero-kicker-wrap">
        <div className="container">
          <p className="hero-kicker">{hero.kicker}</p>
        </div>
      </div>
    </section>
  )
}
