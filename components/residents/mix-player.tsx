"use client"

import { useState } from "react"
import type { Mix } from "@/content/residents"
import { useResidentDialog } from "./resident-dialog-root"

// Dos puertas: abrir el modal no monta ningún iframe. Solo al pulsar LISTEN se
// carga el widget, de modo que leer una bio no descarga cientos de KB de
// terceros y ese clic sirve además como gesto de consentimiento del embed.

const PLAYER_HEIGHT = { soundcloud: 166, mixcloud: 60 } as const

const PLATFORM_NAMES = { soundcloud: "SoundCloud", mixcloud: "Mixcloud" } as const

function embedSrc(mix: Mix) {
  const feed = encodeURIComponent(mix.url)

  if (mix.platform === "soundcloud") {
    // visual=false deja la barra compacta; show_user=true mantiene el autor a
    // la vista, que es parte de la atribución que exige SoundCloud.
    return (
      `https://w.soundcloud.com/player/?url=${feed}` +
      "&color=%23ff3e00&visual=false&auto_play=true&hide_related=true" +
      "&show_comments=false&show_user=true&show_teaser=false"
    )
  }

  return `https://player.mixcloud.com/widget/iframe/?feed=${feed}&hide_cover=1&mini=1&autoplay=1`
}

export function MixPlayer({ slug, mix }: { slug: string; mix: Mix }) {
  const { openSlug, openId } = useResidentDialog()
  // En qué apertura del diálogo se pulsó LISTEN.
  const [listeningAt, setListeningAt] = useState<number | null>(null)

  // Estado derivado, no sincronizado con un efecto: el iframe existe solo
  // mientras siga abierta la misma apertura en la que se pidió. Al cerrar,
  // `openId` cambia y React desmonta el nodo, así que el audio se corta de
  // verdad; ocultarlo con CSS lo dejaría sonando sin forma de pararlo. Y al
  // reabrir la ficha vuelve a aparecer el botón en lugar de arrancar solo.
  const active = openSlug === slug && listeningAt === openId

  if (!active) {
    return (
      <button type="button" className="mix-listen" onClick={() => setListeningAt(openId)}>
        {`Listen · ${mix.title}`}
      </button>
    )
  }

  return (
    <div className="mix-embed">
      <iframe
        title={`${mix.title} on ${PLATFORM_NAMES[mix.platform]}`}
        src={embedSrc(mix)}
        height={PLAYER_HEIGHT[mix.platform]}
        loading="lazy"
        /* auto_play en la URL necesita este permiso; es Permissions Policy, no CSP */
        allow="autoplay"
      />
    </div>
  )
}
