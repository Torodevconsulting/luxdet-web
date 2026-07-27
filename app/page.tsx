import { CursorBlob } from "@/components/cursor-blob"
import { ParallaxProvider } from "@/components/parallax-provider"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/sections/hero"
import { NextEvent } from "@/components/sections/next-event"
import { Intro } from "@/components/sections/intro"
import { Marquee } from "@/components/sections/marquee"
import { Archive } from "@/components/sections/archive"
import { Residents } from "@/components/sections/residents"
import { Document } from "@/components/sections/document"

// Componente de servidor: las únicas islas de cliente son CursorBlob y
// ParallaxProvider. Marcar esta página como componente de cliente enviaría al
// navegador todo el árbol que importa, así que no debe llevar esa directiva.

/**
 * Se regenera cada hora para que "la próxima fiesta" avance sola cuando una
 * fecha queda atrás, sin esperar a un despliegue. Depende de que la página siga
 * siendo de servidor: con "use client" esto no tendría efecto.
 */
export const revalidate = 3600

export default function Home() {
  return (
    <>
      <CursorBlob />
      <ParallaxProvider />

      <SiteNav />

      <main>
        <Hero />
        <NextEvent />
        <Marquee />
        <Intro />
        <Archive />
        <Residents />
        <Document />
        <SiteFooter />
      </main>
    </>
  )
}
