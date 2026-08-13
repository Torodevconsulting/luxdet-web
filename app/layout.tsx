import type React from "react"
import type { Metadata } from "next"
import { Syne, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ConsentManager } from "@/components/consent/consent-manager"
import { CursorBlob } from "@/components/cursor-blob"
import { SiteNav } from "@/components/site-nav"
import { NavAutoHide } from "@/components/nav-auto-hide"
import { SiteFooter } from "@/components/site-footer"
import { siteUrl } from "@/content/site"
import "./globals.css"

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LUXDET CULTURE — Electronic Music Events",
    template: "%s | LUXDET",
  },
  description:
    "Electronic music event production in Ohio. Lineups, venues and tickets.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "LUXDET CULTURE",
    title: "LUXDET CULTURE — Electronic Music Events",
    description:
      "Electronic music event production in Ohio. Lineups, venues and tickets.",
    images: ["/opengraph-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "LUXDET CULTURE — Electronic Music Events",
    description:
      "Electronic music event production in Ohio. Lineups, venues and tickets.",
    images: ["/opengraph-image.png"],
  },
  // Paquete generado para la marca. Ojo: no se declara ningún SVG a propósito.
  // Los navegadores modernos prefieren el SVG cuando existe, así que el icon.svg
  // que traía la plantilla de v0 se impondría sobre estos PNG.
  icons: {
    icon: [
      { url: "/luxdet_favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/luxdet_favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/luxdet_favicon.ico",
    apple: "/luxdet_apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Las variables de next/font van en <html> para que :root las vea
    <html lang="en" className={`${syne.variable} ${inter.variable}`}>
      <body>
        {/* Primero del todo dentro de <body> aunque se pinte abajo del todo:
            así el tabulador y el lector de pantalla llegan a la elección de
            cookies antes que al contenido, sin necesidad de robar el foco.
            No sale en el HTML servido — decide tras hidratar, con localStorage. */}
        <ConsentManager />

        {/* Chrome del sitio, no de la home: al existir /events/[slug] tiene que
            estar en el layout o esas páginas se quedarían sin navegación y sin
            forma de volver. El footer sale ahora de <main>, que además es lo
            correcto semánticamente. */}
        <CursorBlob />
        <SiteNav />
        <NavAutoHide />
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  )
}
