// Subida de fotos — BFS Martial Arts
//
// POR QUE SE COMPRIME ANTES DE SUBIR
// Una foto de telefono actual pesa entre 4 y 8 MB. El Sensei va a subir varias
// por producto, parado en el dojo y con datos moviles: sin comprimir, cada
// producto serian 30 MB y varios minutos de espera. Reducida a 1400px de lado
// mayor y JPEG al 82% baja a ~200 KB sin que se note en pantalla.
//
// Se hace en el navegador, antes de enviar: asi lo que viaja por la red ya es
// la version chica.

const LADO_MAXIMO = 1400
const CALIDAD     = 0.82

/**
 * Reduce una foto y la devuelve como Blob JPEG.
 * Si algo falla, devuelve el archivo original: mas vale subir pesado que no
 * subir nada.
 */
export const comprimir = archivo =>
  new Promise(resolve => {
    if (!archivo.type.startsWith("image/")) return resolve(archivo)

    const lector = new FileReader()
    lector.onerror = () => resolve(archivo)
    lector.onload = () => {
      const img = new Image()
      img.onerror = () => resolve(archivo)
      img.onload = () => {
        try {
          const escala = Math.min(1, LADO_MAXIMO / Math.max(img.width, img.height))
          // Una foto ya pequena no se reescala: agrandarla solo la empeora
          const ancho = Math.round(img.width  * escala)
          const alto  = Math.round(img.height * escala)

          const lienzo = document.createElement("canvas")
          lienzo.width = ancho
          lienzo.height = alto
          const ctx = lienzo.getContext("2d")
          // Fondo blanco: un PNG con transparencia sobre JPEG saldria negro
          ctx.fillStyle = "#ffffff"
          ctx.fillRect(0, 0, ancho, alto)
          ctx.drawImage(img, 0, 0, ancho, alto)

          lienzo.toBlob(
            blob => resolve(blob && blob.size < archivo.size ? blob : archivo),
            "image/jpeg",
            CALIDAD,
          )
        } catch {
          resolve(archivo)
        }
      }
      img.src = lector.result
    }
    lector.readAsDataURL(archivo)
  })

/**
 * Nombre unico para el archivo dentro del bucket.
 * Lleva el id del producto por delante para que todas sus fotos queden
 * juntas y sea evidente a quien pertenecen al mirar el bucket.
 */
export const rutaDeFoto = (productoId, archivo) => {
  const extension = (archivo.type.split("/")[1] || "jpg").replace("jpeg", "jpg")
  const azar = Math.random().toString(36).slice(2, 10)
  return `${productoId}/${Date.now()}-${azar}.${extension}`
}

export default { comprimir, rutaDeFoto }
