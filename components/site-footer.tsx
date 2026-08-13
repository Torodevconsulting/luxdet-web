import Link from "next/link"
import { CookieSettingsLink } from "@/components/consent/cookie-settings-link"
import { contactEmail, developer, instagram } from "@/content/site"

export function SiteFooter() {
  return (
    <footer id="contact">
      <div className="container">
        <div className="footer-cta">
          <a href={`mailto:${contactEmail}`}>LET&apos;S — DANCE</a>
        </div>

        <div className="divider"></div>

        {/* Sin style en línea: era lo último que quedaba del template de v0 y
            lo que bloqueaba quitar 'unsafe-inline' de style-src en la CSP. */}
        <div className="footer-meta">
          <div>© 2026 LUXDET CULTURE All Rights Reserved</div>
          <div className="footer-socials">
            <a
              className="footer-link"
              href={instagram.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {instagram.handle}
            </a>
            {/* El pie es donde se busca por costumbre, aunque el enlace que de
                verdad se usa es el que va bajo el botón del formulario. */}
            <Link className="footer-link" href="/privacy">
              Privacy
            </Link>
            {/* Reabre el banner. Obligatorio poder cambiar de opinión: un
                consentimiento que no se puede revocar no es consentimiento. */}
            <CookieSettingsLink />
          </div>
          <div>OHIO, USA</div>
        </div>

        <p className="footer-credit">
          {"Developed by "}
          <a
            className="footer-credit-link"
            href={developer.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {developer.name}
          </a>
        </p>
      </div>
    </footer>
  )
}
