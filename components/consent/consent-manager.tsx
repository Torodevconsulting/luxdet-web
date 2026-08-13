"use client"

import Script from "next/script"
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import {
  GA_MEASUREMENT_ID,
  OPEN_CONSENT_EVENT,
  clearGaCookies,
  getConsentServerSnapshot,
  gtag,
  pushDeniedDefaults,
  pushDeniedUpdate,
  pushGrantedUpdate,
  readConsent,
  subscribeConsent,
  writeConsent,
  type ConsentChoice,
} from "@/lib/consent"

// Única isla del consentimiento. Hace dos cosas y ninguna más: decidir si se
// inyecta gtag.js y pintar el banner cuando no hay decisión tomada.
//
// EL ORDEN ES LO QUE IMPORTA AQUÍ. gtag.js no se renderiza hasta que el estado
// dice que hay consentimiento, y para entonces los defaults denegados y el
// `consent update` ya están en el dataLayer, que es una cola: gtag.js la lee
// entera al arrancar. Por eso no hace falta ningún <script> en línea como el
// del snippet de Google, y no añadimos otra dependencia de 'unsafe-inline'.
//
// Devuelve null en servidor a propósito: la decisión vive en localStorage, que
// solo existe en el navegador. Leerla desde una cookie permitiría pintar el
// banner ya en el HTML, pero obligaría a leer cookies en el layout y eso
// sacaría del prerenderizado estático a la home y a todas las /events/[slug].

/** Suscripción vacía: el valor solo cambia entre servidor y cliente. */
const neverChanges = () => () => {}

export function ConsentManager() {
  // Detecta la hidratación sin un setState en un efecto: en servidor devuelve
  // false, en cliente true. Mientras sea false no se pinta nada, así que el
  // banner nunca aparece en el HTML servido ni parpadea para quien ya decidió.
  const hydrated = useSyncExternalStore(neverChanges, () => true, () => false)

  // localStorage es un almacén externo al árbol de React; esta es la primitiva
  // que existe para leerlo. Escuchar "storage" hace además que aceptar en una
  // pestaña se refleje en las demás.
  const choice = useSyncExternalStore(subscribeConsent, readConsent, getConsentServerSnapshot)

  // Cuando se reabre desde el footer, el banner vuelve aunque ya haya decisión.
  const [reopened, setReopened] = useState(false)

  // Si gtag.js llegó a entrar en ESTA carga. Es un ref y no estado porque nada
  // de lo que se pinta depende de él: solo decide si revocar exige recargar.
  const gaLoaded = useRef(false)

  // Nada concedido mientras no se diga. Se empuja en cada carga, antes de que
  // exista gtag.js.
  useEffect(() => {
    if (GA_MEASUREMENT_ID) pushDeniedDefaults()
  }, [])

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || choice !== "granted") return
    pushGrantedUpdate()
    gaLoaded.current = true
  }, [choice])

  useEffect(() => {
    const open = () => setReopened(true)
    window.addEventListener(OPEN_CONSENT_EVENT, open)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open)
  }, [])

  const decide = useCallback((next: ConsentChoice) => {
    // Dispara el evento que hace releer el almacén, así que `choice` se
    // actualiza solo y con él el efecto de arriba.
    writeConsent(next)
    setReopened(false)

    if (next === "granted") return

    pushDeniedUpdate()
    clearGaCookies()

    // gtag.js no se puede descargar de una página ya cargada. Si estaba dentro,
    // lo único que devuelve el navegador a un estado limpio de verdad es
    // recargar: el update y el borrado de cookies impiden que se siga
    // escribiendo, pero el script sigue en memoria.
    if (gaLoaded.current) window.location.reload()
  }, [])

  const showBanner = hydrated && (choice === null || reopened)

  // El banner desplaza el final de la página mientras está visible, para que no
  // tape el footer. Mismo recurso que `dialog-open` y por el mismo motivo: una
  // clase en el body en lugar de estilos en línea.
  useEffect(() => {
    if (!showBanner) return
    document.body.classList.add("consent-open")
    return () => document.body.classList.remove("consent-open")
  }, [showBanner])

  // Sin measurement ID no hay analítica que consentir, así que tampoco banner.
  //
  // Se copia a una const local antes de usarlo: el estrechamiento de un binding
  // importado no sobrevive dentro del closure de onLoad, y TypeScript lo
  // volvería a ver como `string | undefined` justo donde hace falta.
  const measurementId = GA_MEASUREMENT_ID
  if (!measurementId) return null

  return (
    <>
      {choice === "granted" && (
        <Script
          id="ga4"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
          onLoad={() => {
            gtag("js", new Date())
            gtag("config", measurementId)
          }}
        />
      )}

      {showBanner && (
        // aria-modal="false" y sin trampa de foco: no bloquea la navegación, se
        // puede seguir usando la página con el banner abierto. Va montado el
        // primero dentro de <body> para que el tabulador y el lector de pantalla
        // lo encuentren antes que el contenido, sin robarle el foco a nadie.
        <div
          className="consent-banner"
          role="dialog"
          aria-modal="false"
          aria-labelledby="consent-title"
        >
          <div className="consent-inner">
            <div className="consent-copy">
              <h2 className="consent-title" id="consent-title">
                Cookies
              </h2>
              <p className="consent-text">
                {
                  "We'd like to use Google Analytics to see which pages and events people actually look at. It sets cookies, so it only runs if you say yes — nothing from Google loads until then. Our own visitor count doesn't use cookies and runs either way. "
                }
                <Link className="consent-link" href="/privacy">
                  Read the privacy policy
                </Link>
                {"."}
              </p>
            </div>

            {/* Los dos botones son el mismo componente con la misma clase: mismo
                tamaño, mismo contraste, un clic cada uno. Que rechazar cueste
                más que aceptar es justo lo que invalida un consentimiento. */}
            <div className="consent-actions">
              <button type="button" className="consent-button" onClick={() => decide("denied")}>
                Decline
              </button>
              <button type="button" className="consent-button" onClick={() => decide("granted")}>
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
