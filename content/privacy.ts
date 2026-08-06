// ============================================================================
// POLÍTICA DE PRIVACIDAD
//
// ⚠️  CONTIENE MARCADORES SIN CONFIRMAR — buscar "TODO:" antes de publicar.
//     Los valores marcados son suposiciones razonables, no datos oficiales.
//
// ⚠️  Este texto NO es asesoramiento legal. Es una política estándar para una
//     web de eventos que recoge datos de contacto. Si Luxdet empieza a hacer
//     publicidad de pago, remarketing o email marketing, debe revisarla un
//     abogado con licencia en Ohio.
// ============================================================================

export const privacyPolicy = {
  // Título de la página y <title> del documento.
  title: "Privacy Policy",

  // Descripción de <meta>. La página va con noindex, así que esto no se usa en
  // resultados de búsqueda: aparece en la preview al compartir el enlace, que es
  // como suele llegar la gente a una política de privacidad.
  description:
    "How Luxdet Culture collects, uses and stores the information you share through luxdetculture.com.",

  // Encabezado del bloque de contacto del final de la página.
  contactHeading: "Contact",

  // TODO: nombre legal real. ¿Es una LLC? ¿"Luxdet Culture LLC"?
  legalName: "Luxdet Culture",

  // TODO: dirección física del negocio. Obligatoria para CAN-SPAM y esperable
  // en cualquier política de privacidad. No hace falta que sea personal.
  address: "Columbus, Ohio, United States",

  // TODO: ¿este mismo correo o uno específico de privacidad?
  contactEmail: "info.luxdetculture@gmail.com",

  // TODO: confirmar criterio de retención. 24 meses es lo habitual.
  retentionMonths: 24,

  lastUpdated: "2026-08-05",

  sections: [
    {
      heading: "Who we are",
      body: [
        "Luxdet Culture produces electronic music events in Columbus, Ohio. This policy explains what information we collect through luxdetculture.com, why we collect it, and what we do with it.",
        "If you have questions about anything here, write to us at the address at the bottom of this page.",
      ],
    },
    {
      heading: "What we collect",
      body: [
        "When you fill in our contact form, we collect your name, email address, phone number, the type of enquiry you selected, and the message you wrote. We collect this because it is what we need to answer you.",
        "We also collect anonymous, aggregated traffic data: which pages get visited, roughly where visitors come from, and what kind of device they use. This data is not tied to you as an individual and we cannot use it to identify you.",
        "We do not collect payment information. Tickets are sold by third-party platforms, and we never see your card details.",
      ],
    },
    {
      heading: "Cookies",
      body: [
        "This site does not use tracking or advertising cookies. Our traffic measurement works without them.",
        "Two exceptions, both of which happen only because of something you do: our anti-spam check may store a short-lived token when you submit the contact form, and embedded music players from SoundCloud or Mixcloud set their own cookies if — and only if — you press play on a mix. If you never press play, those players never load.",
      ],
    },
    {
      heading: "Who we share it with",
      body: [
        "We do not sell your information. We do not share it with advertisers.",
        "We use a small number of service providers to run this site, and your information passes through them: Vercel (hosting and anonymous traffic measurement), Resend (delivering the email your contact form generates), and Cloudflare (spam protection on the form). Each of them has its own privacy policy.",
        // TODO: añadir cualquier otro proveedor — CRM, email marketing, etc.
        "We may also disclose information if the law requires it.",
      ],
    },
    {
      heading: "How long we keep it",
      body: [
        // TODO: ajustar si el criterio de retención cambia
        "We keep contact form messages for up to 24 months, so we can pick up a conversation where it left off. After that we delete them.",
        "Anonymous traffic data is retained by our analytics provider under their own schedule and is never linked back to you.",
      ],
    },
    {
      heading: "Your choices",
      body: [
        "You can ask us what information we hold about you, ask us to correct it, or ask us to delete it. Write to the address below and we will respond within a reasonable time.",
        "Depending on where you live, you may have additional rights under local privacy law. We will honour those requests regardless of where you are.",
      ],
    },
    {
      heading: "Children",
      body: [
        "This site is not directed at children under 13, and we do not knowingly collect information from them. Our events carry their own age requirements, which are listed on each event page.",
      ],
    },
    {
      heading: "Changes",
      body: [
        "If we change this policy, we will update the date at the top of the page. Material changes will be noted here rather than made quietly.",
      ],
    },
  ],
} as const