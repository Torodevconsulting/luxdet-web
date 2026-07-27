import Image from "next/image"
// El import estático da a next/image las dimensiones reales, así que no hay
// salto de layout al cargar.
import heroImage from "@/public/dj_pink1.jpg"

export function Hero() {
  return (
    <section id="hero">
      <Image
        src={heroImage}
        alt="Crowded club dance floor lit by pink and purple neon, with a DJ performing behind the booth"
        className="hero-img"
        fill
        priority
        sizes="100vw"
        quality={90}
        placeholder="blur"
      />
      <div className="hero-title-container">
        <span className="huge-type hero-title parallax-text" data-speed="-2">
          {/* Los tramos se apilan en móvil (LUX / DET), ver globals.css */}
          <span className="hero-title-part">LUX</span>
          <span className="hero-title-part">DET</span>
        </span>
        <span className="huge-type hero-tagline outline-text parallax-text" data-speed="2">
          CULTURE
        </span>
      </div>
    </section>
  )
}
