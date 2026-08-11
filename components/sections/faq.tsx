import { faq, faqHeading } from "@/content/faq"

// Server Component, sin isla. El acordeón es <details>/<summary> nativo: no
// necesita JavaScript, trae el manejo de teclado hecho y —lo que importa aquí—
// deja el texto de las respuestas EN EL HTML servido aunque estén plegadas.
//
// Un acordeón montado a mano que renderizase la respuesta solo al abrirla
// dejaría fuera justo lo que se quiere que lean los rastreadores de
// recuperación, que es el único motivo de que esta sección exista.

export function Faq() {
  return (
    <section id="faq">
      <div className="container">
        <h2 className="section-kicker">{faqHeading}</h2>

        <div className="faq-list">
          {faq.map((item) => (
            <details className="faq-item" key={item.question}>
              {/* El <h3> va DENTRO del <summary>, que es el único orden que
                  permite la especificación (summary tiene que ser el primer
                  hijo de details). Así la pregunta sigue siendo un encabezado
                  navegable con lector de pantalla, en lugar de un botón suelto
                  que rompería el índice de la página. */}
              <summary className="faq-question">
                <h3>{item.question}</h3>
              </summary>

              <div className="faq-answer">
                {item.answer.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
