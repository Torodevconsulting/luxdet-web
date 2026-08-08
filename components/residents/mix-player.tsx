"use client"

import type { Mix } from "@/content/residents"

// Reproductor embebido, sin estado propio ni conocimiento de dónde vive.
//
// Antes leía el contexto del diálogo de residentes, lo que lo ataba a ese modal:
// montarlo en cualquier otro sitio lanzaba, porque useResidentDialog() exige su
// provider. Ahora `active` llega por props y cada consumidor decide qué
// significa "activo":
//
//   - components/residents/resident-mix-player.tsx → mientras siga abierta la
//     misma apertura del diálogo en la que se pulsó LISTEN.
//   - components/events/event-lineup.tsx → mientras sea el DJ del line-up cuyo
//     LISTEN se pulsó el último.
//
// Lo que NO es negociable en ninguno de los dos: cuando `active` pasa a false,
// React desmonta el <iframe> y el audio se corta de verdad. Ocultarlo con CSS lo
// dejaría sonando sin forma de pararlo.
//
// Y la primera puerta sigue igual: hasta que se pulsa LISTEN no hay iframe, así
// que la página no descarga cientos de KB de terceros y ese clic vale además
// como gesto de consentimiento del embed.

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

export function MixPlayer({
  mix,
  active,
  onListen,
}: {
  mix: Mix
  active: boolean
  onListen: () => void
}) {
  if (!active) {
    return (
      <button type="button" className="mix-listen" onClick={onListen}>
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
