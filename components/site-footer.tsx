// Va dentro de <main> porque es donde está hoy: sacarlo cambiaría el HTML.
export function SiteFooter() {
  return (
    <footer id="contact">
      <div className="container">
        <div className="footer-cta">
          <a href="mailto:hello@viscera.studio">LET&apos;S — DANCE</a>
        </div>
        <div className="divider"></div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "var(--syne)",
            fontSize: "0.8rem",
            textTransform: "uppercase",
            color: "#555",
          }}
        >
          <div>© 2026 LUXDET EVENTS All Rights Reserved</div>
          <div style={{ display: "flex", gap: "30px" }}>
            <span>INSTAGRAM</span>
            <span>POSH</span>
          </div>
          <div>OHIO, USA</div>
        </div>
      </div>
    </footer>
  )
}
