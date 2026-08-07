// Bandeja de inscripciones — BFS Martial Arts
//
// Aqui llegan los registros que la gente envia desde los enlaces publicos.
// El Sensei los revisa y los aprueba; al aprobar, se crea el alumno con esos
// mismos datos y queda inscrito en el programa correspondiente.
//
// La lupa abre el contrato tal como la persona lo acepto, con su nombre y la
// fecha. Es la constancia de lo que firmo.

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Inbox, Check, X, Search, FileText, Trash2, ShieldCheck, ShieldAlert, Clock,
} from "lucide-react"
import {
  solicitudesTodas, aprobarSolicitud, rechazarSolicitud, borrarSolicitud,
} from "../data/supabase"

const ESTADOS = [
  { id:"pendiente", label:"Pendientes", color:"#f5c518" },
  { id:"aprobada",  label:"Aprobadas",  color:"#4ade80" },
  { id:"rechazada", label:"Rechazadas", color:"#64748b" },
]

const fecha = f => f ? new Date(f).toLocaleDateString("es-MX", { day:"numeric", month:"long", year:"numeric" }) : ""

const edadDe = f => {
  if (!f) return null
  const n = new Date(f), h = new Date()
  let e = h.getFullYear() - n.getFullYear()
  const m = h.getMonth() - n.getMonth()
  if (m < 0 || (m === 0 && h.getDate() < n.getDate())) e--
  return e
}

