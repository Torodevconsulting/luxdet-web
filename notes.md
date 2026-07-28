Plan — Páginas individuales por evento
Antes de nada: los slugs actuales no sirven como URL
Cuatro de los seis tienen espacios y mayúsculas:


MAL  /events/The%20Warehouse%20004     ← "The Warehouse 004"
MAL  /events/The%20Warehouse-001
MAL  /events/The%20Warehouse-002
MAL  /events/The%20Cave-001
OK   /events/minimal-depths-002
OK   /events/warehouse-09
Esto es bloqueante y hay que resolverlo antes de crear la ruta, porque la propia premisa del encargo es que estas URLs son permanentes: si se publican con %20 y luego se corrigen, se rompen los enlaces que ya se hayan compartido.

Y hay un efecto colateral que ya está activo hoy: eventEdition() extrae la edición con /-(\d+)$/, y "The Warehouse 004" (espacio antes del número) no hace match, así que cae al año. Por eso la sección ARCHIVE muestra el año en lugar del número de edición en ese evento.

Propuesta: normalizar a kebab-case (the-warehouse-004, the-cave-001) y añadir un assertValidSlugs() en lib/events.ts que rompa el build si un slug no cumple ^[a-z0-9]+(?:-[a-z0-9]+)*$ o está duplicado — mismo patrón que ya usa assertValidEventOffsets para los offsets. Los slugs son URLs permanentes: conviene que un error de tecleo no llegue a producción.

Ruta
app/events/[slug]/page.tsx, con generateStaticParams() sobre content/events.ts y dynamicParams = false. params es una promesa: const { slug } = await params, tanto en la página como en generateMetadata. notFound() si el slug no está en el contenido.

Nota de operativa: como los datos viven en el repo, un evento nuevo no tiene ruta hasta el siguiente deploy. Es coherente — añadir un evento ya requiere commit.

Los dos estados y el revalidate
El estado sale de resolveEnd(event) > Date.now(), el mismo criterio que getUpcomingEvents (fin, no inicio: una fiesta de 23:00 a 04:00 sigue siendo futura mientras ocurre).

export const revalidate = 3600, igual que la home. Justificación: el estado cambia una sola vez en la vida de cada evento, en el instante en que termina — de madrugada, la franja de menor tráfico. El peor caso es que durante una hora se siga viendo el CTA de compra de una fiesta recién acabada. Bajarlo a 5-15 minutos multiplicaría regeneraciones sin beneficio real, y además con ISR la primera visita tras expirar sirve la versión antigua y regenera en segundo plano, así que el desfase efectivo depende del tráfico y no de afinar el número.

Datos nuevos
Solo dos campos, ambos opcionales:


longDescription?: string[]   // párrafos del cuerpo; array como en `bio` de residents
gallery?: { image: StaticImageData; alt: string }[]
description (una línea) se queda para la home y los metadatos. No añado más: image, imageAlt, performer, offers y typicalAgeRange ya cubren el resto.

Metadatos y JSON-LD
generateMetadata por evento: title, description, alternates.canonical y openGraph con la imagen de la fiesta. metadataBase ya está en layout.tsx.
eventToJsonLd() en lib/events.ts, mapeando los campos que ya modelamos para eso. Al serializar, JSON.stringify(...).replace(/</g, "\\u003c") para que ningún dato pueda cerrar el <script>.
Organization para Luxdet en la home.
Con location.status === "tba", schema.org sigue exigiendo location: emitiré un Place con nombre "To be announced" y la ciudad, que es lo que valida el Rich Results Test.
Esto cierra el pendiente 4 de CLAUDE.md.

Sitemap y robots — user-agents verificados
Los que pediste son correctos, y falta uno: Claude-SearchBot. La lista de recuperación/citación queda:

OAI-SearchBot · ChatGPT-User · PerplexityBot · Perplexity-User · Claude-User · Claude-SearchBot

Una distinción que conviene que decidas tú: GPTBot, ClaudeBot, Google-Extended y Applebot-Extended son de entrenamiento, no de recuperación. Son cosas distintas: los de arriba citan tu web en respuestas en tiempo real; estos alimentan modelos. Con un User-agent: * permisivo quedan permitidos por omisión. Dime si quieres permitirlos, bloquearlos o dejarlo así.

Esto cierra el pendiente 5 (falta la opengraph-image.png, que necesita material tuyo).

Las tres cosas que se rompen
1. El nav. Confirmado: #next, #archive, #contact. Pasan a /#next, /#archive, /#contact. Tienes razón en que es el fallo más probable: un ancla inexistente no lanza ningún error, simplemente no hace nada.

2. Las islas. Mi recomendación coincide con tu intuición:

CursorBlob sube a layout.tsx: es un efecto de marca que debe estar en todo el sitio, y no depende de ninguna sección.
ParallaxProvider se queda en la home: solo mueve .parallax-text, .hero-grid y .floating-label, que no existen fuera de ella. Subirlo cargaría JS que haría querySelectorAll sin encontrar nada.
3. scripts/snapshot.mjs. Hoy tiene la ruta fija a index.html. Lo extiendo a node scripts/snapshot.mjs <fichero> [ruta], con / por defecto, mapeando /events/x a .next/server/app/events/x.html. Así se puede fijar también la referencia de una página de evento.

Enlazar desde la home — un conflicto
NEXT y cada fila de ARCHIVE enlazan a su página, sin problema.

El ticker no debería llevar enlaces, y te pido que lo reconsideres: el ticker visual está dentro de un aria-hidden="true" (porque su contenido se duplica para el bucle y está en movimiento perpetuo). Un enlace dentro de aria-hidden sigue siendo focusable con Tab pero invisible para un lector de pantalla — es un fallo de accesibilidad concreto. Y aunque se resolviera, pedirle a alguien que acierte a clicar un objetivo que se desplaza continuamente es mala usabilidad.

Mi propuesta: el ticker se queda como decoración y los enlaces viven en NEXT y ARCHIVE. Si quieres que las fechas del ticker sean navegables, la alternativa razonable es convertir la lista .sr-only en una lista visible de próximas fechas, ya sin movimiento.

Verificación
pnpm build y comprobar que la tabla de rutas lista /events/[slug] con una entrada por evento.
pnpm lint sin warnings.
Slug inexistente → 404.
Desde una página de evento, los tres enlaces del nav vuelven a la home y saltan al ancla.
JSON-LD contra el Rich Results Test.
Regenerar la referencia del snapshot.
Lo que necesito de ti
Slugs definitivos	Son URLs permanentes. Propongo the-warehouse-004, the-warehouse-001, the-warehouse-002, the-cave-001; confírmalos o dame otros
longDescription	2-4 párrafos por evento. Los pasados son los que más valen: son los que acumulan autoridad
gallery	Fotos por evento (opcional). Hoy solo hay una image por fiesta y las siete de public/ están ya repartidas
Entrenamiento	Si GPTBot / ClaudeBot / Google-Extended se permiten o se bloquean
opengraph-image.png	1200×630 para el pendiente 5
Mientras no tenga longDescription, puedo maquetar con la description de una línea y dejar el bloque marcado como provisional, igual que hicimos con las bios.