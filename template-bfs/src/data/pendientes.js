// pendientes.js — manejo del contenido que todavia no es real
//
// El template marca con dobles llaves todo lo que es material de relleno:
//   price: "${{650}}/mes"        <- precio inventado
//   name:  "{{Roberto H.}}"      <- resena de una persona que no existe
//
// Sin esto, esas llaves se ven tal cual en el sitio publicado. Peor aun:
// las resenas y cifras inventadas se leerian como si fueran verdaderas.
//
// La regla es no maquillar un dato falso para que parezca real. Segun el
// caso, o se ofrece una alternativa honesta ("Consultar") o no se muestra.

const MARCA = /\{\{|\}\}/

/** ¿Este valor sigue siendo material de relleno? */
export const esPendiente = valor =>
  typeof valor === "string" && MARCA.test(valor)

/** Quita las llaves. Solo para datos ya confirmados que las conservan. */
export const limpiar = valor =>
  typeof valor === "string" ? valor.replace(/\{\{|\}\}/g, "") : valor

/**
 * Devuelve el valor si es real, o `alternativa` si sigue pendiente.
 * Con alternativa `null` el componente decide no renderizar nada.
 */
export const real = (valor, alternativa = null) =>
  esPendiente(valor) ? alternativa : valor

/** Precio listo para mostrar: el real, o una invitacion a preguntar. */
export const precio = valor =>
  esPendiente(valor) ? "Consultar" : valor

/** Filtra una lista dejando solo los elementos cuyos campos son reales. */
export const soloReales = (lista, ...campos) =>
  (lista || []).filter(item => !campos.some(campo => esPendiente(item?.[campo])))

/**
 * Para textos que mezclan lo confirmado con lo pendiente, separados por "·":
 *   "San Francisco Coacalco · Est. {{2010}}"  ->  "San Francisco Coacalco"
 * Descarta los tramos pendientes y conserva el resto.
 */
export const sinPendientes = (texto, separador = "·") => {
  if (typeof texto !== "string") return texto
  return texto
    .split(separador)
    .map(tramo => tramo.trim())
    .filter(tramo => tramo && !esPendiente(tramo))
    .join(` ${separador} `)
}

export default { esPendiente, limpiar, real, precio, soloReales, sinPendientes }
