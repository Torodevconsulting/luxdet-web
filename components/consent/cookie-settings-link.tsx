"use client"

import { GA_MEASUREMENT_ID, OPEN_CONSENT_EVENT } from "@/lib/consent"

// Reabre la elección de cookies desde el footer.
//
// Se comunica con ConsentManager por un evento de window y no por contexto:
// son dos islas hermanas colgando del layout, y un provider que envolviese a
// las dos obligaría a subir estado al árbol entero para un solo botón.
//
// Es un <button> y no un <a>: no navega a ninguna parte. Se le da el aspecto
// de los demás enlaces del pie con .footer-link.

export function CookieSettingsLink() {
  // Sin analítica que consentir no hay nada que reabrir, y un enlace que no
  // hace nada es peor que no tenerlo.
  if (!GA_MEASUREMENT_ID) return null

  return (
    <button
      type="button"
      className="footer-link consent-reopen"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
    >
      Cookies
    </button>
  )
}
