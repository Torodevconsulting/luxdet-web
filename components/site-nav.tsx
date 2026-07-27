import Image from "next/image"
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
        {/* "Tickets" apuntaba a #about, que es la sección de texto: ahora va a
            la próxima fiesta. Y #work pasó a llamarse #archive. */}
        <li>
          <a href="#next">Tickets</a>
        </li>
        <li>
          <a href="#archive">Archive</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
      </ul>
    </nav>
  )
}
