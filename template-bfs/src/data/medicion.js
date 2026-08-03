// medicion.js — registro de la conversion real del sitio
//
// El objetivo del sitio no es que la gente lo lea: es que abra una
// conversacion por WhatsApp. Ese es el numero que importa para decidir si la
// publicidad vale la pena y para saber que secciones traen alumnos.
//
// En vez de instrumentar cada enlace por separado, se escucha un solo clic a
// nivel de documento. Asi cualquier enlace de WhatsApp que se agregue despues
// queda medido sin que nadie tenga que acordarse.

import { track } from "@vercel/analytics"

/** Clasifica el enlace segun el mensaje que lleva precargado. */
const tipoDeContacto = (url, ruta) => {
  const texto = decodeURIComponent(url).toLowerCase()
  if (texto.includes("patrocinio")) {
    if (texto.includes("bronce")) return "sponsor-bronce"
    if (texto.includes("plata"))  return "sponsor-plata"
    if (texto.includes("oro"))    return "sponsor-oro"
    return "sponsor-general"
  }
  if (texto.includes("me interesa:"))     return "producto"
  if (texto.includes("evento"))           return "evento"
  if (texto.includes("semana gratis"))    return "semana-gratis"
  return `otro (${ruta})`
}

/**
 * Empieza a escuchar clics hacia WhatsApp. Devuelve la funcion para dejar de
 * escuchar. Nunca lanza: si la analitica falla, el enlace debe abrirse igual.
 */
export const medirContactos = () => {
  const alHacerClic = evento => {
    const enlace = evento.target?.closest?.('a[href*="wa.me"]')
    if (!enlace) return
    try {
      track("contacto_whatsapp", {
        tipo:   tipoDeContacto(enlace.getAttribute("href") || "", window.location.pathname),
        seccion: window.location.pathname,
      })
    } catch {
      // La medicion nunca debe estorbar al usuario
    }
  }

  document.addEventListener("click", alHacerClic)
  return () => document.removeEventListener("click", alHacerClic)
}

export default medirContactos
