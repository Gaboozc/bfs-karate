// Padron de alumnos — BFS Martial Arts
//
// Digitaliza el registro que hoy vive en cuaderno: datos del alumno, contacto
// del tutor, permisos firmados y las tres notas de salud indispensables.
//
// Un alumno puede cursar varios programas a la vez (karate y crossfit, por
// ejemplo), asi que las inscripciones se marcan con casillas.
//
// SOBRE LOS DATOS DE SALUD
// Solo se piden tres cosas y solo lo justo para atender una urgencia en
// clase: lesiones previas, alergias y condiciones a considerar. Nada de
// diagnosticos ni historiales. Son datos sensibles: se muestran unicamente
// al abrir la ficha, nunca en el listado.

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, Pencil, Trash2, X, Users, Search, Award, ShieldCheck, ShieldAlert, HeartPulse,
} from "lucide-react"
import {
  alumnosTodos, guardarAlumno, borrarAlumno, fijarInscripciones,
  programasTodos, gradosDeAlumno, registrarGrado,
} from "../data/supabase"

// Progresion de cintas del sistema BFS
const CINTAS = [
  "Blanco", "Blanco raya Morada", "Morada", "Morada raya Amarilla",
  "Amarilla", "Naranja", "Azul", "Azul raya Marron", "Marron", "Negro",
]

const COLOR_CINTA = {
  "Blanco":"#f5f5f5", "Blanco raya Morada":"#f5f5f5",
  "Morada":"#8b3fa8", "Morada raya Amarilla":"#8b3fa8",
  "Amarilla":"#f5c518", "Naranja":"#e07b39",
  "Azul":"#2e75b6", "Azul raya Marron":"#2e75b6",
  "Marron":"#6b4c36", "Negro":"#1a1a1a",
}

const alumnoVacio = () => ({
  nombre: "", fecha_nacimiento: "", cinta: "", estado: "activo",
  fecha_inscripcion: new Date().toISOString().slice(0, 10),
  tutor_nombre: "", tutor_telefono: "", direccion: "", contacto_emergencia: "",
  lesiones_previas: "", alergias: "", condiciones: "",
  autoriza_imagen: false, autoriza_salud: false, notas: "",
  _programas: [],
})

const edadDe = fecha => {
  if (!fecha) return null
  const n = new Date(fecha), h = new Date()
  let e = h.getFullYear() - n.getFullYear()
  const m = h.getMonth() - n.getMonth()
  if (m < 0 || (m === 0 && h.getDate() < n.getDate())) e--
  return e
}

