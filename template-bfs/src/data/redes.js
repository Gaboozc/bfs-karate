// Incrustado de perfiles de redes — BFS Martial Arts
//
// Cada red publica un widget que muestra el perfil y sus publicaciones mas
// recientes dentro de un iframe, SIN llave de API. Es distinto de la API:
// la API exige un token que caduca y que en un sitio sin backend quedaria
// expuesto; estos widgets solo necesitan la URL publica del perfil.
//
// QUE TAN CONFIABLE ES CADA UNO
//   Facebook  Page Plugin, documentado por Meta. Estable.
//   TikTok    Creator Embed, documentado por TikTok. Estable.
//   Instagram /usuario/embed NO esta documentado. Funciona hoy y lo usa medio
//             internet, pero Meta lo ha roto antes y puede volver a hacerlo.
//             Por eso el bloque se cae con gracia: si el iframe no carga, la
//             tarjeta sigue sirviendo como enlace al perfil.
//
// PRIVACIDAD
// Son iframes de terceros: Meta y TikTok pueden poner cookies al cargarlos.
// El resto del sitio no rastrea a nadie (la analitica es sin cookies), asi
// que esto es lo unico que introduce terceros en la pagina.

/** Saca el nombre de usuario de una URL de perfil. "…/bfs_karate/" -> "bfs_karate" */
const usuarioDe = url => {
  if (!url) return ""
  const limpia = String(url).trim().replace(/[?#].*$/, "").replace(/\/+$/, "")
  const ultimo = limpia.split("/").pop() || ""
  return ultimo.replace(/^@/, "")
}

/**
 * URL del widget incrustable de cada red, a partir de la URL del perfil.
 * Devuelve "" cuando no se puede armar, y entonces la tarjeta no se muestra.
 */
export const urlIncrustada = (red, perfil) => {
  if (!perfil || perfil.includes("{{")) return ""
  const usuario = usuarioDe(perfil)

  switch (red) {
    case "instagram":
      return usuario ? `https://www.instagram.com/${usuario}/embed` : ""

    case "tiktok":
      return usuario ? `https://www.tiktok.com/embed/@${usuario}` : ""

    case "facebook": {
      // El plugin recibe la URL de la pagina completa, codificada
      const params = new URLSearchParams({
        href: perfil,
        tabs: "timeline",
        width: "360",
        height: "500",
        small_header: "false",
        adapt_container_width: "true",
        hide_cover: "false",
        show_facepile: "true",
      })
      return `https://www.facebook.com/plugins/page.php?${params}`
    }

    case "youtube":
      // YouTube no tiene widget de perfil; su bloque es la playlist, que se
      // muestra aparte y a lo ancho
      return ""

    default:
      return ""
  }
}

export default { urlIncrustada }
