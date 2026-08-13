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

  // Actualizada al añadir Google Analytics: cambian "What we collect",
  // "Cookies", "Who we share it with", "How long we keep it" y "Your choices".
  lastUpdated: "2026-08-09",

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
        // Antes esto decía que los datos de tráfico eran anónimos y que no
        // podíamos identificar a nadie. Con GA4 eso dejó de ser cierto: el
        // client ID de la cookie _ga es un identificador seudónimo, no un dato
        // anónimo. Las dos analíticas se describen por separado porque no
        // hacen lo mismo ni ven al mismo público.
        "We measure traffic in two different ways, and they are not the same thing. The first counts page views without cookies and without identifying anyone — it runs for every visitor and there is nothing to opt out of, because there is nothing tied to you.",
        "The second is Google Analytics, and it only runs if you agree to it. It does use cookies: it gives your browser a random identifier so it can tell a returning visit from a new one. That identifier is not your name and we cannot look you up with it, but it is not anonymous either — it is a pseudonym that stays with your browser. If you decline, it never runs at all.",
        "We do not collect payment information. Tickets are sold by third-party platforms, and we never see your card details.",
      ],
    },
    {
      heading: "Cookies",
      body: [
        // Reescrita entera al añadir GA4. La versión anterior decía "this site
        // does not use tracking cookies", que con Google Analytics es
        // sencillamente falso.
        "This site sets no cookies at all until you choose to allow them, and we never use advertising cookies.",
        "If you accept analytics cookies, Google Analytics sets two: _ga and _ga_YJNZN2B7ZY. They last two years and hold the random identifier described above. Until you accept, nothing from Google is loaded — not the script, not a single request. If you decline, no Google cookie is ever set.",
        "Your answer is kept in this browser's local storage under \"luxdet:consent\". That is not a cookie, it never leaves your device and it is never sent to us: it exists so we don't ask you again on every page. You can change your answer at any time with the \"Cookies\" link at the bottom of any page.",
        "Two more, both of which happen only because of something you do: our anti-spam check may store a short-lived token when you submit the contact form, and embedded music players from SoundCloud or Mixcloud set their own cookies if — and only if — you press play on a mix. If you never press play, those players never load.",
      ],
    },
    {
      heading: "Who we share it with",
      body: [
        "We do not sell your information. We do not share it with advertisers.",
        "We use a small number of service providers to run this site, and your information passes through them: Vercel (hosting and cookieless traffic measurement), Google (Google Analytics — only if you accepted it), Resend (delivering the email your contact form generates), and Cloudflare (spam protection on the form). Each of them has its own privacy policy.",
        // TODO: añadir cualquier otro proveedor — CRM, email marketing, etc.
        "We may also disclose information if the law requires it.",
      ],
    },
    {
      heading: "How long we keep it",
      body: [
        // TODO: ajustar si el criterio de retención cambia
        "We keep contact form messages for up to 24 months, so we can pick up a conversation where it left off. After that we delete them.",
        // 14 meses: el máximo que ofrece GA4. Tiene que coincidir con
        // Admin → Data Settings → Data Retention en la interfaz de Google.
        "If you accepted Google Analytics, that data is kept for 14 months and then deleted automatically. We picked the longest window Google offers on purpose: with anything shorter we couldn't compare an event in August against the same month a year earlier, and that comparison is the whole reason we measure at all.",
        "Cookieless traffic counts are aggregated, are never linked back to you, and are retained by our hosting provider under their own schedule.",
      ],
    },
    {
      heading: "Your choices",
      body: [
        "You can change your mind about analytics cookies at any time using the \"Cookies\" link at the bottom of any page. Turning them off deletes the Google cookies from this browser straight away.",
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