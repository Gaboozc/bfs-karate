// Administracion de eventos — BFS Martial Arts
//
// Aqui el Sensei publica torneos, seminarios y exhibiciones sin que nadie
// tenga que tocar codigo ni volver a desplegar el sitio.
//
// Un evento puede quedar en borrador: se prepara con calma y solo aparece
// en el sitio cuando se marca como publicado.

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Calendar } from "lucide-react"
import { eventosTodos, guardarEvento, borrarEvento } from "../data/supabase"

const TIPOS = ["Torneo", "Seminario", "Competencia", "Exhibicion", "Formacion"]

const COLOR_POR_TIPO = {
  Torneo:      "#c0392b",
  Seminario:   "#1a5276",
  Competencia: "#c0392b",
  Exhibicion:  "#2d6a4f",
  Formacion:   "#6b4c36",
}

const eventoVacio = () => ({
  titulo: "", fecha: "", tipo: "Torneo", sede: "",
  descripcion: "", resultado: "", publicado: false,
})

// ── Formulario ──────────────────────────────────────────────────────────────
const Formulario = ({ evento, onGuardar, onCancelar, guardando }) => {
  const [campos, setCampos] = useState(evento)
  const cambiar = (llave, valor) => setCampos(c => ({ ...c, [llave]: valor }))

  const enviar = e => {
    e.preventDefault()
    onGuardar({ ...campos, color: COLOR_POR_TIPO[campos.tipo] || "#c0392b" })
  }

  const listo = campos.titulo.trim() && campos.fecha
  const esPasado = campos.fecha && new Date(campos.fecha) < new Date()

  const input = "w-full px-3 py-2.5 rounded-lg text-sm text-white"
  const estiloInput = { background: "#0a0a0a", border: "1px solid #2a2a2a" }
  const etiqueta = "block text-xs font-semibold mb-1.5 uppercase tracking-wider"

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,10,10,0.85)" }}
      onClick={onCancelar}
      role="dialog" aria-modal="true" aria-label={evento.id ? "Editar evento" : "Nuevo evento"}
    >
      <motion.div
        initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 12 }}
        className="admin-card w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #2a2a2a" }}>
          <h2 className="font-display text-lg text-white" style={{ fontFamily: "'Bebas Neue',Impact,sans-serif" }}>
            {evento.id ? "Editar evento" : "Nuevo evento"}
          </h2>
          <button onClick={onCancelar} aria-label="Cerrar" style={{ color: "#64748b" }}>
            <X size={18}/>
          </button>
        </div>

        <form onSubmit={enviar} className="p-6 space-y-4">
          <div>
            <label htmlFor="ev-titulo" className={etiqueta} style={{ color: "#94a3b8" }}>Titulo</label>
            <input id="ev-titulo" className={input} style={estiloInput} autoFocus
              value={campos.titulo} onChange={e => cambiar("titulo", e.target.value)}
              placeholder="Torneo Interno BFS"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="ev-fecha" className={etiqueta} style={{ color: "#94a3b8" }}>Fecha</label>
              <input id="ev-fecha" type="date" className={input} style={estiloInput}
                value={campos.fecha} onChange={e => cambiar("fecha", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="ev-tipo" className={etiqueta} style={{ color: "#94a3b8" }}>Tipo</label>
              <select id="ev-tipo" className={input} style={estiloInput}
                value={campos.tipo} onChange={e => cambiar("tipo", e.target.value)}
              >
                {TIPOS.map(t => <option key={t} value={t} style={{ background: "#1a1a1a" }}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="ev-sede" className={etiqueta} style={{ color: "#94a3b8" }}>Sede</label>
            <input id="ev-sede" className={input} style={estiloInput}
              value={campos.sede || ""} onChange={e => cambiar("sede", e.target.value)}
              placeholder="Dojo BFS"
            />
          </div>

          <div>
            <label htmlFor="ev-desc" className={etiqueta} style={{ color: "#94a3b8" }}>Descripcion</label>
            <textarea id="ev-desc" rows={3} className={input} style={{ ...estiloInput, resize: "vertical" }}
              value={campos.descripcion || ""} onChange={e => cambiar("descripcion", e.target.value)}
              placeholder="Competencia interna para alumnos de todos los niveles."
            />
          </div>

          {/* El resultado solo tiene sentido en eventos que ya pasaron */}
          {esPasado && (
            <div>
              <label htmlFor="ev-resultado" className={etiqueta} style={{ color: "#94a3b8" }}>
                Resultado <span style={{ textTransform: "none", fontWeight: 400 }}>— este evento ya paso</span>
              </label>
              <input id="ev-resultado" className={input} style={estiloInput}
                value={campos.resultado || ""} onChange={e => cambiar("resultado", e.target.value)}
                placeholder="4 medallas de oro y 6 de plata"
              />
            </div>
          )}

          <label className="flex items-center gap-3 py-2 cursor-pointer">
            <input type="checkbox" checked={campos.publicado}
              onChange={e => cambiar("publicado", e.target.checked)}
              className="w-4 h-4" style={{ accentColor: "#c0392b" }}
            />
            <span className="text-sm text-white">Publicar en el sitio</span>
            <span className="text-xs" style={{ color: "#64748b" }}>
              {campos.publicado ? "visible para todos" : "queda como borrador"}
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancelar}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
              style={{ background: "#1a1a1a", color: "#94a3b8", border: "1px solid #2a2a2a" }}
            >Cancelar</button>
            <button type="submit" disabled={!listo || guardando}
              className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white"
              style={{
                background: listo ? "#c0392b" : "#2a2a2a",
                cursor: listo ? "pointer" : "not-allowed",
                fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: "15px",
              }}
            >{guardando ? "Guardando…" : "Guardar"}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// ── Vista principal ─────────────────────────────────────────────────────────
const AdminEventos = () => {
  const [eventos, setEventos]   = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError]       = useState("")
  const [editando, setEditando] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [porBorrar, setPorBorrar] = useState(null)

  const recargar = async () => {
    setCargando(true)
    const { datos, error } = await eventosTodos()
    if (error) setError(error.message)
    else { setEventos(datos); setError("") }
    setCargando(false)
  }

  useEffect(() => { recargar() }, [])

  const alGuardar = async evento => {
    setGuardando(true)
    const { error } = await guardarEvento(evento)
    setGuardando(false)
    if (error) { setError(error.message); return }
    setEditando(null)
    recargar()
  }

  const alBorrar = async id => {
    const { error } = await borrarEvento(id)
    setPorBorrar(null)
    if (error) { setError(error.message); return }
    recargar()
  }

  const alternarPublicado = async ev => {
    const { error } = await guardarEvento({ id: ev.id, publicado: !ev.publicado })
    if (error) { setError(error.message); return }
    recargar()
  }

  const fecha = f => new Date(f + "T12:00:00").toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-white mb-1" style={{ fontFamily: "'Bebas Neue',Impact,sans-serif" }}>Eventos</h1>
          <p className="text-sm" style={{ color: "#64748b" }}>
            {cargando ? "Cargando…" : `${eventos.length} evento${eventos.length !== 1 ? "s" : ""} · ${eventos.filter(e => e.publicado).length} publicado${eventos.filter(e => e.publicado).length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button onClick={() => setEditando(eventoVacio())}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white"
          style={{ background: "#c0392b", fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: "14px" }}
        ><Plus size={15}/> NUEVO EVENTO</button>
      </div>

      {error && (
        <div role="alert" className="p-3 rounded-lg text-sm" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}>
          {error}
        </div>
      )}

      {!cargando && eventos.length === 0 && (
        <div className="admin-card p-10 text-center">
          <Calendar size={30} style={{ color: "#2a2a2a" }} className="mx-auto mb-3"/>
          <p className="text-sm mb-1" style={{ color: "#94a3b8" }}>Todavia no hay eventos.</p>
          <p className="text-xs" style={{ color: "#64748b" }}>
            Crea el primero y aparecera en el sitio en cuanto lo publiques.
          </p>
        </div>
      )}

      {eventos.length > 0 && (
        <div className="space-y-3">
          {eventos.map(ev => (
            <div key={ev.id} className="admin-card p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              style={{ borderLeft: `3px solid ${ev.color || "#c0392b"}` }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
                    style={{ background: `${ev.color || "#c0392b"}20`, color: ev.color || "#c0392b" }}
                  >{ev.tipo}</span>
                  {!ev.publicado && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
                      style={{ background: "#2a2a2a", color: "#64748b" }}
                    >Borrador</span>
                  )}
                </div>
                <p className="font-semibold text-white text-sm truncate">{ev.titulo}</p>
                <p className="text-xs" style={{ color: "#64748b" }}>
                  {fecha(ev.fecha)}{ev.sede ? ` · ${ev.sede}` : ""}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => alternarPublicado(ev)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "#1a1a1a", color: ev.publicado ? "#4ade80" : "#64748b" }}
                  aria-label={ev.publicado ? `Ocultar ${ev.titulo} del sitio` : `Publicar ${ev.titulo} en el sitio`}
                  title={ev.publicado ? "Visible en el sitio" : "Oculto"}
                >{ev.publicado ? <Eye size={14}/> : <EyeOff size={14}/>}</button>

                <button onClick={() => setEditando(ev)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "#1a1a1a", color: "#94a3b8" }}
                  aria-label={`Editar ${ev.titulo}`}
                ><Pencil size={14}/></button>

                <button onClick={() => setPorBorrar(ev)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "#1a1a1a", color: "#f87171" }}
                  aria-label={`Eliminar ${ev.titulo}`}
                ><Trash2 size={14}/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editando && (
          <Formulario evento={editando} guardando={guardando}
            onGuardar={alGuardar} onCancelar={() => setEditando(null)}
          />
        )}
      </AnimatePresence>

      {/* Confirmacion de borrado: es irreversible, no se hace de un clic */}
      <AnimatePresence>
        {porBorrar && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(10,10,10,0.85)" }}
            onClick={() => setPorBorrar(null)}
            role="dialog" aria-modal="true" aria-label="Confirmar eliminacion"
          >
            <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }}
              className="admin-card p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}
            >
              <h2 className="font-display text-lg text-white mb-2" style={{ fontFamily: "'Bebas Neue',Impact,sans-serif" }}>
                Eliminar evento
              </h2>
              <p className="text-sm mb-1" style={{ color: "#94a3b8" }}>
                Se va a eliminar <strong className="text-white">{porBorrar.titulo}</strong>.
              </p>
              <p className="text-xs mb-5" style={{ color: "#64748b" }}>
                Esto no se puede deshacer. Si solo quieres quitarlo del sitio, usa el ojo para ocultarlo.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setPorBorrar(null)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                  style={{ background: "#1a1a1a", color: "#94a3b8", border: "1px solid #2a2a2a" }}
                >Cancelar</button>
                <button onClick={() => alBorrar(porBorrar.id)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white"
                  style={{ background: "#c0392b", fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: "15px" }}
                >Eliminar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminEventos
