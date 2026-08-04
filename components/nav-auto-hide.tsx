"use client"

import { useEffect } from "react"

// Oculta la barra al bajar y la devuelve al subir, solo en móvil. El nav es
// fixed y ahí ocupa dos filas —logo y enlaces—, así que se come una porción
// notable de una pantalla pequeña mientras se lee.
//
// Isla propia y no dentro de ParallaxProvider: aquella vive en la home y el nav
// está en el layout, así que en /events/[slug] no se enteraría.

/** Por debajo de esto no se oculta: arriba del todo la barra siempre se ve. */
const HIDE_AFTER = 80

/** Movimiento mínimo para reaccionar, para que un microscroll no la dispare. */
const THRESHOLD = 6

export function NavAutoHide() {
  useEffect(() => {
    const nav = document.querySelector("nav")
    if (!nav) return

    // En escritorio la barra se queda: hay sitio de sobra y no se engancha
    // ningún listener.
    const isMobile = window.matchMedia("(max-width: 767px)")
    if (!isMobile.matches) return

    let lastY = window.scrollY
    let frame = 0

    const update = () => {
      frame = 0
      const y = window.scrollY

      if (Math.abs(y - lastY) < THRESHOLD) return

      const goingDown = y > lastY
      nav.classList.toggle("nav-hidden", goingDown && y > HIDE_AFTER)
      lastY = y
    }

    // Una vez por fotograma en lugar de una por evento de scroll.
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) cancelAnimationFrame(frame)
      nav.classList.remove("nav-hidden")
    }
  }, [])

  return null
}