// ── Formulario de registro ──────────────────────────────────────────────────
const Formulario = ({ alumno, programas, onGuardar, onCancelar, guardando }) => {
  const [campos, setCampos] = useState(alumno)
  const cambiar = (llave, valor) => setCampos(c => ({ ...c, [llave]: valor }))

  const alternarPrograma = id => setCampos(c => ({
    ...c,
    _programas: c._programas.includes(id)
      ? c._programas.filter(x => x !== id)
      : [...c._programas, id],
  }))

  const edad = edadDe(campos.fecha_nacimiento)
  const esMenor = edad != null && edad < 18

  const input  = "w-full px-3 py-2.5 rounded-lg text-sm text-white"
  const estilo = { background:"#0a0a0a", border:"1px solid #2a2a2a" }
  const etiq   = "block text-xs font-semibold mb-1.5 uppercase tracking-wider"
  const seccion= "text-xs font-bold uppercase tracking-widest pt-2"

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:"rgba(10,10,10,0.85)" }}
      onClick={onCancelar}
      role="dialog" aria-modal="true" aria-label={alumno.id ? "Editar alumno" : "Nuevo alumno"}
    >
      <motion.div
        initial={{ scale:0.96, y:12 }} animate={{ scale:1, y:0 }} exit={{ scale:0.96, y:12 }}
        className="admin-card w-full max-w-2xl max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
          style={{ borderBottom:"1px solid #2a2a2a", background:"#1a1a1a" }}
        >
          <h2 className="font-display text-lg text-white" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>
            {alumno.id ? "Editar alumno" : "Nuevo alumno"}
          </h2>
          <button onClick={onCancelar} aria-label="Cerrar" style={{ color:"#64748b" }}><X size={18}/></button>
        </div>

        <form onSubmit={e => { e.preventDefault(); onGuardar(campos) }} className="p-6 space-y-5">

          {/* Datos del alumno */}
          <p className={seccion} style={{ color:"#c0392b" }}>Datos del alumno</p>

          <div>
            <label htmlFor="al-nombre" className={etiq} style={{ color:"#94a3b8" }}>Nombre completo</label>
            <input id="al-nombre" className={input} style={estilo} autoFocus
              value={campos.nombre} onChange={e => cambiar("nombre", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="al-nac" className={etiq} style={{ color:"#94a3b8" }}>
                Fecha de nacimiento {edad != null && <span style={{ textTransform:"none", color:"#64748b" }}>· {edad} anos</span>}
              </label>
              <input id="al-nac" type="date" className={input} style={estilo}
                value={campos.fecha_nacimiento || ""} onChange={e => cambiar("fecha_nacimiento", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="al-alta" className={etiq} style={{ color:"#94a3b8" }}>Fecha de inscripcion</label>
              <input id="al-alta" type="date" className={input} style={estilo}
                value={campos.fecha_inscripcion || ""} onChange={e => cambiar("fecha_inscripcion", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="al-cinta" className={etiq} style={{ color:"#94a3b8" }}>Cinta actual</label>
              <select id="al-cinta" className={input} style={estilo}
                value={campos.cinta || ""} onChange={e => cambiar("cinta", e.target.value)}
              >
                <option value="" style={{ background:"#1a1a1a" }}>Sin cinta</option>
                {CINTAS.map(c => <option key={c} value={c} style={{ background:"#1a1a1a" }}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="al-estado" className={etiq} style={{ color:"#94a3b8" }}>Estado</label>
              <select id="al-estado" className={input} style={estilo}
                value={campos.estado} onChange={e => cambiar("estado", e.target.value)}
              >
                <option value="activo"   style={{ background:"#1a1a1a" }}>Activo</option>
                <option value="inactivo" style={{ background:"#1a1a1a" }}>Inactivo</option>
                <option value="baja"     style={{ background:"#1a1a1a" }}>Baja</option>
              </select>
            </div>
          </div>

          {/* Programas */}
          <p className={seccion} style={{ color:"#c0392b" }}>Programas que cursa</p>
          {programas.length === 0 ? (
            <p className="text-xs" style={{ color:"#64748b" }}>
              Todavia no hay programas. Crealos en la seccion Programas.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {programas.map(p => (
                <label key={p.id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer"
                  style={{
                    background: campos._programas.includes(p.id) ? `${p.color}18` : "#0a0a0a",
                    border: `1px solid ${campos._programas.includes(p.id) ? p.color : "#2a2a2a"}`,
                  }}
                >
                  <input type="checkbox" checked={campos._programas.includes(p.id)}
                    onChange={() => alternarPrograma(p.id)}
                    className="w-4 h-4" style={{ accentColor:p.color }}
                  />
                  <span className="text-sm truncate" style={{ color: campos._programas.includes(p.id) ? p.color : "#94a3b8" }}>
                    {p.nombre}
                  </span>
                </label>
              ))}
            </div>
          )}

          {/* Contacto */}
          <p className={seccion} style={{ color:"#c0392b" }}>
            {esMenor ? "Padre, madre o tutor" : "Contacto"}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="al-tutor" className={etiq} style={{ color:"#94a3b8" }}>Nombre</label>
              <input id="al-tutor" className={input} style={estilo}
                value={campos.tutor_nombre || ""} onChange={e => cambiar("tutor_nombre", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="al-tel" className={etiq} style={{ color:"#94a3b8" }}>Telefono</label>
              <input id="al-tel" type="tel" className={input} style={estilo}
                value={campos.tutor_telefono || ""} onChange={e => cambiar("tutor_telefono", e.target.value)}
                placeholder="55 1234 5678"
              />
            </div>
          </div>

          <div>
            <label htmlFor="al-dir" className={etiq} style={{ color:"#94a3b8" }}>Direccion</label>
            <input id="al-dir" className={input} style={estilo}
              value={campos.direccion || ""} onChange={e => cambiar("direccion", e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="al-emerg" className={etiq} style={{ color:"#94a3b8" }}>Contacto de emergencia</label>
            <input id="al-emerg" className={input} style={estilo}
              value={campos.contacto_emergencia || ""} onChange={e => cambiar("contacto_emergencia", e.target.value)}
              placeholder="Nombre y telefono de otra persona"
            />
          </div>

          {/* Salud */}
          <div className="pt-2">
            <p className={seccion} style={{ color:"#c0392b" }}>Salud</p>
            <p className="text-[11px] mt-1.5 mb-3" style={{ color:"#64748b" }}>
              Solo lo indispensable para atender una urgencia o adaptar el entrenamiento.
              Requiere el consentimiento de salud firmado.
            </p>
          </div>

          <div>
            <label htmlFor="al-lesiones" className={etiq} style={{ color:"#94a3b8" }}>Lesiones previas</label>
            <input id="al-lesiones" className={input} style={estilo}
              value={campos.lesiones_previas || ""} onChange={e => cambiar("lesiones_previas", e.target.value)}
              placeholder="Rodilla derecha, hombro izquierdo…"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="al-alergias" className={etiq} style={{ color:"#94a3b8" }}>Alergias</label>
              <input id="al-alergias" className={input} style={estilo}
                value={campos.alergias || ""} onChange={e => cambiar("alergias", e.target.value)}
                placeholder="Penicilina, nueces…"
              />
            </div>
            <div>
              <label htmlFor="al-cond" className={etiq} style={{ color:"#94a3b8" }}>Condiciones a considerar</label>
              <input id="al-cond" className={input} style={estilo}
                value={campos.condiciones || ""} onChange={e => cambiar("condiciones", e.target.value)}
                placeholder="Asma, epilepsia…"
              />
            </div>
          </div>

          {/* Permisos */}
          <p className={seccion} style={{ color:"#c0392b" }}>Permisos firmados</p>

          <div className="space-y-2">
            <label className="flex items-start gap-3 px-3 py-2.5 rounded-lg cursor-pointer"
              style={{ background:"#0a0a0a", border:"1px solid #2a2a2a" }}
            >
              <input type="checkbox" checked={campos.autoriza_imagen}
                onChange={e => cambiar("autoriza_imagen", e.target.checked)}
                className="w-4 h-4 mt-0.5" style={{ accentColor:"#c0392b" }}
              />
              <div>
                <span className="text-sm text-white block">Uso de imagen</span>
                <span className="text-[11px]" style={{ color:"#64748b" }}>
                  Puede aparecer en fotos y videos de la academia
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 px-3 py-2.5 rounded-lg cursor-pointer"
              style={{ background:"#0a0a0a", border:"1px solid #2a2a2a" }}
            >
              <input type="checkbox" checked={campos.autoriza_salud}
                onChange={e => cambiar("autoriza_salud", e.target.checked)}
                className="w-4 h-4 mt-0.5" style={{ accentColor:"#c0392b" }}
              />
              <div>
                <span className="text-sm text-white block">Datos de salud</span>
                <span className="text-[11px]" style={{ color:"#64748b" }}>
                  Autoriza guardar lesiones, alergias y condiciones
                </span>
              </div>
            </label>
          </div>

          <div>
            <label htmlFor="al-notas" className={etiq} style={{ color:"#94a3b8" }}>Notas</label>
            <textarea id="al-notas" rows={2} className={input} style={{ ...estilo, resize:"vertical" }}
              value={campos.notas || ""} onChange={e => cambiar("notas", e.target.value)}
            />
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

// ── Ficha con historial de grados ───────────────────────────────────────────
const Ficha = ({ alumno, onCerrar, onCambio }) => {
  const [grados, setGrados] = useState([])
  const [nueva, setNueva]   = useState({ cinta:"", fecha:new Date().toISOString().slice(0,10), notas:"" })
  const [guardando, setGuardando] = useState(false)

  const cargar = () => gradosDeAlumno(alumno.id).then(({ datos }) => setGrados(datos))
  useEffect(() => { cargar() }, [alumno.id])

  const promover = async e => {
    e.preventDefault()
    if (!nueva.cinta) return
    setGuardando(true)
    await registrarGrado(alumno.id, nueva.cinta, nueva.fecha, nueva.notas)
    setGuardando(false)
    setNueva({ cinta:"", fecha:new Date().toISOString().slice(0,10), notas:"" })
    cargar(); onCambio()
  }

  const salud = [alumno.lesiones_previas, alumno.alergias, alumno.condiciones].filter(Boolean)

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:"rgba(10,10,10,0.85)" }}
      onClick={onCerrar}
      role="dialog" aria-modal="true" aria-label={`Ficha de ${alumno.nombre}`}
    >
      <motion.div initial={{ scale:0.96, y:12 }} animate={{ scale:1, y:0 }}
        className="admin-card w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom:"1px solid #2a2a2a" }}>
          <div>
            <h2 className="font-display text-lg text-white" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>
              {alumno.nombre}
            </h2>
            <p className="text-[11px]" style={{ color:"#64748b" }}>
              {edadDe(alumno.fecha_nacimiento) != null ? `${edadDe(alumno.fecha_nacimiento)} anos · ` : ""}
              desde {alumno.fecha_inscripcion}
            </p>
          </div>
          <button onClick={onCerrar} aria-label="Cerrar" style={{ color:"#64748b" }}><X size={18}/></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Salud: solo aqui, nunca en el listado */}
          {salud.length > 0 && (
            <div className="p-3 rounded-lg" style={{ background:"rgba(245,197,24,0.06)", border:"1px solid rgba(245,197,24,0.2)" }}>
              <div className="flex items-center gap-2 mb-2">
                <HeartPulse size={13} style={{ color:"#f5c518" }}/>
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color:"#f5c518" }}>
                  A considerar en clase
                </span>
              </div>
              {alumno.lesiones_previas && <p className="text-xs" style={{ color:"#e2e8f0" }}>Lesiones: {alumno.lesiones_previas}</p>}
              {alumno.alergias && <p className="text-xs" style={{ color:"#e2e8f0" }}>Alergias: {alumno.alergias}</p>}
              {alumno.condiciones && <p className="text-xs" style={{ color:"#e2e8f0" }}>Condiciones: {alumno.condiciones}</p>}
            </div>
          )}

          {(alumno.tutor_nombre || alumno.tutor_telefono || alumno.contacto_emergencia) && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color:"#c0392b" }}>Contacto</p>
              {alumno.tutor_nombre && <p className="text-xs" style={{ color:"#94a3b8" }}>{alumno.tutor_nombre}</p>}
              {alumno.tutor_telefono && <p className="text-xs" style={{ color:"#94a3b8" }}>{alumno.tutor_telefono}</p>}
              {alumno.contacto_emergencia && (
                <p className="text-xs mt-1" style={{ color:"#94a3b8" }}>Emergencia: {alumno.contacto_emergencia}</p>
              )}
            </div>
          )}

          {/* Historial de cintas */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color:"#c0392b" }}>
              Historial de grados
            </p>

            {grados.length === 0 && (
              <p className="text-xs mb-3" style={{ color:"#64748b" }}>Sin promociones registradas.</p>
            )}

            <div className="space-y-2 mb-4">
              {grados.map(g => (
                <div key={g.id} className="flex items-center gap-3 px-3 py-2 rounded-lg"
                  style={{ background:"#0a0a0a", border:"1px solid #2a2a2a" }}
                >
                  <div className="w-6 h-2 rounded-sm shrink-0" style={{ background:COLOR_CINTA[g.cinta] || "#888888" }}/>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white">{g.cinta}</p>
                    {g.notas && <p className="text-[10px] truncate" style={{ color:"#64748b" }}>{g.notas}</p>}
                  </div>
                  <span className="text-[10px] shrink-0" style={{ color:"#64748b" }}>{g.fecha}</span>
                </div>
              ))}
            </div>

            <form onSubmit={promover} className="space-y-2 p-3 rounded-lg" style={{ background:"#0a0a0a", border:"1px solid #2a2a2a" }}>
              <p className="text-[11px] font-semibold" style={{ color:"#94a3b8" }}>Registrar promocion</p>
              <div className="grid grid-cols-2 gap-2">
                <select value={nueva.cinta} onChange={e => setNueva(n => ({ ...n, cinta:e.target.value }))}
                  aria-label="Nueva cinta"
                  className="px-2 py-2 rounded text-xs text-white"
                  style={{ background:"#1a1a1a", border:"1px solid #2a2a2a" }}
                >
                  <option value="" style={{ background:"#1a1a1a" }}>Elegir cinta…</option>
                  {CINTAS.map(c => <option key={c} value={c} style={{ background:"#1a1a1a" }}>{c}</option>)}
                </select>
                <input type="date" value={nueva.fecha}
                  onChange={e => setNueva(n => ({ ...n, fecha:e.target.value }))}
                  aria-label="Fecha de la promocion"
                  className="px-2 py-2 rounded text-xs text-white"
                  style={{ background:"#1a1a1a", border:"1px solid #2a2a2a" }}
                />
              </div>
              <button type="submit" disabled={!nueva.cinta || guardando}
                className="w-full py-2 rounded text-xs font-bold text-white"
                style={{ background: nueva.cinta ? "#c0392b" : "#2a2a2a", cursor: nueva.cinta ? "pointer" : "not-allowed" }}
              >{guardando ? "Guardando…" : "Registrar"}</button>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Vista principal ─────────────────────────────────────────────────────────
const AdminAlumnos = () => {
  const [alumnos, setAlumnos]     = useState([])
  const [programas, setProgramas] = useState([])
  const [cargando, setCargando]   = useState(true)
  const [error, setError]         = useState("")
  const [busqueda, setBusqueda]   = useState("")
  const [filtroPrograma, setFiltroPrograma] = useState(null)
  const [editando, setEditando]   = useState(null)
  const [viendo, setViendo]       = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [porBorrar, setPorBorrar] = useState(null)

  const recargar = async () => {
    setCargando(true)
    const [a, p] = await Promise.all([alumnosTodos(), programasTodos()])
    if (a.error) setError(a.error.message)
    else { setAlumnos(a.datos); setError("") }
    if (!p.error) setProgramas(p.datos.filter(x => x.activo))
    setCargando(false)
  }

  useEffect(() => { recargar() }, [])

  const alGuardar = async datos => {
    setGuardando(true)
    const { error, id } = await guardarAlumno(datos)
    if (!error && id) await fijarInscripciones(id, datos._programas)
    setGuardando(false)
    if (error) { setError(error.message); return }
    setEditando(null)
    recargar()
  }

  const alBorrar = async id => {
    const { error } = await borrarAlumno(id)
    setPorBorrar(null)
    if (error) { setError(error.message); return }
    recargar()
  }

  const abrirEdicion = a => setEditando({
    ...a,
    _programas: (a.inscripciones ?? []).map(i => i.programa_id),
  })

  const visibles = alumnos.filter(a => {
    const coincide = a.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const enPrograma = filtroPrograma == null ||
      (a.inscripciones ?? []).some(i => i.programa_id === filtroPrograma)
    return coincide && enPrograma
  })

  const activos = alumnos.filter(a => a.estado === "activo").length
  const sinPermisos = alumnos.filter(a => !a.autoriza_imagen).length

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-white mb-1" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>Alumnos</h1>
          <p className="text-sm" style={{ color:"#64748b" }}>
            {cargando ? "Cargando…" : `${alumnos.length} en el padron · ${activos} activo${activos !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button onClick={() => setEditando(alumnoVacio())}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white"
          style={{ background:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"14px" }}
        ><Plus size={15}/> NUEVO ALUMNO</button>
      </div>

      {error && (
        <div role="alert" className="p-3 rounded-lg text-sm" style={{ background:"rgba(248,113,113,0.1)", color:"#f87171" }}>
          {error}
        </div>
      )}

      {sinPermisos > 0 && (
        <div className="p-3 rounded-lg flex items-start gap-3" style={{ background:"rgba(245,197,24,0.08)", border:"1px solid rgba(245,197,24,0.2)" }}>
          <ShieldAlert size={15} style={{ color:"#f5c518" }} className="mt-0.5 shrink-0"/>
          <div>
            <p className="text-xs font-semibold" style={{ color:"#f5c518" }}>
              {sinPermisos} sin permiso de imagen
            </p>
            <p className="text-[11px]" style={{ color:"#94a3b8" }}>
              No pueden aparecer en fotos ni videos hasta tener la hoja firmada.
            </p>
          </div>
        </div>
      )}

      {/* Busqueda y filtros */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={14} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
          <input type="search" aria-label="Buscar alumno" spellCheck={false} autoComplete="off"
            value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar alumno…"
            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm text-white"
            style={{ background:"#1a1a1a", border:"1px solid #2a2a2a" }}
          />
        </div>
        <button onClick={() => setFiltroPrograma(null)}
          className="px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: filtroPrograma == null ? "#c0392b" : "#1a1a1a",
            color:      filtroPrograma == null ? "#ffffff" : "#64748b",
            border:     `1px solid ${filtroPrograma == null ? "#c0392b" : "#2a2a2a"}`,
          }}
        >Todos</button>
        {programas.map(p => (
          <button key={p.id} onClick={() => setFiltroPrograma(p.id)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: filtroPrograma === p.id ? p.color : "#1a1a1a",
              color:      filtroPrograma === p.id ? "#ffffff" : "#64748b",
              border:     `1px solid ${filtroPrograma === p.id ? p.color : "#2a2a2a"}`,
            }}
          >{p.nombre}</button>
        ))}
      </div>

      {!cargando && alumnos.length === 0 && (
        <div className="admin-card p-10 text-center">
          <Users size={30} style={{ color:"#2a2a2a" }} className="mx-auto mb-3"/>
          <p className="text-sm mb-1" style={{ color:"#94a3b8" }}>El padron esta vacio.</p>
          <p className="text-xs" style={{ color:"#64748b" }}>
            Antes de capturar al primer alumno, ten firmadas las hojas de permiso.
          </p>
        </div>
      )}

      {visibles.length > 0 && (
        <div className="space-y-2">
          {visibles.map(a => {
            const progs = (a.inscripciones ?? []).map(i => i.programas).filter(Boolean)
            return (
              <div key={a.id} className="admin-card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <button onClick={() => setViendo(a)} className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {a.cinta && (
                      <div className="w-6 h-2 rounded-sm shrink-0" style={{ background:COLOR_CINTA[a.cinta] || "#888888" }}/>
                    )}
                    <p className="font-semibold text-white text-sm">{a.nombre}</p>
                    {a.estado !== "activo" && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                        style={{ background:"#2a2a2a", color:"#64748b" }}
                      >{a.estado}</span>
                    )}
                    {a.autoriza_imagen
                      ? <ShieldCheck size={12} style={{ color:"#4ade80" }} aria-label="Con permiso de imagen"/>
                      : <ShieldAlert size={12} style={{ color:"#f5c518" }} aria-label="Sin permiso de imagen"/>}
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {progs.length === 0 && <span className="text-[11px]" style={{ color:"#475569" }}>sin programa</span>}
                    {progs.map(p => (
                      <span key={p.id} className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{ background:`${p.color}20`, color:p.color }}
                      >{p.nombre}</span>
                    ))}
                  </div>
                </button>

                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setViendo(a)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background:"#1a1a1a", color:"#94a3b8" }}
                    aria-label={`Ver ficha de ${a.nombre}`}
                  ><Award size={14}/></button>
                  <button onClick={() => abrirEdicion(a)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background:"#1a1a1a", color:"#94a3b8" }}
                    aria-label={`Editar ${a.nombre}`}
                  ><Pencil size={14}/></button>
                  <button onClick={() => setPorBorrar(a)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background:"#1a1a1a", color:"#f87171" }}
                    aria-label={`Eliminar ${a.nombre}`}
                  ><Trash2 size={14}/></button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <AnimatePresence>
        {editando && (
          <Formulario alumno={editando} programas={programas} guardando={guardando}
            onGuardar={alGuardar} onCancelar={() => setEditando(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viendo && (
          <Ficha alumno={viendo} onCerrar={() => setViendo(null)} onCambio={recargar}/>
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
                Eliminar alumno
              </h2>
              <p className="text-sm mb-1" style={{ color:"#94a3b8" }}>
                Se va a eliminar el registro de <strong className="text-white">{porBorrar.nombre}</strong>.
              </p>
              <p className="text-xs mb-5" style={{ color:"#f87171" }}>
                Tambien se borra su historial de grados. Si solo dejo de venir,
                cambia su estado a "baja" en vez de eliminarlo.
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

export default AdminAlumnos
