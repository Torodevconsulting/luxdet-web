"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react"

// Isla de cliente que gobierna un único <dialog> para toda la rejilla.
//
// El contenido de las fichas NO vive aquí: llega ya renderizado desde el
// servidor por la prop `panels`, así que las bios están en el HTML servido.
// Al cliente solo va el estado de apertura y el montaje del reproductor.

type ResidentDialogContext = {
  /** Slug del residente abierto, o null si el diálogo está cerrado. */
  openSlug: string | null
  /**
   * Sube en cada apertura. Sirve para que el reproductor sepa si sigue en la
   * misma apertura en la que se pulsó LISTEN: comparando contra esto, el iframe
   * se desmonta al cerrar y el botón vuelve a su sitio al reabrir, sin
   * necesidad de un efecto que resetee nada.
   */
  openId: number
  open: (slug: string, trigger: HTMLElement) => void
  close: () => void
}

const DialogContext = createContext<ResidentDialogContext | null>(null)

export function useResidentDialog() {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error("useResidentDialog debe usarse dentro de <ResidentDialogRoot>")
  }
  return context
}

export function ResidentDialogRoot({
  children,
  panels,
}: {
  children: ReactNode
  panels: ReactNode
}) {
  // Un solo objeto para que el slug y el id de apertura no se desincronicen.
  const [opened, setOpened] = useState<{ slug: string; id: number } | null>(null)
  const openSlug = opened?.slug ?? null
  const openId = opened?.id ?? 0

  const dialogRef = useRef<HTMLDialogElement>(null)
  // Se guarda para devolverle el foco al cerrar.
  const triggerRef = useRef<HTMLElement | null>(null)

  const open = useCallback((slug: string, trigger: HTMLElement) => {
    triggerRef.current = trigger
    setOpened((previous) => ({ slug, id: (previous?.id ?? 0) + 1 }))
  }, [])

  const close = useCallback(() => {
    dialogRef.current?.close()
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !openSlug) return

    // Los paneles están todos en el DOM; solo se muestra el que toca.
    dialog.querySelectorAll<HTMLElement>("[data-resident]").forEach((panel) => {
      panel.hidden = panel.dataset.resident !== openSlug
    })

    // Con un solo diálogo y varias fichas, el nombre accesible tiene que
    // reapuntarse en cada apertura o el lector anunciaría siempre el mismo.
    dialog.setAttribute("aria-labelledby", `resident-name-${openSlug}`)

    dialog.showModal()

    // showModal() no bloquea el scroll del fondo en todos los navegadores. Se
    // hace con una clase y no con style en línea para no volver a meter estilos
    // inline (pendiente de quitar 'unsafe-inline' de la CSP).
    document.body.classList.add("dialog-open")

    return () => {
      document.body.classList.remove("dialog-open")
    }
  }, [openSlug])

  // Se dispara tanto al pulsar Escape como al llamar a close().
  const handleClose = () => {
    setOpened(null)
    triggerRef.current?.focus()
  }

  // Clic en el ::backdrop: el propio <dialog> es el target, no sus hijos.
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      dialogRef.current?.close()
    }
  }

  return (
    <DialogContext.Provider value={{ openSlug, openId, open, close }}>
      {children}

      <dialog
        ref={dialogRef}
        className="resident-dialog"
        onClose={handleClose}
        onClick={handleClick}
      >
        <div className="resident-dialog-inner">
          <button type="button" className="dialog-close" onClick={close} aria-label="Close profile">
            Close
          </button>
          {panels}
        </div>
      </dialog>
    </DialogContext.Provider>
  )
}
