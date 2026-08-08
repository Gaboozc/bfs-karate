// Formato de horas — BFS Martial Arts
//
// Las horas se guardan y se ordenan en formato de 24 con cero adelante
// ("07:00", "17:30"): asi el orden alfabetico coincide con el cronologico y no
// hace falta convertir nada para ordenar. La conversion a AM/PM es solo para
// mostrar, en el ultimo momento.
//
// Vive aparte porque la usan el panel y el sitio publico. Si cada uno tuviera
// la suya, el Sensei podria capturar "5:30 PM" y el visitante ver otra cosa.

/**
 * "17:30" -> "5:30 PM". Acepta tambien "17:30:00", como lo devuelve la base.
 *
 * Cubre los dos casos que suelen romper estas conversiones: medianoche da
 * 12:00 AM y no 0:00 AM, y mediodia da 12:00 PM y no 12:00 AM.
 */
export const enAmPm = hhmm => {
  if (!hhmm) return ""
  const [h, m] = String(hhmm).split(":").map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) return String(hhmm)
  const periodo = h < 12 ? "AM" : "PM"
  const hora12  = h % 12 === 0 ? 12 : h % 12
  return `${hora12}:${String(m).padStart(2, "0")} ${periodo}`
}

export default { enAmPm }
