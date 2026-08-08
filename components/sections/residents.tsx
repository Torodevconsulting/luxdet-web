import Image from "next/image"
import { residents, type Resident, type SocialPlatform } from "@/content/residents"
import { ResidentMixPlayer } from "@/components/residents/resident-mix-player"
import { ResidentDialogRoot } from "@/components/residents/resident-dialog-root"
import { ResidentTrigger } from "@/components/residents/resident-trigger"

const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  soundcloud: "SoundCloud",
  mixcloud: "Mixcloud",
  ra: "Resident Advisor",
}

const PLATFORM_NAMES = { soundcloud: "SoundCloud", mixcloud: "Mixcloud" } as const

/**
 * Ficha del residente. Componente de servidor: va dentro del <dialog> y por
 * tanto en el HTML servido, aunque no se vea hasta que se abre.
 *
 * Arranca con `hidden`; el cliente lo destapa al abrir su residente.
 */
function ResidentPanel({ resident }: { resident: Resident }) {
  return (
    <article className="resident-panel" data-resident={resident.slug} hidden>
      <h3 className="resident-panel-name" id={`resident-name-${resident.slug}`}>
        {resident.name}
      </h3>
      <p className="resident-panel-role">{resident.role}</p>

      {resident.bio?.map((paragraph) => (
        <p className="resident-bio" key={paragraph}>
          {paragraph}
        </p>
      ))}

      {resident.socials && resident.socials.length > 0 && (
        <ul className="resident-socials">
          {resident.socials.map((social) => (
            <li key={social.url}>
              <a
                className="resident-social"
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {SOCIAL_LABELS[social.platform]}
              </a>
            </li>
          ))}
        </ul>
      )}

      {resident.mixes && resident.mixes.length > 0 && (
        <div className="resident-mixes">
          {resident.mixes.map((mix) => (
            <div className="resident-mix" key={mix.url}>
              <ResidentMixPlayer slug={resident.slug} mix={mix} />
              {/* Atribución obligatoria: autor a la vista y enlace al original */}
              <p className="mix-credit">
                <span>{resident.name}</span>
                {" — "}
                <a href={mix.url} target="_blank" rel="noopener noreferrer">
                  {`${mix.title} on ${PLATFORM_NAMES[mix.platform]}`}
                </a>
              </p>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}

export function Residents() {
  // Sin bio no hay ficha que abrir, así que tampoco panel.
  const withProfile = residents.filter((resident) => resident.bio && resident.bio.length > 0)

  return (
    <section id="residents">
      <div className="container">
        <h2 className="section-kicker">Click and listen our residents</h2>

        <ResidentDialogRoot
          panels={withProfile.map((resident) => (
            <ResidentPanel key={resident.slug} resident={resident} />
          ))}
        >
          <ul className="residents-grid">
            {residents.map((resident) => {
              const photo = (
                <Image
                  src={resident.image}
                  alt={resident.imageAlt}
                  className="resident-photo"
                  sizes="(max-width: 767px) 100vw, (max-width: 1024px) 50vw, 30vw"
                />
              )

              return (
                <li className="resident-card" key={resident.slug}>
                  {resident.bio && resident.bio.length > 0 ? (
                    <ResidentTrigger slug={resident.slug} name={resident.name}>
                      {photo}
                    </ResidentTrigger>
                  ) : (
                    // Sin ficha no es interactiva: nada de botones que no hacen nada.
                    <div className="resident-media">{photo}</div>
                  )}
                  <h3 className="resident-name">{resident.name}</h3>
                  <p className="resident-role">{resident.role}</p>
                </li>
              )
            })}
          </ul>
        </ResidentDialogRoot>
      </div>
    </section>
  )
}
