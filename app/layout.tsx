import type React from "react"
import type { Metadata } from "next"
import { Syne, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LUXDET — Electronic Music Events",
    template: "%s | LUXDET",
  },
  description:
    "Electronic music event production in Ohio. Lineups, venues and tickets.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "LUXDET CULTURE",
    title: "LUXDET CULTURE— Electronic Music Events",
    description:
      "Electronic music event production in Ohio. Lineups, venues and tickets.",
    images: ["/opengraph-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "LUXDET CULTURE— Electronic Music Events",
    description:
      "Electronic music event production in Ohio. Lineups, venues and tickets.",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
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
        {children}
        <Analytics />
      </body>
    </html>
  )
}
