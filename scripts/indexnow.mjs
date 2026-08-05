// Notifica a IndexNow (Bing, Yandex, Seznam, Naver — Google NO participa) que
// una o varias URLs han cambiado, sin esperar al rastreo natural.
//
// Requisitos previos:
//   1. La clave debe estar publicada en public/<clave>.txt, con la clave como
//      único contenido del archivo.
//   2. INDEXNOW_KEY definida en .env.local (no se commitea).
//
// Uso:
//   node scripts/indexnow.mjs https://luxdetculture.com/events/mi-fiesta
//   node scripts/indexnow.mjs --home
//   node scripts/indexnow.mjs --all          (todas las URLs del sitemap)
//
// No envíes todas las URLs en cada despliegue: manda solo lo que ha cambiado.
// El envío masivo repetido puede considerarse abuso del protocolo.

import { readFileSync } from "node:fs"

const HOST = "luxdetculture.com"
const ORIGIN = `https://${HOST}`
const ENDPOINT = "https://api.indexnow.org/indexnow"

function getKey() {
  // Lee INDEXNOW_KEY de .env.local sin dependencias externas
  if (process.env.INDEXNOW_KEY) return process.env.INDEXNOW_KEY
  try {
    const env = readFileSync(".env.local", "utf8")
    const match = env.match(/^INDEXNOW_KEY=(.+)$/m)
    if (match) return match[1].trim().replace(/^["']|["']$/g, "")
  } catch {
    /* sin .env.local */
  }
  return null
}

async function urlsFromSitemap() {
  const res = await fetch(`${ORIGIN}/sitemap.xml`)
  if (!res.ok) throw new Error(`sitemap devolvió ${res.status}`)
  const xml = await res.text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
}

const key = getKey()
if (!key) {
  console.error("Falta INDEXNOW_KEY. Defínela en .env.local.")
  process.exit(1)
}

const args = process.argv.slice(2)
if (args.length === 0) {
  console.error("Uso: node scripts/indexnow.mjs <url...> | --home | --all")
  process.exit(1)
}

let urlList
if (args[0] === "--all") {
  urlList = await urlsFromSitemap()
} else if (args[0] === "--home") {
  urlList = [`${ORIGIN}/`]
} else {
  urlList = args
}

// Toda URL debe pertenecer al host declarado o el endpoint rechaza el lote entero
const ajenas = urlList.filter((u) => !u.startsWith(ORIGIN))
if (ajenas.length) {
  console.error("URLs fuera de", ORIGIN, "→", ajenas)
  process.exit(1)
}

console.log(`Enviando ${urlList.length} URL(s):`)
urlList.forEach((u) => console.log("  ", u))

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key,
    keyLocation: `${ORIGIN}/${key}.txt`,
    urlList,
  }),
})

// 200 = aceptado. 202 = aceptado, clave pendiente de validar (normal la 1ª vez).
// 403 = la clave no coincide con el archivo publicado.
// 422 = alguna URL no pertenece al host. 429 = demasiadas peticiones.
const body = await res.text()
console.log(`\n${res.status} ${res.statusText}${body ? ` — ${body}` : ""}`)
process.exit(res.status === 200 || res.status === 202 ? 0 : 1)
