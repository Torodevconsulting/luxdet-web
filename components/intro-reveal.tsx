"use client"

import { useEffect, useRef, type ReactNode } from "react"

// Isla mínima: solo arma la animación de entrada del titular. El texto llega
// renderizado desde el servidor y esto no lo toca.
//
// No va en ParallaxProvider a propósito: aquel escribe estilos en cada frame de
// scroll, y esto es una transición CSS que se dispara una vez y se olvida.
export function IntroReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Quien pide menos animación ve el texto en su sitio desde el principio:
    // no se arma nada, así que tampoco hay nada que revelar.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    // Si la sección ya está a la vista al montar, tampoco se arma. Ocultar algo
    // que la persona ya está leyendo para animarlo produce un parpadeo peor que
    // no animar.
    const rect = element.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) return

    // A partir de aquí el CSS sí esconde las líneas: la clase solo existe si
    // este código se ha ejecutado, de modo que sin JS el texto se ve entero.
    element.classList.add("intro-reveal")

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            element.classList.add("is-visible")
            // Entrada única, no un efecto ligado al scroll.
            observer.disconnect()
          }
        }
      },
      { threshold: 0.25 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="intro-headline" ref={ref}>
      {children}
    </div>
  )
}
