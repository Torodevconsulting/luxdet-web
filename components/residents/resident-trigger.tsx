"use client"

import type { ReactNode } from "react"
import { useResidentDialog } from "./resident-dialog-root"

// <button> y no <div>: abre un diálogo, o sea que actúa. Con un div habría que
// reimplementar a mano el foco, Enter, Space y el rol.
//
// La foto llega como children ya renderizada en el servidor.
export function ResidentTrigger({
  slug,
  name,
  children,
}: {
  slug: string
  name: string
  children: ReactNode
}) {
  const { open } = useResidentDialog()

  return (
    <button
      type="button"
      className="resident-media resident-trigger"
      aria-haspopup="dialog"
      aria-label={`Open profile of ${name}`}
      onClick={(event) => open(slug, event.currentTarget)}
    >
      {children}
    </button>
  )
}
