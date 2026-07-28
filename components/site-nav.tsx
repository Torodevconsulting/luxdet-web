import Image from "next/image"
import Link from "next/link"
// Versión recortada de public/luxdetlogo.png: el original es un lienzo de
// 5000x5000 donde la marca ocupa solo el 36% del alto, así que al ligar su
// altura al cuerpo del texto se habría visto tres veces más pequeña.
import luxdetMark from "@/public/luxdet-mark.png"

export function SiteNav() {
  return (
    <nav>
      <div className="logo">
        <span>LUXDET CULTURE</span>
        {/* Decorativo: el nombre ya está en texto al lado, así que alt vacío
            evita que un lector de pantalla lo repita. */}
        <Image src={luxdetMark} alt="" className="logo-mark" priority />
      </div>
      <ul className="nav-links">
        {/* Anclas absolutas, no "#next": el nav está en el layout, así que
            también se pinta en /events/[slug], donde esas secciones no existen
            y un ancla suelta no llevaría a ninguna parte (y sin dar error). */}
        <li>
          <Link href="/#next">Tickets</Link>
        </li>
        <li>
          <Link href="/#archive">Archive</Link>
        </li>
        <li>
          <Link href="/#contact">Contact</Link>
        </li>
      </ul>
    </nav>
  )
}
