import { NextResponse } from "next/server"
import { MAX_BODY_BYTES, contactSchema, escapeHtml } from "@/lib/contact"

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
const RESEND_ENDPOINT = "https://api.resend.com/emails"

// PROVISIONAL mientras luxdetculture.com termina de verificarse en Resend:
// hasta entonces solo se puede enviar desde onboarding@resend.dev, y además
// únicamente a la dirección de la cuenta.
const FROM_ADDRESS = process.env.CONTACT_FROM_EMAIL ?? "LUXDET <onboarding@resend.dev>"

/** Respuesta genérica: los detalles van al log, nunca al cliente. */
function fail(status: number, error: string) {
  return NextResponse.json({ error }, { status })
}

async function passesTurnstile(token: unknown) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.error("[contact] falta TURNSTILE_SECRET_KEY")
    return false
  }
  if (typeof token !== "string" || token.length === 0) return false

  const body = new URLSearchParams({ secret, response: token })
  const response = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body })

  if (!response.ok) {
    console.error("[contact] siteverify respondió", response.status)
    return false
  }

  const result: { success?: boolean; "error-codes"?: string[] } = await response.json()
  if (!result.success) {
    console.error("[contact] Turnstile rechazó el token:", result["error-codes"])
  }
  return result.success === true
}

export async function POST(request: Request) {
  // 0. Tamaño, antes de leer nada.
  const declaredLength = Number(request.headers.get("content-length") ?? 0)
  if (declaredLength > MAX_BODY_BYTES) {
    return fail(413, "Message too long.")
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return fail(400, "Invalid request.")
  }

  // 1. Turnstile primero: si no ha pasado el desafío no se gasta cuota de
  //    Resend, ni se procesa nada más.
  const token = (payload as { turnstileToken?: unknown })?.turnstileToken
  if (!(await passesTurnstile(token))) {
    return fail(400, "Verification failed. Please try again.")
  }

  // 2. Validación real del contenido.
  const parsed = contactSchema.safeParse(payload)
  if (!parsed.success) {
    return fail(400, "Please check the form and try again.")
  }

  const { name, email, phone, inquiryType, message } = parsed.data

  const to = process.env.CONTACT_TO_EMAIL
  const apiKey = process.env.RESEND_API_KEY
  if (!to || !apiKey) {
    console.error("[contact] faltan CONTACT_TO_EMAIL o RESEND_API_KEY")
    return fail(500, "Something went wrong. Please email us instead.")
  }

  // 3. Envío. Texto plano, con los datos ya saneados en lib/contact.
  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    phone: escapeHtml(phone),
    message: escapeHtml(message),
  }

  const text = [
    `Inquiry type: ${inquiryType}`,
    `Name: ${safe.name}`,
    `Email: ${safe.email}`,
    `Phone: ${safe.phone}`,
    "",
    safe.message,
  ].join("\n")

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [to],
        // Permite responder desde la bandeja sin copiar la dirección a mano.
        reply_to: email,
        // El tipo va en el asunto para poder filtrar en el buzón.
        subject: `[${inquiryType}] ${safe.name} — luxdetculture.com`,
        text,
      }),
    })

    if (!response.ok) {
      console.error("[contact] Resend respondió", response.status, await response.text())
      return fail(502, "Something went wrong. Please email us instead.")
    }
  } catch (error) {
    console.error("[contact] fallo de red al llamar a Resend:", error)
    return fail(502, "Something went wrong. Please email us instead.")
  }

  return NextResponse.json({ ok: true })
}
