"use client"

import { useEffect } from "react"

// Desplazamiento del texto del hero, de la rejilla del hero y de las etiquetas
// flotantes del archivo. No renderiza markup: localiza los elementos por clase
// y les aplica el transform.

/** Tope del desplazamiento lateral del texto, en px. */
const TEXT_SHIFT_LIMIT = 40
/** La rejilla baja a este ritmo respecto al scroll, y hasta este máximo. */
const GRID_SPEED = 0.06
const GRID_SHIFT_LIMIT = 120

export function ParallaxProvider() {
  useEffect(() => {
    // Quien pide menos animación no recibe ninguna: no se llega a enganchar el
    // listener, así que tampoco se paga su coste.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0

    const update = () => {
      frame = 0
      const scroll = window.scrollY

      // Texto del hero: se desplaza a los lados según data-speed, acotado para
      // que no se salga del viewport.
      document.querySelectorAll<HTMLElement>(".parallax-text").forEach((text) => {
        const speed = text.getAttribute("data-speed")
        if (speed) {
          const shift = scroll * Number.parseFloat(speed) * 0.1
          const clamped = Math.max(-TEXT_SHIFT_LIMIT, Math.min(TEXT_SHIFT_LIMIT, shift))
          text.style.transform = `translateX(${clamped}px)`
        }
      })

      // Rejilla del hero: baja despacio mientras el texto se queda en su sitio.
      // .hero-grid-wrap sobresale por arriba y por abajo, de modo que este
      // desplazamiento no descubre los bordes de las columnas.
      const grid = document.querySelector<HTMLElement>(".hero-grid")
      if (grid) {
        grid.style.transform = `translateY(${Math.min(scroll * GRID_SPEED, GRID_SHIFT_LIMIT)}px)`
      }

      // Etiquetas flotantes de la sección de archivo
      document.querySelectorAll<HTMLElement>(".floating-label").forEach((label, index) => {
        const direction = index % 2 === 0 ? 1 : -1
        label.style.transform = `translateY(${scroll * 0.1 * direction}px)`
      })
    }

    // El evento de scroll dispara mucho más a menudo de lo que el navegador
    // pinta: con rAF se calcula una vez por fotograma en lugar de una por
    // evento, y se escribe en el momento en que el navegador va a pintar.
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    update()

    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return null
}
