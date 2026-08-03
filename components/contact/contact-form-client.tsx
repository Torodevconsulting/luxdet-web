"use client"

import Script from "next/script"
import { useRef, useState, type FormEvent } from "react"
import { INQUIRY_TYPES, MESSAGE_MAX } from "@/lib/contact"

// Única isla de cliente del formulario, y la primera nueva desde el refactor.
// Está justificada porque Turnstile no existe sin JavaScript: necesita ejecutar
// su script en la página para resolver el desafío.
//
// Consecuencia a tener presente: sin JS este formulario no funciona. Por eso el
// footer mantiene un mailto visible como vía alternativa.

declare global {
  interface Window {
    turnstile?: { reset: (container?: string | HTMLElement) => void }
  }
}

type Status = "idle" | "submitting" | "success" | "error"

export function ContactFormClient({ siteKey }: { siteKey: string }) {
  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const widgetRef = useRef<HTMLDivElement>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === "submitting") return

    const form = event.currentTarget
    const data = new FormData(form)

    setStatus("submitting")
    setErrorMessage("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          inquiryType: data.get("inquiryType"),
          message: data.get("message"),
          // Turnstile inyecta este campo oculto dentro del formulario.
          turnstileToken: data.get("cf-turnstile-response"),
        }),
      })

      const result: { error?: string } = await response.json().catch(() => ({}))

      if (!response.ok) {
        setErrorMessage(result.error ?? "Something went wrong. Please try again.")
        setStatus("error")
        return
      }

      form.reset()
      setStatus("success")
    } catch {
      setErrorMessage("Could not reach the server. Please try again.")
      setStatus("error")
    } finally {
      // El token es de un solo uso: sin reiniciar el widget, un segundo intento
      // enviaría uno ya gastado y el servidor lo rechazaría.
      window.turnstile?.reset(widgetRef.current ?? undefined)
    }
  }

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />

      <form className="contact-form" onSubmit={handleSubmit} noValidate={false}>
        <div className="contact-field">
          <label htmlFor="contact-name">Name</label>
          <input id="contact-name" name="name" type="text" autoComplete="name" maxLength={100} required />
        </div>

        <div className="contact-field">
          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} required />
        </div>

        <div className="contact-field">
          <label htmlFor="contact-phone">Phone</label>
          <input id="contact-phone" name="phone" type="tel" autoComplete="tel" maxLength={30} required />
        </div>

        <div className="contact-field">
          <label htmlFor="contact-type">Inquiry type</label>
          <select id="contact-type" name="inquiryType" defaultValue={INQUIRY_TYPES[0]} required>
            {INQUIRY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="contact-field contact-field--full">
          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            name="message"
            rows={6}
            minLength={10}
            maxLength={MESSAGE_MAX}
            required
          />
        </div>

        {/* `cf-turnstile` no es decorativa: es la clase por la que el script de
            Cloudflare localiza el contenedor y monta el widget. */}
        <div
          className="cf-turnstile contact-turnstile"
          ref={widgetRef}
          data-sitekey={siteKey}
          data-theme="dark"
        />

        <div className="contact-actions">
          <button className="cta-button" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending…" : "Send message"}
          </button>
        </div>

        {/* Anuncios para lector de pantalla: `status` no interrumpe, `alert` sí,
            que es lo que corresponde a cada caso. */}
        <p className="contact-feedback contact-feedback--ok" role="status">
          {status === "success"
            ? "Thanks — your message is on its way. We'll get back to you within 2 business days."
            : ""}
        </p>
        <p className="contact-feedback contact-feedback--error" role="alert">
          {status === "error" ? errorMessage : ""}
        </p>
      </form>
    </>
  )
}
