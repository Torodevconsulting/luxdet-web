import { about } from "@/content/about"

export function Intro() {
  return (
    <section id="about">
      <div className="container">
        <div className="intro-body">
          <p className="section-kicker">{about.kicker}</p>
          <h2 className="intro-title">{about.title}</h2>
          {about.paragraphs.map((paragraph) => (
            <p className="intro-paragraph" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
