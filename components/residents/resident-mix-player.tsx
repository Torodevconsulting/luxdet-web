"use client"

import { useState } from "react"
import type { Mix } from "@/content/residents"
import { MixPlayer } from "./mix-player"
import { useResidentDialog } from "./resident-dialog-root"

// Adaptador entre el diálogo de residentes y el reproductor. Es la lógica que
// antes vivía dentro de MixPlayer, movida aquí sin cambiarla al extraer el
// reproductor para poder reutilizarlo en la página de evento.

export function ResidentMixPlayer({ slug, mix }: { slug: string; mix: Mix }) {
  const { openSlug, openId } = useResidentDialog()
  // En qué apertura del diálogo se pulsó LISTEN.
  const [listeningAt, setListeningAt] = useState<number | null>(null)

  // Estado derivado, no sincronizado con un efecto: el iframe existe solo
  // mientras siga abierta la misma apertura en la que se pidió. Al cerrar,
  // `openId` cambia, `active` pasa a false y React desmonta el nodo, así que el
  // audio se corta de verdad. Y al reabrir la ficha vuelve a aparecer el botón
  // en lugar de arrancar solo.
  const active = openSlug === slug && listeningAt === openId

  return <MixPlayer mix={mix} active={active} onListen={() => setListeningAt(openId)} />
}
