import { z } from "zod"

// Contrato del formulario de contacto. Vive aquí y no en el route handler para
// que el cliente y el servidor compartan la misma lista de tipos de consulta.

export const INQUIRY_TYPES = ["DJ booking", "Partnership", "Venue rental"] as const

export type InquiryType = (typeof INQUIRY_TYPES)[number]

/** Tope del cuerpo de la petición. Un mensaje de 2000 caracteres cabe de sobra. */
export const MAX_BODY_BYTES = 8 * 1024

export const MESSAGE_MAX = 2000

/**
 * El `required` del HTML es comodidad para quien rellena el formulario, no una
 * defensa: /api/contact es una URL pública y se puede llamar con curl saltándose
 * el navegador entero. Esta es la validación que cuenta.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  // 254 es el máximo de una dirección de correo según el RFC 5321.
  email: z.email("Enter a valid email").max(254),
  phone: z.string().trim().min(5, "Enter a valid phone number").max(30),
  inquiryType: z.enum(INQUIRY_TYPES),
  message: z.string().trim().min(10, "Tell us a bit more").max(MESSAGE_MAX),
})

export type ContactPayload = z.infer<typeof contactSchema>

/**
 * Escapa los caracteres con significado en HTML.
 *
 * Hoy el correo se envía solo como texto plano, donde esto no haría falta. Se
 * aplica igualmente porque esa decisión puede cambiar: el día que alguien añada
 * una versión HTML del email, la inyección aparecería sin que nada avise. Sanear
 * en el origen deja el dato seguro sea cual sea el destino.
 */
export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
