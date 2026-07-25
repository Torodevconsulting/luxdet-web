"use client"

import { useEffect, useRef } from "react"

// Halo que sigue al cursor. Isla de cliente: el resto de la página es servidor.
export function CursorBlob() {
  const blobRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY
      const blob = blobRef.current
      if (blob) {
        blob.style.transform = `translate(${x - 200}px, ${y - 200}px)`
      }
    }
    document.addEventListener("mousemove", handleMouseMove)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return <div className="blob" id="cursor-blob" ref={blobRef}></div>
}
