// Captura y compara el HTML prerenderizado de la home para comprobar que un
// refactor es puramente estructural.
//
//   node scripts/snapshot.mjs before.txt          captura
//   node scripts/snapshot.mjs --diff a.txt b.txt  compara
//
// Se comparan las etiquetas, clases, estilos en línea, orden de atributos y
// nodos de texto del <body>. Se descartan los <script> a propósito: el payload
// RSC en línea (self.__next_f) y los hashes de los chunks cambian siempre al
// reorganizar componentes, aunque el DOM salga idéntico.

import { readFileSync, writeFileSync, existsSync } from "node:fs"

const SOURCE = ".next/server/app/index.html"

function extract() {
  if (!existsSync(SOURCE)) {
    console.error(`No existe ${SOURCE}. Ejecuta antes: pnpm build`)
    process.exit(1)
  }

  const html = readFileSync(SOURCE, "utf8")
  const start = html.indexOf("<body")
  const end = html.lastIndexOf("</body>")

  if (start === -1 || end === -1) {
    console.error(`No se encuentra el <body> en ${SOURCE}`)
    process.exit(1)
  }

  return html
    .slice(start, end + "</body>".length)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<script\b[^>]*\/>/gi, "")
    .replace(/\r\n/g, "\n")
}

function capture(target) {
  const body = extract()
  writeFileSync(target, body, "utf8")
  console.log(`${target}: ${body.length} caracteres de markup`)
}

function diff(pathA, pathB) {
  for (const p of [pathA, pathB]) {
    if (!existsSync(p)) {
      console.error(`No existe ${p}`)
      process.exit(1)
    }
  }

  const a = readFileSync(pathA, "utf8")
  const b = readFileSync(pathB, "utf8")

  if (a === b) {
    console.log("HTML idéntico")
    return
  }

  console.error(`HTML DISTINTO (${pathA}: ${a.length} car., ${pathB}: ${b.length} car.)`)

  // Primer carácter que difiere, con su contexto, para localizar el cambio.
  let i = 0
  while (i < a.length && i < b.length && a[i] === b[i]) i++
  const from = Math.max(0, i - 120)
  console.error(`\nPrimera diferencia en el carácter ${i}:`)
  console.error(`\n--- ${pathA}\n${JSON.stringify(a.slice(from, i + 200))}`)
  console.error(`\n+++ ${pathB}\n${JSON.stringify(b.slice(from, i + 200))}`)

  // Y las líneas que no coinciden, que suelen señalar el elemento culpable.
  const linesA = a.split("\n")
  const linesB = b.split("\n")
  const changed = []
  for (let n = 0; n < Math.max(linesA.length, linesB.length); n++) {
    if (linesA[n] !== linesB[n]) changed.push(n + 1)
  }
  if (changed.length) {
    console.error(`\nLíneas distintas: ${changed.slice(0, 20).join(", ")}${changed.length > 20 ? "…" : ""}`)
  }

  process.exit(1)
}

const [first, ...rest] = process.argv.slice(2)

if (first === "--diff") {
  if (rest.length !== 2) {
    console.error("Uso: node scripts/snapshot.mjs --diff <a.txt> <b.txt>")
    process.exit(1)
  }
  diff(rest[0], rest[1])
} else if (first) {
  capture(first)
} else {
  console.error("Uso: node scripts/snapshot.mjs <fichero> | --diff <a.txt> <b.txt>")
  process.exit(1)
}
