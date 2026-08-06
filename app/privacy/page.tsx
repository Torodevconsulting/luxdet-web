import type { Metadata } from "next"
import { privacyPolicy } from "@/content/privacy"
import { siteUrl } from "@/content/site"

// Página de texto legal: todo el contenido sale de content/privacy.ts, aquí
// solo está la maquetación. Estática, sin islas de cliente y sin animaciones:
// el efecto que tiene sentido en la home aquí solo estorba a la lectura.

const canonical = `${siteUrl}/privacy`

// `lastUpdated` es una fecha sin hora ("2026-08-05"), y eso se parsea como UTC.
// Sin fijar el huso, en cualquier zona al oeste de Greenwich se imprimiría el
// día anterior.
function formatLastUpdated(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso))
}

export function generateMetadata(): Metadata {
  return {
    title: privacyPolicy.title,
    description: privacyPolicy.description,
    alternates: { canonical },
    // Una política de privacidad no posiciona para nada y compite por
    // presupuesto de rastreo con las páginas de evento, que son las que sí
    // interesa indexar. La página sigue siendo pública y accesible: `noindex`
    // solo pide que no se liste, y `follow` deja que se sigan sus enlaces.
    robots: { index: false, follow: true },
  }
}

export default function PrivacyPage() {
  const { title, lastUpdated, sections, contactHeading, legalName, address, contactEmail } =
    privacyPolicy

  return (
    <main>
      <article className="legal-page">
        <div className="container">
          <h1 className="legal-title">{title}</h1>

          <p className="legal-updated">
            {"Last updated "}
            <time dateTime={lastUpdated}>{formatLastUpdated(lastUpdated)}</time>
          </p>

          <div className="legal-body">
            {sections.map((section) => (
              // <div> y no <section>: la regla global de `section` impone
              // min-height:100vh y centrado vertical, que es lo que necesitan
              // las bandas de la home y lo último que necesita un texto
              // corrido. El índice de la página lo da la jerarquía de <h2>.
              <div className="legal-section" key={section.heading}>
                <h2>{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ))}

            <div className="legal-contact">
              <h2>{contactHeading}</h2>
              {/* <address> es exactamente esto: los datos de contacto del
                  responsable del documento. Los navegadores lo pintan en
                  cursiva por defecto, corregido en globals.css. */}
              <address>
                <span className="legal-contact-name">{legalName}</span>
                <span>{address}</span>
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </address>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}
