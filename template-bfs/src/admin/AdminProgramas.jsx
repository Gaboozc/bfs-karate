// Programas de la academia — BFS Martial Arts
//
// Cada clase que imparte el dojo: karate, crossfit, acondicionamiento, lo que
// sea. El Sensei las crea aqui y desde entonces aparecen en la pagina de
// programas y como opciones al armar el horario.

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Pencil, Trash2, X, Dumbbell, GripVertical } from "lucide-react"
import { programasTodos, guardarPrograma, borrarPrograma } from "../data/supabase"

// Paleta sugerida: colores que se distinguen bien sobre el fondo oscuro del
// sitio y que no se confunden entre si en la parrilla de horarios
const COLORES = [
  "#c0392b", "#f5c518", "#1a5276", "#6b4c36", "#2d6a4f",
  "#8b3fa8", "#e07b39", "#2e75b6", "#888888",
]

const programaVacio = () => ({
  nombre: "", color: "#c0392b", edades: "", nivel: "",
  descripcion: "", precio: "", duracion: "", destacado: false,
  activo: true, orden: 0,
})

// ── Formulario ──────────────────────────────────────────────────────────────
const Formulario = ({ programa, onGuardar, onCancelar, guardando }) => {
  const [campos, setCampos] = useState(programa)
  const cambiar = (llave, valor) => setCampos(c => ({ ...c, [llave]: valor }))

  const enviar = e => {
    e.preventDefault()
    onGuardar({ ...campos, precio: campos.precio === "" ? null : Number(campos.precio) })
  }

  const input  = "w-full px-3 py-2.5 rounded-lg text-sm text-white"
  const estilo = { background:"#0a0a0a", border:"1px solid #2a2a2a" }
  const etiq   = "block text-xs font-semibold mb-1.5 uppercase tracking-wider"

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:"rgba(10,10,10,0.85)" }}
      onClick={onCancelar}
      role="dialog" aria-modal="true" aria-label={programa.id ? "Editar programa" : "Nuevo programa"}
    >
      <motion.div
        initial={{ scale:0.96, y:12 }} animate={{ scale:1, y:0 }} exit={{ scale:0.96, y:12 }}
        className="admin-card w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom:"1px solid #2a2a2a" }}>
          <h2 className="font-display text-lg text-white" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>
            {programa.id ? "Editar programa" : "Nuevo programa"}
          </h2>
          <button onClick={onCancelar} aria-label="Cerrar" style={{ color:"#64748b" }}><X size={18}/></button>
        </div>

        <form onSubmit={enviar} className="p-6 space-y-4">
          <div>
            <label htmlFor="pg-nombre" className={etiq} style={{ color:"#94a3b8" }}>Nombre de la clase</label>
            <input id="pg-nombre" className={input} style={estilo} autoFocus
              value={campos.nombre} onChange={e => cambiar("nombre", e.target.value)}
              placeholder="Crossfit, Acondicionamiento fisico, Karate Kids…"
            />
          </div>

          <div>
            <label className={etiq} style={{ color:"#94a3b8" }}>Color</label>
            <p className="text-[11px] mb-2" style={{ color:"#64748b" }}>
              Con este color se ve la clase en el horario y en el sitio.
            </p>
            <div className="flex flex-wrap gap-2">
              {COLORES.map(c => (
                <button key={c} type="button" onClick={() => cambiar("color", c)}
                  className="w-8 h-8 rounded-lg transition-transform"
                  style={{
                    background: c,
                    border: campos.color === c ? "2px solid #ffffff" : "2px solid transparent",
                    transform: campos.color === c ? "scale(1.1)" : "scale(1)",
                  }}
                  aria-label={`Color ${c}`} aria-pressed={campos.color === c}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="pg-edades" className={etiq} style={{ color:"#94a3b8" }}>Edades</label>
              <input id="pg-edades" className={input} style={estilo}
                value={campos.edades || ""} onChange={e => cambiar("edades", e.target.value)}
                placeholder="4 a 12 anos"
              />
            </div>
            <div>
              <label htmlFor="pg-nivel" className={etiq} style={{ color:"#94a3b8" }}>Nivel</label>
              <input id="pg-nivel" className={input} style={estilo}
                value={campos.nivel || ""} onChange={e => cambiar("nivel", e.target.value)}
                placeholder="Todos los niveles"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="pg-precio" className={etiq} style={{ color:"#94a3b8" }}>Precio mensual</label>
              <input id="pg-precio" type="number" min="0" step="1" className={input} style={estilo}
                value={campos.precio ?? ""} onChange={e => cambiar("precio", e.target.value)}
                placeholder="Vacio = Consultar"
              />
            </div>
            <div>
              <label htmlFor="pg-dur" className={etiq} style={{ color:"#94a3b8" }}>Duracion</label>
              <input id="pg-dur" className={input} style={estilo}
                value={campos.duracion || ""} onChange={e => cambiar("duracion", e.target.value)}
                placeholder="60 min"
              />
            </div>
          </div>

          <div>
            <label htmlFor="pg-desc" className={etiq} style={{ color:"#94a3b8" }}>Descripcion</label>
            <textarea id="pg-desc" rows={3} className={input} style={{ ...estilo, resize:"vertical" }}
              value={campos.descripcion || ""} onChange={e => cambiar("descripcion", e.target.value)}
              placeholder="Que se hace en esta clase y para quien es."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={campos.destacado}
                onChange={e => cambiar("destacado", e.target.checked)}
                className="w-4 h-4" style={{ accentColor:"#c0392b" }}
              />
              <span className="text-sm text-white">Marcar como popular</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={campos.activo}
                onChange={e => cambiar("activo", e.target.checked)}
                className="w-4 h-4" style={{ accentColor:"#c0392b" }}
              />
              <span className="text-sm text-white">Mostrar en el sitio</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancelar}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
              style={{ background:"#1a1a1a", color:"#94a3b8", border:"1px solid #2a2a2a" }}
            >Cancelar</button>
            <button type="submit" disabled={!campos.nombre.trim() || guardando}
              className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white"
              style={{
                background: campos.nombre.trim() ? "#c0392b" : "#2a2a2a",
                cursor: campos.nombre.trim() ? "pointer" : "not-allowed",
                fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"15px",
              }}
            >{guardando ? "Guardando…" : "Guardar"}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// ── Vista principal ─────────────────────────────────────────────────────────
const AdminProgramas = () => {
  const [programas, setProgramas] = useState([])
  const [cargando, setCargando]   = useState(true)
  const [error, setError]         = useState("")
  const [editando, setEditando]   = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [porBorrar, setPorBorrar] = useState(null)

  const recargar = async () => {
    setCargando(true)
    const { datos, error } = await programasTodos()
    if (error) setError(error.message)
    else { setProgramas(datos); setError("") }
    setCargando(false)
  }

  useEffect(() => { recargar() }, [])

  const alGuardar = async programa => {
    setGuardando(true)
    const { error } = await guardarPrograma(programa)
    setGuardando(false)
    if (error) { setError(error.message); return }
    setEditando(null)
    recargar()
  }

  const alBorrar = async id => {
    const { error } = await borrarPrograma(id)
    setPorBorrar(null)
    if (error) { setError(error.message); return }
    recargar()
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-white mb-1" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>Programas</h1>
          <p className="text-sm" style={{ color:"#64748b" }}>
            {cargando ? "Cargando…" : `${programas.length} clase${programas.length !== 1 ? "s" : ""} registrada${programas.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button onClick={() => setEditando(programaVacio())}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white"
          style={{ background:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"14px" }}
        ><Plus size={15}/> NUEVO PROGRAMA</button>
      </div>

      {error && (
        <div role="alert" className="p-3 rounded-lg text-sm" style={{ background:"rgba(248,113,113,0.1)", color:"#f87171" }}>
          {error}
        </div>
      )}

      {!cargando && programas.length === 0 && (
        <div className="admin-card p-10 text-center">
          <Dumbbell size={30} style={{ color:"#2a2a2a" }} className="mx-auto mb-3"/>
          <p className="text-sm mb-1" style={{ color:"#94a3b8" }}>Todavia no hay programas.</p>
          <p className="text-xs" style={{ color:"#64748b" }}>
            Empieza por aqui: los programas que crees seran las opciones al armar el horario.
          </p>
        </div>
      )}

      {programas.length > 0 && (
        <div className="space-y-3">
          {programas.map(p => (
            <div key={p.id} className="admin-card p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              style={{ borderLeft:`3px solid ${p.color}` }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <div className="w-3 h-3 rounded-sm shrink-0" style={{ background:p.color }}/>
                  <p className="font-semibold text-white text-sm">{p.nombre}</p>
                  {p.destacado && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
                      style={{ background:"rgba(192,57,43,0.15)", color:"#c0392b" }}
                    >Popular</span>
                  )}
                  {!p.activo && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
                      style={{ background:"#2a2a2a", color:"#64748b" }}
                    >Oculto</span>
                  )}
                </div>
                <p className="text-xs" style={{ color:"#64748b" }}>
                  {[p.edades, p.nivel, p.duracion].filter(Boolean).join(" · ") || "Sin detalles"}
                  {p.precio != null ? ` · $${Number(p.precio).toLocaleString("es-MX")}/mes` : " · Consultar precio"}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setEditando(p)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background:"#1a1a1a", color:"#94a3b8" }}
                  aria-label={`Editar ${p.nombre}`}
                ><Pencil size={14}/></button>
                <button onClick={() => setPorBorrar(p)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background:"#1a1a1a", color:"#f87171" }}
                  aria-label={`Eliminar ${p.nombre}`}
                ><Trash2 size={14}/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editando && (
          <Formulario programa={editando} guardando={guardando}
            onGuardar={alGuardar} onCancelar={() => setEditando(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {porBorrar && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background:"rgba(10,10,10,0.85)" }}
            onClick={() => setPorBorrar(null)}
            role="dialog" aria-modal="true" aria-label="Confirmar eliminacion"
          >
            <motion.div initial={{ scale:0.96 }} animate={{ scale:1 }}
              className="admin-card p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}
            >
              <h2 className="font-display text-lg text-white mb-2" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>
                Eliminar programa
              </h2>
              <p className="text-sm mb-1" style={{ color:"#94a3b8" }}>
                Se va a eliminar <strong className="text-white">{porBorrar.nombre}</strong>.
              </p>
              <p className="text-xs mb-5" style={{ color:"#f87171" }}>
                Tambien se borraran sus clases del horario. Si solo quieres dejar de
                ofrecerlo, desmarca "Mostrar en el sitio" al editarlo.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setPorBorrar(null)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                  style={{ background:"#1a1a1a", color:"#94a3b8", border:"1px solid #2a2a2a" }}
                >Cancelar</button>
                <button onClick={() => alBorrar(porBorrar.id)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white"
                  style={{ background:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"15px" }}
                >Eliminar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminProgramas
