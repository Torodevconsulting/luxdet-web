import Image from "next/image"
import { documentPhotos } from "@/content/document"

// Sustituye a la antigua sección composition (el bloque "LAYERED DEPTH", texto
// de portfolio heredado de v0) y conserva su lenguaje visual: capas solapadas
// sobre una rejilla de 12 columnas, bordes finos y grayscale que revela color.
//
// El solape se declara con grid-row en lugar de las alturas fijas y los
// margin-top de .composition, que obligaban a recalcular la altura del
// contenedor en cada breakpoint.
export function Document() {
  return (
    <section id="document">
      <div className="container">
        <p className="section-kicker">Document</p>

        <div className="document-grid">
          {documentPhotos.map((photo, i) => (
            <figure className={`doc-item doc-item-${i + 1}`} key={photo.id}>
              <Image
                src={photo.image}
                alt={photo.alt}
                className="doc-image"
                sizes="(max-width: 767px) 100vw, 50vw"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
