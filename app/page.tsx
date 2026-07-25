"use client"

import { useEffect } from "react"
import Image from "next/image"
// Fotos propias de Luxdet. El import estático da a next/image las dimensiones
// reales, así que no hay salto de layout al cargar.
import heroImage from "@/public/dj_pink1.jpg"
import girlPartyingImage from "@/public/girl_partying1.jpg"
import djSetupImage from "@/public/dj_setup_1.jpg"
import bwPartyGirlImage from "@/public/bw_partygirl.jpg"
import mainRoomImage from "@/public/main1.jpg"
import djBlueImage from "@/public/dj_blue1.jpg"
import djGreenImage from "@/public/dj_green1.jpg"

export default function Home() {
  useEffect(() => {
    // Mouse Blob Follower
    const blob = document.getElementById("cursor-blob")
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY
      if (blob) {
        blob.style.transform = `translate(${x - 200}px, ${y - 200}px)`
      }
    }
    document.addEventListener("mousemove", handleMouseMove)

    // Parallax Effect
    const handleScroll = () => {
      const scroll = window.pageYOffset

      // Hero parallax
      const parallaxTexts = document.querySelectorAll(".parallax-text")
      parallaxTexts.forEach((text) => {
        const speed = text.getAttribute("data-speed")
        if (speed) {
          // Acotado: sin tope el título se arrastraba fuera del viewport al scrollear
          const shift = scroll * Number.parseFloat(speed) * 0.1
          ;(text as HTMLElement).style.transform = `translateX(${Math.max(-40, Math.min(40, shift))}px)`
        }
      })

      // La imagen del hero es estática: no lleva parallax ni escalado

      // Floating labels in project section
      const labels = document.querySelectorAll(".floating-label")
      labels.forEach((label, index) => {
        const direction = index % 2 === 0 ? 1 : -1
        ;(label as HTMLElement).style.transform = `translateY(${scroll * 0.1 * direction}px)`
      })
    }
    window.addEventListener("scroll", handleScroll)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <>
      <div className="blob" id="cursor-blob"></div>

      <nav>
        <div className="logo">LUXDET ©26</div>
        <ul className="nav-links">
          <li>
            <a href="#work">Events</a>
          </li>
          <li>
            <a href="#about">Tickets</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>

      <main>
        {/* HERO SECTION */}
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
              EVENTS
            </span>
          </div>
        </section>

        {/* INTRO */}
        <section id="about">
          <div className="container">
            <div style={{ maxWidth: "800px" }}>
              <h2
                style={{
                  fontSize: "3rem",
                  fontFamily: "var(--syne)",
                  marginBottom: "40px",
                }}
              >
                WE BUILD DIGITAL ARTIFACTS THAT SHATTER THE NOISE.
              </h2>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 300,
                  color: "#888",
                }}
              >
                Visceral aesthetic. Technical precision. We operate at the intersection of high-fashion editorial and
                brutalist digital architecture.
              </p>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="scrolling-marquee">
          <div className="marquee-inner">
            <span className="huge-type outline-text">LUXDET — UNDERGROUND — NONSTOP — DANCE — </span>
            <span className="huge-type outline-text">LUXDET — UNDERGROUND — NONSTOP — DANCE — </span>
          </div>
        </div>

        {/* WORK SECTION */}
        <section id="work" className="container">
          <div className="sticky-type">DANCE VENUES</div>

          {/* Project 1 */}
          <div className="project-row">
            <div className="project-info">
              <span style={{ fontFamily: "var(--syne)", color: "var(--accent)" }}>001 / PRIVÉ</span>
              <h3 className="huge-type" style={{ fontSize: "6rem", margin: "20px 0" }}>
                HOUSE PARTIES
              </h3>
              <p>
                A deep-dive into monochromatic textures and high-contrast digital layouts for a Parisian couture house.
              </p>
              <div className="divider"></div>
              <p>YEAR: 2024</p>
            </div>
            <div className="project-media">
              <Image
                src={girlPartyingImage}
                alt="Woman dancing with her arm raised on the dance floor under teal and pink lights"
                className="project-image"
                sizes="(max-width: 767px) 100vw, (max-width: 1024px) 60vw, 800px"
              />
              <div className="floating-label huge-type outline-text" style={{ fontSize: "8rem" }}>
                DANCE
              </div>
            </div>
          </div>

          {/* Project 2 */}
          <div className="project-row" style={{ flexDirection: "row-reverse" }}>
            <div className="project-info">
              <span style={{ fontFamily: "var(--syne)", color: "var(--accent)" }}>002 / ARCHITECTURE</span>
              <h3 className="huge-type" style={{ fontSize: "6rem", margin: "20px 0" }}>
                TECHNO PARTIES
              </h3>
              <p>
                Conceptual web experience for a structural engineering firm focused on monolithic concrete structures.
              </p>
              <div className="divider"></div>
              <p>YEAR: 2023</p>
            </div>
            <div className="project-media">
              <Image
                src={djSetupImage}
                alt="DJ working the decks seen from behind, bathed in deep red light"
                className="project-image"
                sizes="(max-width: 767px) 100vw, (max-width: 1024px) 60vw, 800px"
              />
              <div
                className="floating-label huge-type outline-text"
                style={{ fontSize: "8rem", right: "auto", left: "-100px" }}
              >
                DANCING
              </div>
            </div>
          </div>

          {/* Project 3 */}
          <div className="project-row">
            <div className="project-info">
              <span style={{ fontFamily: "var(--syne)", color: "var(--accent)" }}>001 / PRIVÉ</span>
              <h3 className="huge-type" style={{ fontSize: "6rem", margin: "20px 0" }}>
                HOUSE PARTIES
              </h3>
              <p>
                A deep-dive into monochromatic textures and high-contrast digital layouts for a Parisian couture house.
              </p>
              <div className="divider"></div>
              <p>YEAR: 2024</p>
            </div>
            <div className="project-media">
              <Image
                src={bwPartyGirlImage}
                alt="Black and white shot of people dancing shoulder to shoulder in a packed club"
                className="project-image"
                sizes="(max-width: 767px) 100vw, (max-width: 1024px) 60vw, 800px"
              />
              <div className="floating-label huge-type outline-text" style={{ fontSize: "8rem" }}>
                SHADOW
              </div>
            </div>
          </div>

        </section>

        {/* OVERLAPPING COMPOSITION SECTION */}
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

        {/* FOOTER */}
        <footer id="contact">
          <div className="container">
            <div className="footer-cta">
              <a href="mailto:hello@viscera.studio">LET&apos;S — DANCE</a>
            </div>
            <div className="divider"></div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "var(--syne)",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                color: "#555",
              }}
            >
              <div>© 2026 LUXDET EVENTS</div>
              <div style={{ display: "flex", gap: "30px" }}>
                <span>INSTAGRAM</span>
                <span>TWITTER/X</span>
                <span>BEHANCE</span>
              </div>
              <div>LOCATED IN OHIO, USA</div>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
