import { ContactFormClient } from "@/components/contact/contact-form-client"
import { contactEmail } from "@/content/site"

// Contacto de negocio, no newsletter: sustituye a la sección MAILING LIST que
// estaba prevista. Prometer un boletín que nunca sale acaba en marcas de spam.
//
// El markup de alrededor es de servidor; solo el formulario en sí es una isla
// de cliente, porque Turnstile necesita JavaScript.
export function ContactForm() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  return (
    <section id="contact-form" className="contact-section">
      <div className="container">
        <h2 className="section-kicker">Get in touch</h2>
        <p className="contact-intro">
          Bookings, partnerships and venue rentals. Tell us what you have in mind and we&apos;ll
          get back to you within 2 business days.
        </p>

        {siteKey ? (
          <ContactFormClient siteKey={siteKey} />
        ) : (
          // Sin site key el widget no puede montarse y el servidor rechazaría
          // cualquier envío, así que se ofrece el correo en lugar de un
          // formulario que siempre falla.
          <p className="contact-fallback">
            The form is being set up. In the meantime, write to{" "}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
          </p>
        )}
      </div>
    </section>
  )
}
