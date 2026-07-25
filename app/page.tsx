import { CursorBlob } from "@/components/cursor-blob"
import { ParallaxProvider } from "@/components/parallax-provider"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/sections/hero"
import { Intro } from "@/components/sections/intro"
import { Marquee } from "@/components/sections/marquee"
import { Work } from "@/components/sections/work"
import { Composition } from "@/components/sections/composition"

// Componente de servidor: las únicas islas de cliente son CursorBlob y
// ParallaxProvider. Marcar esta página como componente de cliente enviaría al
// navegador todo el árbol que importa, así que no debe llevar esa directiva.
export default function Home() {
  return (
    <>
      <CursorBlob />
      <ParallaxProvider />

      <SiteNav />

      <main>
        <Hero />
        <Intro />
        <Marquee />
        <Work />
        <Composition />
        <SiteFooter />
      </main>
    </>
  )
}
