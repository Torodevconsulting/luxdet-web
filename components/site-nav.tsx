import Image from "next/image"
import Link from "next/link"
import { getPastEvents } from "@/content/events"
// Versión recortada de public/luxdetlogo.png: el original es un lienzo de
// 5000x5000 donde la marca ocupa solo el 36% del alto, así que al ligar su
// altura al cuerpo del texto se habría visto tres veces más pequeña.
import luxdetMark from "@/public/luxdet-mark.png"

export function SiteNav() {
  // Se consulta aquí, no en una constante de módulo, para que se recalcule en
  // cada regeneración: un evento pasa a pasado sin que nadie despliegue nada.
  const hasArchive = getPastEvents().length > 0

  return (
    <nav>
      {/* El logo lleva siempre a la home. Importa desde que hay más de una
          ruta: en /events/[slug] es el camino de vuelta más evidente. */}
      <Link href="/" className="logo">
        <span>LUXDET CULTURE</span>
        {/* Decorativo: el nombre ya está en texto al lado, así que alt vacío
            evita que un lector de pantalla lo repita. */}
        <Image src={luxdetMark} alt="" className="logo-mark" priority />
      </Link>
      <ul className="nav-links">
        {/* Anclas absolutas, no "#next": el nav está en el layout, así que
            también se pinta en /events/[slug], donde esas secciones no existen
            y un ancla suelta no llevaría a ninguna parte (y sin dar error). */}
        <li>
          <Link href="/#next">Tickets</Link>
        </li>
        {/* La sección ARCHIVE no se renderiza si no hay eventos pasados, así
            que el enlace desaparece con ella: si no, apuntaría a un ancla
            inexistente, que falla en silencio. */}
        {hasArchive && (
          <li>
            <Link href="/#archive">Archive</Link>
          </li>
        )}
        <li>
          <Link href="/#contact">Contact</Link>
        </li>
      </ul>
    </nav>
  )
}
