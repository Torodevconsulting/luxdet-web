export function SiteNav() {
  return (
    <nav>
      <div className="logo">LUXDET CULTURE ©26</div>
      <ul className="nav-links">
        {/* "Tickets" apuntaba a #about, que es la sección de texto: ahora va a
            la próxima fiesta. Y #work pasó a llamarse #archive. */}
        <li>
          <a href="#next">Tickets</a>
        </li>
        <li>
          <a href="#archive">Archive</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
      </ul>
    </nav>
  )
}
