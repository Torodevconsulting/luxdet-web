"use client"

import { useEffect } from "react"

// Parallax de scroll. No renderiza markup: localiza los elementos por clase
// (.parallax-text y .floating-label) y les aplica el transform.
export function ParallaxProvider() {
  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.pageYOffset

      // Hero parallax
      const parallaxTexts = document.querySelectorAll(".parallax-text")
      parallaxTexts.forEach((text) => {
        const speed = text.getAttribute("data-speed")
        if (speed) {
          // Acotado: sin tope el título se arrastraba fuera del viewport al scrollear
          const shift = scroll * Number.parseFloat(speed) * 0.1
          ;(text as HTMLElement).style.transform = `translateX(${Math.max(-40, Math.min(40, shift))}px)`
        }
      })

      // La imagen del hero es estática: no lleva parallax ni escalado

      // Floating labels in project section
      const labels = document.querySelectorAll(".floating-label")
      labels.forEach((label, index) => {
        const direction = index % 2 === 0 ? 1 : -1
        ;(label as HTMLElement).style.transform = `translateY(${scroll * 0.1 * direction}px)`
      })
    }
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return null
}
