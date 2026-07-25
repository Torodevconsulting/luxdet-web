import Image from "next/image"
import mainRoomImage from "@/public/main1.jpg"
import djBlueImage from "@/public/dj_blue1.jpg"
import djGreenImage from "@/public/dj_green1.jpg"

// Cuatro hijos solapados: dos imágenes, el bloque naranja de texto
// (comp-item-3, sin imagen) y un cuarto div posicionado en absoluto.
export function Composition() {
  return (
    <section>
      <div className="container composition">
        <div className="comp-item-1">
          <Image
            src={mainRoomImage}
            className="comp-image"
            alt="Packed main room swept by green laser beams beneath a mirror ball"
            sizes="(max-width: 767px) 100vw, 45vw"
          />
        </div>
        <div className="comp-item-2">
          <Image
            src={djBlueImage}
            className="comp-image"
            alt="Club crowd in blue and pink light with the DJ booth in the background"
            sizes="(max-width: 767px) 100vw, 60vw"
          />
        </div>
        <div className="comp-item-3">
          <div
            style={{
              background: "var(--accent)",
              padding: "40px",
              color: "white",
            }}
          >
            <h4 style={{ fontFamily: "var(--syne)", fontSize: "2rem" }}>LAYERED DEPTH</h4>
            <p style={{ marginTop: "20px" }}>
              We believe in depth—both in meaning and in visual manifestation. Overlapping elements create a
              zine-like chaos that is meticulously organized.
            </p>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "400px",
            zIndex: 10,
          }}
        >
          <Image
            src={djGreenImage}
            className="comp-image"
            alt="DJ mixing behind laptops under green light with the crowd in the foreground"
            sizes="(max-width: 767px) 100vw, (max-width: 1024px) 300px, 400px"
          />
        </div>
      </div>
    </section>
  )
}
