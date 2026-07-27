import Image from "next/image"
import { residents } from "@/content/residents"

export function Residents() {
  return (
    <section id="residents">
      <div className="container">
        <p className="section-kicker">Residents</p>

        <ul className="residents-grid">
          {residents.map((resident) => (
            <li className="resident-card" key={resident.slug}>
              <div className="resident-media">
                <Image
                  src={resident.image}
                  alt={resident.imageAlt}
                  className="resident-photo"
                  sizes="(max-width: 767px) 100vw, (max-width: 1024px) 50vw, 30vw"
                />
              </div>
              <h3 className="resident-name">{resident.name}</h3>
              <p className="resident-role">{resident.role}</p>
              {/* Sin URL no se renderiza enlace: un <a> sin destino real no
                  aporta nada y ensucia el recorrido por teclado. */}
              {resident.url && (
                <a
                  className="resident-link"
                  href={resident.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Listen
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
