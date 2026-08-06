// Administracion del horario semanal — BFS Martial Arts
//
// Se edita como la parrilla que ya conoce el Sensei: dias en columnas, horas
// en filas. Tocar una celda asigna o quita una clase, sin formularios.

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, Trash2 } from "lucide-react"
import { horariosTodos, guardarHorario, borrarHorario, programasTodos } from "../data/supabase"

const DIAS = [
  { n:1, corto:"Lun", largo:"Lunes"     },
  { n:2, corto:"Mar", largo:"Martes"    },
  { n:3, corto:"Mie", largo:"Miercoles" },
  { n:4, corto:"Jue", largo:"Jueves"    },
  { n:5, corto:"Vie", largo:"Viernes"   },
  { n:6, corto:"Sab", largo:"Sabado"    },
  { n:7, corto:"Dom", largo:"Domingo"   },
]

const HORAS_SUGERIDAS = ["07:00","09:00","10:00","16:00","17:30","19:00","20:30"]

const AdminHorarios = () => {
  const [horarios, setHorarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError]       = useState("")
  const [programas, setProgramas] = useState([])
  const [celda, setCelda]         = useState(null)   // { dia, hora, actual }
  const [horaNueva, setHoraNueva] = useState("")

  const recargar = async () => {
    setCargando(true)
    const [h, p] = await Promise.all([horariosTodos(), programasTodos()])
    if (h.error) setError(h.error.message)
    else { setHorarios(h.datos); setError("") }
    if (!p.error) setProgramas(p.datos.filter(x => x.activo))
    setCargando(false)
  }

  useEffect(() => { recargar() }, [])

  // Horas presentes en la base, mas las sugeridas, ordenadas
  const horas = [...new Set([
    ...horarios.map(h => h.hora.slice(0, 5)),
    ...HORAS_SUGERIDAS,
  ])].sort()

  const buscar = (dia, hora) =>
    horarios.find(h => h.dia === dia && h.hora.slice(0, 5) === hora)

  const asignar = async (dia, hora, prog) => {
    const existente = buscar(dia, hora)
    let res
    if (!prog) {
      // Quitar la clase de esa celda
      res = existente ? await borrarHorario(existente.id) : { error: null }
    } else if (existente) {
      res = await guardarHorario({ id: existente.id, programa_id: prog.id, programa: prog.nombre })
    } else {
      res = await guardarHorario({ dia, hora, programa_id: prog.id, programa: prog.nombre, activo: true })
    }
    setCelda(null)
    if (res.error) { setError(res.error.message); return }
    recargar()
  }

  const agregarHora = e => {
    e.preventDefault()
    if (!horaNueva) return
    // Solo se agrega visualmente; queda guardada al asignarle una clase
    HORAS_SUGERIDAS.push(horaNueva)
    setHoraNueva("")
    setHorarios(h => [...h])
  }

  const clasesActivas = horarios.length

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-white mb-1" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>Horarios</h1>
          <p className="text-sm" style={{ color:"#64748b" }}>
            {cargando ? "Cargando…" : `${clasesActivas} clase${clasesActivas !== 1 ? "s" : ""} en la semana`}
          </p>
        </div>
        <form onSubmit={agregarHora} className="flex items-center gap-2">
          <input type="time" value={horaNueva} onChange={e => setHoraNueva(e.target.value)}
            aria-label="Nueva hora"
            className="px-3 py-2 rounded-lg text-sm text-white"
            style={{ background:"#0a0a0a", border:"1px solid #2a2a2a" }}
          />
          <button type="submit" disabled={!horaNueva}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-white"
            style={{ background: horaNueva ? "#c0392b" : "#2a2a2a", cursor: horaNueva ? "pointer" : "not-allowed" }}
          ><Plus size={13}/> Agregar hora</button>
        </form>
      </div>

      {error && (
        <div role="alert" className="p-3 rounded-lg text-sm" style={{ background:"rgba(248,113,113,0.1)", color:"#f87171" }}>
          {error}
        </div>
      )}

      <p className="text-xs" style={{ color:"#64748b" }}>
        Toca cualquier celda para asignar o quitar una clase. Los cambios se ven en el sitio de inmediato.
      </p>

      {/* Parrilla semanal */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth:"760px" }}>
            <thead>
              <tr style={{ borderBottom:"1px solid #2a2a2a" }}>
                <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider w-16" style={{ color:"#64748b" }}>Hora</th>
                {DIAS.map(d => (
                  <th key={d.n} className="px-2 py-3 text-center text-[10px] font-semibold uppercase tracking-wider" style={{ color:"#c0392b" }}>
                    {d.corto}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {horas.map(hora => (
                <tr key={hora} style={{ borderBottom:"1px solid #111111" }}>
                  <td className="px-3 py-2 text-xs font-bold" style={{ color:"#64748b", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>
                    {hora}
                  </td>
                  {DIAS.map(d => {
                    const h = buscar(d.n, hora)
                    const color = h?.programas?.color || "#888888"
                    return (
                      <td key={d.n} className="px-1 py-1">
                        <button
                          onClick={() => setCelda({ dia:d.n, hora, actual:h?.programa_id ?? null })}
                          className="w-full py-2 px-1 rounded text-[10px] font-bold tracking-wide transition-colors"
                          style={{
                            background: h ? `${color}20` : "transparent",
                            color:      h ? color : "#2a2a2a",
                            border:     h ? `1px solid ${color}40` : "1px dashed #2a2a2a",
                            minHeight:  "34px",
                          }}
                          aria-label={h
                            ? `${h.programas?.nombre ?? h.programa}, ${d.largo} ${hora}. Tocar para cambiar`
                            : `Sin clase, ${d.largo} ${hora}. Tocar para asignar`}
                        >{h ? (h.programas?.nombre ?? h.programa) : "+"}</button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-4">
        {programas.map(p => (
          <div key={p.id} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ background:p.color }}/>
            <span className="text-xs" style={{ color:"#64748b" }}>{p.nombre}</span>
          </div>
        ))}
      </div>

      {/* Selector de programa para la celda tocada */}
      <AnimatePresence>
        {celda && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background:"rgba(10,10,10,0.85)" }}
            onClick={() => setCelda(null)}
            role="dialog" aria-modal="true" aria-label="Asignar clase"
          >
            <motion.div initial={{ scale:0.96 }} animate={{ scale:1 }}
              className="admin-card w-full max-w-xs" onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom:"1px solid #2a2a2a" }}>
                <div>
                  <h2 className="font-display text-base text-white" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>
                    {DIAS.find(d => d.n === celda.dia)?.largo} · {celda.hora}
                  </h2>
                </div>
                <button onClick={() => setCelda(null)} aria-label="Cerrar" style={{ color:"#64748b" }}>
                  <X size={17}/>
                </button>
              </div>

              <div className="p-4 space-y-2">
                {programas.length === 0 && (
                  <p className="text-xs py-2" style={{ color:"#64748b" }}>
                    Primero crea tus clases en la seccion Programas. Ahi defines
                    karate, crossfit, acondicionamiento o lo que impartas.
                  </p>
                )}
                {programas.map(p => (
                  <button key={p.id} onClick={() => asignar(celda.dia, celda.hora, p)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                    style={{
                      background: celda.actual === p.id ? `${p.color}20` : "#0a0a0a",
                      color: p.color,
                      border: `1px solid ${celda.actual === p.id ? p.color : "#2a2a2a"}`,
                    }}
                  >
                    <div className="w-3 h-3 rounded-sm shrink-0" style={{ background:p.color }}/>
                    {p.nombre}
                  </button>
                ))}

                {celda.actual && (
                  <button onClick={() => asignar(celda.dia, celda.hora, null)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold mt-3"
                    style={{ background:"#0a0a0a", color:"#f87171", border:"1px solid #2a2a2a" }}
                  ><Trash2 size={13}/> Quitar esta clase</button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminHorarios
