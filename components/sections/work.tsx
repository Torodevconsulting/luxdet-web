import Image, { type StaticImageData } from "next/image"
import girlPartyingImage from "@/public/girl_partying1.jpg"
import djSetupImage from "@/public/dj_setup_1.jpg"
import bwPartyGirlImage from "@/public/bw_partygirl.jpg"

type Project = {
  index: string
  category: string
  title: string
  description: string
  year: string
  image: StaticImageData
  alt: string
  label: string
  reversed?: boolean
}

const projects: Project[] = [
  {
    index: "001",
    category: "PRIVÉ",
    title: "HOUSE PARTIES",
    description:
      "A deep-dive into monochromatic textures and high-contrast digital layouts for a Parisian couture house.",
    year: "2024",
    image: girlPartyingImage,
    alt: "Woman dancing with her arm raised on the dance floor under teal and pink lights",
    label: "DANCE",
  },
  {
    index: "002",
    category: "ARCHITECTURE",
    title: "TECHNO PARTIES",
    description:
      "Conceptual web experience for a structural engineering firm focused on monolithic concrete structures.",
    year: "2023",
    image: djSetupImage,
    alt: "DJ working the decks seen from behind, bathed in deep red light",
    label: "DANCING",
    reversed: true,
  },
  {
    index: "001",
    category: "PRIVÉ",
    title: "HOUSE PARTIES",
    description:
      "A deep-dive into monochromatic textures and high-contrast digital layouts for a Parisian couture house.",
    year: "2024",
    image: bwPartyGirlImage,
    alt: "Black and white shot of people dancing shoulder to shoulder in a packed club",
    label: "SHADOW",
  },
]

// Los textos van como una sola expresión (`${a} / ${b}`) y no interpolados
// junto a texto literal: React inserta un <!-- --> entre nodos de texto
// adyacentes y eso alteraría el HTML.
function ProjectRow({ index, category, title, description, year, image, alt, label, reversed }: Project) {
  return (
    <div className="project-row" style={reversed ? { flexDirection: "row-reverse" } : undefined}>
      <div className="project-info">
        <span style={{ fontFamily: "var(--syne)", color: "var(--accent)" }}>{`${index} / ${category}`}</span>
        <h3 className="huge-type" style={{ fontSize: "6rem", margin: "20px 0" }}>
          {title}
        </h3>
        <p>{description}</p>
        <div className="divider"></div>
        <p>{`YEAR: ${year}`}</p>
      </div>
      <div className="project-media">
        <Image
          src={image}
          alt={alt}
          className="project-image"
          sizes="(max-width: 767px) 100vw, (max-width: 1024px) 60vw, 800px"
        />
        <div
          className="floating-label huge-type outline-text"
          style={reversed ? { fontSize: "8rem", right: "auto", left: "-100px" } : { fontSize: "8rem" }}
        >
          {label}
        </div>
      </div>
    </div>
  )
}

export function Work() {
  return (
    <section id="work" className="container">
      <div className="sticky-type">DANCE VENUES</div>
      {projects.map((project, i) => (
        <ProjectRow key={i} {...project} />
      ))}
    </section>
  )
}