// ── Visor del contrato firmado ──────────────────────────────────────────────
const VisorContrato = ({ solicitud, onCerrar }) => (
  <motion.div
    initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background:"rgba(10,10,10,0.88)" }}
    onClick={onCerrar}
    role="dialog" aria-modal="true" aria-label={`Contrato aceptado por ${solicitud.nombre}`}
  >
    <motion.div initial={{ scale:0.96, y:12 }} animate={{ scale:1, y:0 }}
      className="admin-card w-full max-w-lg max-h-[88vh] overflow-y-auto"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-6 py-4 sticky top-0"
        style={{ borderBottom:"1px solid #2a2a2a", background:"#1a1a1a" }}
      >
        <div>
          <h2 className="font-display text-lg text-white" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>
            Acuerdo aceptado
          </h2>
          <p className="text-[11px]" style={{ color:"#64748b" }}>
            {solicitud.programas?.nombre ?? "Sin programa"}
          </p>
        </div>
        <button onClick={onCerrar} aria-label="Cerrar" style={{ color:"#64748b" }}><X size={18}/></button>
      </div>

      <div className="p-6 space-y-4">
        {/* Quien y cuando */}
        <div className="p-3 rounded-lg" style={{ background:"#0a0a0a", border:"1px solid #2a2a2a" }}>
          <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color:"#64748b" }}>Aceptado por</p>
          <p className="text-sm text-white mb-2">{solicitud.contrato_firmante || "—"}</p>
          <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color:"#64748b" }}>Fecha</p>
          <p className="text-sm" style={{ color:"#94a3b8" }}>
            {new Date(solicitud.creado_en).toLocaleString("es-MX", {
              day:"numeric", month:"long", year:"numeric", hour:"2-digit", minute:"2-digit",
            })}
          </p>
        </div>

        {/* Texto literal */}
        <div className="p-4 text-sm leading-relaxed"
          style={{ background:"#0a0a0a", border:"1px solid #2a2a2a", color:"#94a3b8", whiteSpace:"pre-line" }}
        >{solicitud.contrato_texto || "No se guardo el texto del acuerdo."}</div>

        {/* Permisos marcados */}
        <div className="space-y-2">
          {[
            ["Acepto el acuerdo",           solicitud.acepto_contrato],
            ["Autorizo datos de salud",     solicitud.acepto_salud],
            ["Autorizo uso de imagen",      solicitud.acepto_imagen],
          ].map(([texto, si]) => (
            <div key={texto} className="flex items-center gap-2.5 text-xs">
              {si
                ? <ShieldCheck size={14} style={{ color:"#4ade80" }}/>
                : <ShieldAlert size={14} style={{ color:"#64748b" }}/>}
              <span style={{ color: si ? "#e2e8f0" : "#64748b" }}>
                {texto}{si ? "" : " — no autorizado"}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[11px] pt-2" style={{ color:"#475569" }}>
          Este es el texto exacto que se mostro al momento de aceptar. Si el
          acuerdo cambia despues, esta copia no se modifica.
        </p>
      </div>
    </motion.div>
  </motion.div>
)

// ── Vista principal ─────────────────────────────────────────────────────────
const AdminSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError]       = useState("")
  const [filtro, setFiltro]     = useState("pendiente")
  const [busqueda, setBusqueda] = useState("")
  const [contrato, setContrato] = useState(null)
  const [procesando, setProcesando] = useState(null)
  const [porBorrar, setPorBorrar]   = useState(null)

  const recargar = async () => {
    setCargando(true)
    const { datos, error } = await solicitudesTodas()
    if (error) setError(error.message)
    else { setSolicitudes(datos); setError("") }
    setCargando(false)
  }

  useEffect(() => { recargar() }, [])

  const aprobar = async s => {
    setProcesando(s.id)
    const { error } = await aprobarSolicitud(s)
    setProcesando(null)
    if (error) { setError(error.message); return }
    recargar()
  }

  const rechazar = async s => {
    setProcesando(s.id)
    const { error } = await rechazarSolicitud(s.id)
    setProcesando(null)
    if (error) { setError(error.message); return }
    recargar()
  }

  const eliminar = async id => {
    const { error } = await borrarSolicitud(id)
    setPorBorrar(null)
    if (error) { setError(error.message); return }
    recargar()
  }

  const visibles = solicitudes
    .filter(s => s.estado === filtro)
    .filter(s => s.nombre.toLowerCase().includes(busqueda.toLowerCase()))

  const pendientes = solicitudes.filter(s => s.estado === "pendiente").length

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-white mb-1" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>
            Inscripciones
          </h1>
          <p className="text-sm" style={{ color:"#64748b" }}>
            {cargando ? "Cargando…"
              : pendientes > 0
                ? `${pendientes} esperando revision`
                : "Nada pendiente por revisar"}
          </p>
        </div>
      </div>

      {error && (
        <div role="alert" className="p-3 rounded-lg text-sm" style={{ background:"rgba(248,113,113,0.1)", color:"#f87171" }}>
          {error}
        </div>
      )}

      {/* Filtros y busqueda */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-44">
          <Search size={14} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
          <input type="search" aria-label="Buscar por nombre" spellCheck={false} autoComplete="off"
            value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar…"
            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm text-white"
            style={{ background:"#1a1a1a", border:"1px solid #2a2a2a" }}
          />
        </div>
        {ESTADOS.map(e => {
          const cuantas = solicitudes.filter(s => s.estado === e.id).length
          return (
            <button key={e.id} onClick={() => setFiltro(e.id)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: filtro === e.id ? e.color : "#1a1a1a",
                color:      filtro === e.id ? "#0a0a0a" : "#64748b",
                border:     `1px solid ${filtro === e.id ? e.color : "#2a2a2a"}`,
              }}
            >{e.label}{cuantas > 0 ? ` · ${cuantas}` : ""}</button>
          )
        })}
      </div>

      {!cargando && visibles.length === 0 && (
        <div className="admin-card p-10 text-center">
          <Inbox size={30} style={{ color:"#2a2a2a" }} className="mx-auto mb-3"/>
          <p className="text-sm mb-1" style={{ color:"#94a3b8" }}>
            {filtro === "pendiente" ? "No hay inscripciones por revisar." : "Nada aqui."}
          </p>
          {filtro === "pendiente" && (
            <p className="text-xs" style={{ color:"#64748b" }}>
              Comparte los enlaces de inscripcion y los registros apareceran aqui.
            </p>
          )}
        </div>
      )}

      <div className="space-y-3">
        {visibles.map(s => {
          const edad = edadDe(s.fecha_nacimiento)
          const enProceso = procesando === s.id
          return (
            <div key={s.id} className="admin-card p-4"
              style={{ borderLeft:`3px solid ${s.programas?.color || "#64748b"}` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-white text-sm">{s.nombre}</p>
                    {edad != null && (
                      <span className="text-[11px]" style={{ color:"#64748b" }}>{edad} anos</span>
                    )}
                    {s.programas && (
                      <span className="text-[10px] px-2 py-0.5 rounded"
                        style={{ background:`${s.programas.color}20`, color:s.programas.color }}
                      >{s.programas.nombre}</span>
                    )}
                  </div>

                  <p className="text-xs mb-1" style={{ color:"#94a3b8" }}>
                    {[s.tutor_nombre, s.tutor_telefono].filter(Boolean).join(" · ") || "Sin contacto"}
                  </p>

                  {/* Lo que hay que revisar de un vistazo */}
                  {(s.lesiones_previas || s.alergias || s.condiciones) && (
                    <p className="text-[11px] mb-1" style={{ color:"#f5c518" }}>
                      {[s.lesiones_previas, s.alergias, s.condiciones].filter(Boolean).join(" · ")}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-[10px]" style={{ color:"#64748b" }}>
                      <Clock size={10}/> {fecha(s.creado_en)}
                    </span>
                    {s.acepto_imagen
                      ? <span className="flex items-center gap-1 text-[10px]" style={{ color:"#4ade80" }}>
                          <ShieldCheck size={10}/> imagen
                        </span>
                      : <span className="flex items-center gap-1 text-[10px]" style={{ color:"#64748b" }}>
                          <ShieldAlert size={10}/> sin imagen
                        </span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* La lupa del contrato */}
                  <button onClick={() => setContrato(s)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background:"#1a1a1a", color:"#94a3b8" }}
                    aria-label={`Ver acuerdo aceptado por ${s.nombre}`}
                    title="Ver acuerdo firmado"
                  ><FileText size={14}/></button>

                  {s.estado === "pendiente" && (
                    <>
                      <button onClick={() => rechazar(s)} disabled={enProceso}
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background:"#1a1a1a", color:"#64748b" }}
                        aria-label={`Rechazar a ${s.nombre}`} title="Rechazar"
                      ><X size={14}/></button>
                      <button onClick={() => aprobar(s)} disabled={enProceso}
                        className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-bold text-white"
                        style={{ background:"#c0392b", cursor: enProceso ? "wait" : "pointer" }}
                        aria-label={`Aprobar a ${s.nombre}`}
                      ><Check size={13}/> {enProceso ? "…" : "Aprobar"}</button>
                    </>
                  )}

                  {s.estado !== "pendiente" && (
                    <button onClick={() => setPorBorrar(s)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background:"#1a1a1a", color:"#f87171" }}
                      aria-label={`Eliminar solicitud de ${s.nombre}`}
                    ><Trash2 size={14}/></button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <AnimatePresence>
        {contrato && <VisorContrato solicitud={contrato} onCerrar={() => setContrato(null)}/>}
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
                Eliminar solicitud
              </h2>
              <p className="text-sm mb-1" style={{ color:"#94a3b8" }}>
                Se va a eliminar el registro de <strong className="text-white">{porBorrar.nombre}</strong>.
              </p>
              <p className="text-xs mb-5" style={{ color:"#f87171" }}>
                Con el se pierde la constancia del acuerdo que acepto. Si el
                alumno ya fue aprobado, su ficha en el padron no se toca.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setPorBorrar(null)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                  style={{ background:"#1a1a1a", color:"#94a3b8", border:"1px solid #2a2a2a" }}
                >Cancelar</button>
                <button onClick={() => eliminar(porBorrar.id)}
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

export default AdminSolicitudes
