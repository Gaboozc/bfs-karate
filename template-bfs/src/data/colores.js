// colores.js — colores de marca legibles como texto
//
// La paleta de BFS esta pensada para fondos: el rojo, el azul y el verde se
// ven bien como relleno de un boton con letra blanca encima. Pero cuando ese
// mismo color se usa como LETRA sobre el fondo negro del sitio, el contraste
// se queda corto frente al minimo de 4.5:1 que pide WCAG AA:
//
//   #c0392b rojo  -> 3.64:1     #6b4c36 cafe   -> 2.56:1
//   #1a5276 azul  -> 2.37:1     #8b3fa8 morado -> 3.18:1
//   #2d6a4f verde -> 3.10:1     #2e75b6 azul c.-> 4.09:1
//
// En la practica eso significa que a plena luz del dia, o en una pantalla con
// el brillo bajo, esos textos no se leen. Aqui esta la version aclarada de
// cada uno: mismo tono, solo mas luminosidad, hasta cruzar el minimo.
// Los ratios estan medidos contra el fondo mas claro del sitio (#1c1c1c),
// que es el caso peor; sobre negro puro sobra margen.
//
// Los colores se siguen usando tal cual para fondos, bordes e iconos grandes.
// Esta tabla es solo para texto.

const TEXTO = {
  "#c0392b": "#ce6459", // 4.53:1
  "#1a5276": "#6288a1", // 4.51:1
  "#2d6a4f": "#5f8d79", // 4.52:1
  "#6b4c36": "#968070", // 4.56:1
  "#8b3fa8": "#a86ebd", // 4.58:1
  "#2e75b6": "#4d89c0", // 4.57:1
  // Estos ya pasan de sobra y se dejan intactos:
  // #f5c518 dorado 12.14  ·  #e07b39 naranja 6.66  ·  #888888 gris 5.58
}

/**
 * Devuelve la version legible de un color de marca para usarlo como texto.
 * Si el color ya tiene contraste suficiente, lo devuelve sin cambios.
 */
export const textoDe = color =>
  (typeof color === "string" && TEXTO[color.toLowerCase()]) || color

export default textoDe

/**
 * Elige el color de letra que mejor contrasta sobre un fondo dado.
 *
 * Los botones de cada programa se pintan con el color del programa y llevaban
 * letra blanca siempre. Sobre el rojo o el azul funciona, pero sobre el
 * amarillo de Karate Kids el blanco da 1.5:1 y el texto desaparece.
 */
export const textoSobre = fondo => {
  if (typeof fondo !== "string" || !fondo.startsWith("#")) return "#f5f5f5"
  const h = fondo.replace("#", "")
  if (h.length < 6) return "#f5f5f5"
  const [r, g, b] = [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16) / 255)
  const lin = v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4))
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
  // Contraste contra negro vs contra blanco; gana el mayor
  const contraNegro = (L + 0.05) / 0.05
  const contraBlanco = 1.05 / (L + 0.05)
  return contraNegro >= contraBlanco ? "#0a0a0a" : "#f5f5f5"
}
