import { ParallaxProvider } from "@/components/parallax-provider"
import { Hero } from "@/components/sections/hero"
import { NextEvent } from "@/components/sections/next-event"
import { Intro } from "@/components/sections/intro"
import { Marquee } from "@/components/sections/marquee"
import { Archive } from "@/components/sections/archive"
import { Residents } from "@/components/sections/residents"
import { Document } from "@/components/sections/document"
import { ContactForm } from "@/components/sections/contact-form"
import { siteName, siteUrl } from "@/content/site"
import { organizationJsonLd, toJsonLdScript } from "@/lib/events"

// Componente de servidor. CursorBlob, SiteNav y SiteFooter viven ahora en
// layout.tsx porque también hacen falta en /events/[slug]; aquí solo queda
// ParallaxProvider, que mueve elementos que únicamente existen en la home
// (.parallax-text, .hero-grid y .floating-label).

/**
 * Se regenera cada hora para que "la próxima fiesta" avance sola cuando una
 * fecha queda atrás, sin esperar a un despliegue. Depende de que la página siga
 * siendo de servidor: con "use client" esto no tendría efecto.
 */
export const revalidate = 3600

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: toJsonLdScript(organizationJsonLd({ siteOrigin: siteUrl, name: siteName })),
        }}
      />

      <ParallaxProvider />

      <main>
        <Hero />
        <NextEvent />
        <Marquee />
        <Intro />
        <Archive />
        <Residents />
        <Document />
        <ContactForm />
      </main>
    </>
  )
}
