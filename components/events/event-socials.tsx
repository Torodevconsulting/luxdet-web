import { luxdetSocials } from "@/content/site"
import { SOCIAL_LABELS, type Social } from "@/lib/social"

// Bloque de redes de la página de evento. Server Component: son enlaces, no
// necesitan JavaScript ni cargan nada de terceros hasta que alguien pulsa.
//
// Las cuentas de Luxdet salen siempre; las del evento, si las declara, se
// añaden detrás. Así una noche presentada por otra marca (Grovhaus) enseña las
// dos, y una noche sin cuentas propias nunca se queda con el bloque vacío.

export function EventSocials({ socials }: { socials?: Social[] }) {
  const accounts = [...luxdetSocials, ...(socials ?? [])]

  // No debería ocurrir mientras luxdetSocials tenga algo, pero si alguien lo
  // vacía es mejor no dejar un encabezado suelto sobre la nada.
  if (accounts.length === 0) return null

  return (
    <div className="event-socials">
      <h2 className="section-kicker">Follow</h2>

      <ul className="event-socials-list">
        {accounts.map((account) => (
          <li key={account.url}>
            <a
              className="event-social"
              href={account.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* El handle identifica la cuenta cuando hay dos en la misma
                  fila; sin él, el nombre de la plataforma es lo único que
                  tenemos. El sufijo va aparte para poder atenuarlo por CSS. */}
              <span className="event-social-name">{account.handle ?? SOCIAL_LABELS[account.platform]}</span>
              {account.handle && (
                <span className="event-social-platform">{SOCIAL_LABELS[account.platform]}</span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
