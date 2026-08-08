// Cruce entre el cartel de un evento y el roster de residentes.
//
// Vive aparte de lib/events.ts porque es lo único que necesita conocer el tipo
// Resident. Como aquel, no importa los datos: recibe los dos arrays por
// parámetro, así que content/ puede depender de este módulo sin crear un ciclo.

import type { LuxdetEvent } from "@/lib/events"
import type { Mix, Resident } from "@/content/residents"

/**
 * Un artista del cartel, ya resuelto contra el roster.
 *
 * Es deliberadamente plano y pequeño: cruza el límite servidor→cliente como
 * props de la isla del line-up, así que no arrastra la ficha entera del
 * residente (bio, foto, redes) hasta el navegador.
 */
export type LineupEntry = {
  name: string
  /** Perfil externo del performer, si lo declara el evento. */
  url?: string
  /** Presente solo si es residente. Identifica qué reproductor está abierto. */
  residentSlug?: string
  /** Rol del residente ("Resident · Techno"). Ausente si no está en el roster. */
  role?: string
  /**
   * Primer mix PROPIO del residente. Ausente si no es residente, si no tiene
   * mixes, o si los que tiene son material prestado: ver `pickPlayableMix`.
   */
  mix?: Mix
}

/**
 * El mix que puede sonar bajo el nombre de este artista, o undefined.
 *
 * Aquí está el gateo, y es explícito por decisión: solo `attribution: "own"`.
 * Hoy Venee, Shoon y Nischel Soni comparten el set de Toro como material
 * provisional; publicarlo en la página de un evento rotularía un reproductor
 * "Gus & Toro DJ Sessions" bajo el nombre de otra persona, que es peor que no
 * tener reproductor.
 *
 * El filtro es por lista blanca, nunca por lista negra: un mix nuevo no suena
 * en un evento hasta que alguien escribe que es suyo. Al ser `attribution` un
 * campo requerido de Mix, esa decisión no se puede omitir por olvido — el build
 * falla antes.
 *
 * El modal de residentes NO usa esto: allí se siguen viendo todos los mixes,
 * con su línea de crédito diciendo de quién es cada uno.
 */
function pickPlayableMix(resident: Resident): Mix | undefined {
  return resident.mixes?.find((mix) => mix.attribution === "own")
}

/** Índice por slug para no recorrer el roster una vez por artista. */
function indexBySlug(residents: readonly Resident[]) {
  return new Map(residents.map((resident) => [resident.slug, resident]))
}

/**
 * El cartel completo, en su orden original, anotado con lo que sepamos de cada
 * artista. Devuelve TODOS los performers: los que no son residentes salen con
 * solo el nombre, sin hueco reservado ni botón muerto.
 */
export function resolveLineup(
  event: LuxdetEvent,
  residents: readonly Resident[],
): LineupEntry[] {
  const bySlug = indexBySlug(residents)

  return event.performer.map((performer) => {
    const entry: LineupEntry = { name: performer.name }

    if (performer.url) entry.url = performer.url

    const resident = performer.residentSlug ? bySlug.get(performer.residentSlug) : undefined
    if (!resident) return entry

    entry.residentSlug = resident.slug
    entry.role = resident.role

    const mix = pickPlayableMix(resident)
    if (mix) entry.mix = mix

    return entry
  })
}

/** Si merece la pena renderizar la sección: sin reproductores no aporta nada. */
export function hasPlayableLineup(entries: readonly LineupEntry[]) {
  return entries.some((entry) => entry.mix)
}

/**
 * Comprueba que cada `residentSlug` existe en el roster.
 *
 * Mismo criterio que assertValidEventOffsets y assertValidSlugs: una referencia
 * mal escrita no rompe nada visible, simplemente deja a ese DJ sin reproductor
 * y nadie se entera. Mejor que reviente el build.
 *
 * Solo mira datos inmutables, así que puede llamarse al cargar el módulo.
 */
export function assertResidentRefs(
  events: readonly LuxdetEvent[],
  residents: readonly Resident[],
) {
  const known = new Set(residents.map((resident) => resident.slug))

  for (const event of events) {
    for (const performer of event.performer) {
      if (performer.residentSlug && !known.has(performer.residentSlug)) {
        throw new Error(
          `[events] ${event.slug}: el performer "${performer.name}" referencia ` +
            `residentSlug "${performer.residentSlug}", que no existe en content/residents.ts. ` +
            `Slugs disponibles: ${[...known].join(", ")}.`,
        )
      }
    }
  }
}
