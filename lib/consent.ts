// Consentimiento de analítica: estado, persistencia y puente con gtag.
//
// ---------------------------------------------------------------------------
// ASIMETRÍA DELIBERADA ENTRE LAS DOS ANALÍTICAS — leer antes de comparar cifras
// ---------------------------------------------------------------------------
// Este sitio mide de dos formas que NO cuentan lo mismo, y no es un error:
//
//   Vercel Analytics  → sin cookies, sin consentimiento. Ve el 100% del tráfico.
//   Google Analytics  → con cookies, solo tras un "aceptar" explícito. Ve
//                       únicamente el subconjunto que consintió.
//
// GA4 va a dar SIEMPRE menos visitas que Vercel, y la diferencia es la tasa de
// rechazo del banner. No hay nada que arreglar ahí.
//
// Además, aquí NO se usa el Consent Mode "estándar" de Google, en el que
// gtag.js se carga siempre en estado denegado y manda cookieless pings que
// alimentan datos modelados. gtag.js no entra en la página hasta que hay
// consentimiento, así que de quien rechaza no llega absolutamente nada: ni
// cookies, ni peticiones, ni estimaciones. Fue una decisión, no un descuido.
// ---------------------------------------------------------------------------

/**
 * Sin measurement ID no se carga GA4 ni se muestra el banner. Mismo criterio
 * que NEXT_PUBLIC_TURNSTILE_SITE_KEY en el formulario de contacto: mejor no
 * renderizar nada que renderizar algo roto.
 *
 * Ojo: NEXT_PUBLIC_ se incrusta en build, no se lee en runtime. Cambiarla en
 * Vercel exige redeploy.
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export type ConsentChoice = "granted" | "denied"

const STORAGE_KEY = "luxdet:consent"

/**
 * Sube cuando cambie A QUÉ se está consintiendo (otro proveedor, otra
 * finalidad). Al subirla, las decisiones guardadas con la versión anterior
 * dejan de valer y se vuelve a preguntar: un "sí" dado para GA4 no es un "sí"
 * para lo que venga después.
 */
const STORAGE_VERSION = 1

type StoredConsent = {
  v: number
  choice: ConsentChoice
  at: string
}

/** Evento con el que el enlace del footer le pide al banner que reaparezca. */
export const OPEN_CONSENT_EVENT = "luxdet:open-consent"

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

type ConsentState = {
  analytics_storage: "granted" | "denied"
  ad_storage: "granted" | "denied"
  ad_user_data: "granted" | "denied"
  ad_personalization: "granted" | "denied"
}

type GtagCall =
  | ["consent", "default" | "update", ConsentState]
  | ["js", Date]
  | ["config", string]

// `_args` no se usa en el cuerpo —se empuja `arguments`— pero es lo que da el
// tipado a quien llama, así que no se puede quitar.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function gtag(..._args: GtagCall) {
  window.dataLayer = window.dataLayer ?? []
  // `arguments` y no `args`: gtag.js inspecciona el objeto Arguments tal cual y
  // no interpreta igual un array corriente. Es el motivo de que el snippet de
  // Google use una `function` y no una flecha, y de que no se pueda "limpiar"
  // esto con parámetros rest.
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments)
}

/** Todo denegado. Se empuja en cada carga, antes de que exista gtag.js. */
export function pushDeniedDefaults() {
  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  })
}

/**
 * Solo se sube `analytics_storage`. Los tres permisos publicitarios se quedan
 * denegados siempre: no hay publicidad en este sitio y Google Signals está
 * apagado a propósito (ver la nota de next.config.mjs).
 */
export function pushGrantedUpdate() {
  gtag("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  })
}

export function pushDeniedUpdate() {
  gtag("consent", "update", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  })
}

/** La decisión guardada, o null si nunca se tomó o si es de otra versión. */
export function readConsent(): ConsentChoice | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed: StoredConsent = JSON.parse(raw)
    if (parsed.v !== STORAGE_VERSION) return null
    if (parsed.choice !== "granted" && parsed.choice !== "denied") return null

    return parsed.choice
  } catch {
    // localStorage lanza en modo privado de algunos navegadores y JSON.parse
    // lanza si alguien tocó el valor a mano. En ambos casos la respuesta
    // correcta es la misma: no hay decisión válida, así que se vuelve a
    // preguntar. Nunca asumir consentimiento.
    return null
  }
}

export function writeConsent(choice: ConsentChoice) {
  const value: StoredConsent = { v: STORAGE_VERSION, choice, at: new Date().toISOString() }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // Si no se puede guardar, el banner volverá a salir en la siguiente visita.
    // Molesto, pero es el lado correcto en el que fallar.
  }
  // localStorage no avisa a la propia pestaña que escribe: el evento "storage"
  // solo lo reciben las DEMÁS. Sin esto, el componente no se enteraría de su
  // propio cambio.
  window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT))
}

const CONSENT_CHANGED_EVENT = "luxdet:consent-changed"

/**
 * Suscripción para useSyncExternalStore. localStorage es un almacén externo al
 * árbol de React, y esta es la primitiva que existe para leerlo: evita el
 * `setState` dentro de un efecto, que además de estar desaconsejado provoca un
 * render de más en cada carga.
 *
 * Escucha "storage" para que aceptar en una pestaña se refleje en las otras.
 */
export function subscribeConsent(onChange: () => void) {
  window.addEventListener("storage", onChange)
  window.addEventListener(CONSENT_CHANGED_EVENT, onChange)
  return () => {
    window.removeEventListener("storage", onChange)
    window.removeEventListener(CONSENT_CHANGED_EVENT, onChange)
  }
}

/** En servidor no hay decisión posible: nunca se pinta el banner en el HTML. */
export function getConsentServerSnapshot(): ConsentChoice | null {
  return null
}

/**
 * Borra las cookies que deja GA4 (`_ga` y `_ga_<ID>`, dos años cada una).
 *
 * Hace falta porque gtag.js NO se puede descargar de una página ya cargada: al
 * revocar, un `consent update` a denied evita que se sigan usando, pero las
 * cookies ya escritas seguirían ahí dos años. Sin este borrado, "rechazar"
 * después de haber aceptado sería decorativo.
 *
 * Se intenta en varios dominios porque GA4 las escribe en el dominio raíz
 * (.luxdetculture.com) y el borrado solo funciona si coinciden dominio y ruta.
 */
export function clearGaCookies() {
  const { hostname } = window.location
  const parts = hostname.split(".")

  // "a.b.c" → ["a.b.c", ".b.c", ".c"]; cubre el host exacto y sus dominios padre
  const domains = [hostname, ...parts.map((_, i) => `.${parts.slice(i).join(".")}`)]

  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim()
    if (!name?.startsWith("_ga")) continue

    document.cookie = `${name}=; max-age=0; path=/`
    for (const domain of domains) {
      document.cookie = `${name}=; max-age=0; path=/; domain=${domain}`
    }
  }
}
