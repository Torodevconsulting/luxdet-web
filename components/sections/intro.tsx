import { IntroReveal } from "@/components/intro-reveal"
import { about } from "@/content/about"

// Alineación y tratamiento de cada línea del titular. El orden es el de
// about.titleLines: izquierda rellena, centro en trazo, derecha rellena.
const LINE_MODIFIERS = ["intro-line--left", "intro-line--center", "intro-line--right"]

const GRID_COLUMNS = 6

export function Intro() {
  return (
    <section id="about">
      <div className="container">
        {/* Decorativa, alineada al .container para que las líneas caigan sobre
            los mismos márgenes que el resto de secciones. */}
        <div className="intro-grid" aria-hidden="true">
          {Array.from({ length: GRID_COLUMNS }, (_, i) => (
            <span key={i} />
          ))}
        </div>

        <p className="section-kicker">{about.kicker}</p>

        <IntroReveal>
          {/* Un único <h2>: son tres líneas de un mismo titular, no tres
              encabezados. Con <h3> o <h2> repetidos, un lector de pantalla
              anunciaría tres secciones donde solo hay una. */}
          <h2 className="intro-title">
            {about.titleLines.map((line, i) => (
              <span
                className={`intro-line ${LINE_MODIFIERS[i] ?? ""}`}
                key={line}
                // El trazo de la línea central es decoración tipográfica; el
                // texto sigue siendo el mismo y se lee igual.
              >
                {line}
              </span>
            ))}
          </h2>
        </IntroReveal>

        <div className="intro-columns">
          {about.paragraphs.map((paragraph) => (
            <p className="intro-paragraph" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
