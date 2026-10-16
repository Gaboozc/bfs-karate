// Administracion de resenas — BFS Martial Arts
//
// La academia tiene opiniones reales en su ficha de Google. Aqui el Sensei
// elige cuales lucir en el inicio del sitio.
//
// Por que se copian a mano y no se traen solas:
//
//   La API de Places de Google devuelve cinco resenas como maximo, pide una
//   llave con facturacion activa, y esa llave quedaria expuesta en el
//   navegador porque el sitio no tiene servidor propio. Seria pagar una
//   dependencia para seguir curando el contenido a mano de todos modos.
//
// La regla al capturar: el texto va tal cual lo escribio la persona y con su
// nombre. Si se corrige algo, que sea una falta de dedo, nunca el sentido.
// Una opinion redactada por nosotros no es una opinion.

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Star, ExternalLink } from "lucide-react"
import { resenasTodas, guardarResena, borrarResena, ajustesTodos, guardarAjustes } from "../data/supabase"

const FICHA = "https://maps.app.goo.gl/QJrgy1DTuhbAYHrE8"

const resenaVacia = () => ({
  autor: "", calificacion: 5, texto: "",
  cuando: "", fecha: "", fuente: "google", publicado: true, orden: 0,
})

// ── Formulario ──────────────────────────────────────────────────────────────
const Formulario = ({ resena, onGuardar, onCancelar, guardando }) => {
  const [campos, setCampos] = useState(resena)
  const cambiar = (llave, valor) => setCampos(c => ({ ...c, [llave]: valor }))

  const listo = campos.autor.trim() && campos.texto.trim()

  const enviar = e => {
    e.preventDefault()
    onGuardar({
      ...campos,
      autor: campos.autor.trim(),
      texto: campos.texto.trim(),
      // Una fecha vacia es null en la base, no una cadena vacia
      fecha: campos.fecha || null,
    })
  }

  const input = "w-full px-3 py-2.5 rounded-lg text-sm text-white"
  const estiloInput = { background: "#0a0a0a", border: "1px solid #2a2a2a" }
  const etiqueta = "block text-xs font-semibold mb-1.5 uppercase tracking-wider"

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,10,10,0.85)" }}
      onClick={onCancelar}
      role="dialog" aria-modal="true" aria-label={resena.id ? "Editar resena" : "Nueva resena"}
    >
      <motion.div
        initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 12 }}
        className="admin-card w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #2a2a2a" }}>
          <h2 className="font-display text-lg text-white" style={{ fontFamily: "'Bebas Neue',Impact,sans-serif" }}>
            {resena.id ? "Editar resena" : "Nueva resena"}
          </h2>
          <button onClick={onCancelar} aria-label="Cerrar" style={{ color: "#64748b" }}>
            <X size={18}/>
          </button>
        </div>

        <form onSubmit={enviar} className="p-6 space-y-4">
          <div className="p-3 rounded-lg text-xs leading-relaxed"
            style={{ background: "rgba(245,193,24,0.07)", border: "1px solid rgba(245,193,24,0.2)", color: "#94a3b8" }}
          >
            Copia el nombre y el texto <strong className="text-white">tal cual aparecen en Google</strong>.
            Una opinion escrita por nosotros no es una opinion.{" "}
            <a href={FICHA} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold" style={{ color: "#f5c518" }}
            >Abrir la ficha <ExternalLink size={11}/></a>
          </div>

          <div>
            <label htmlFor="re-autor" className={etiqueta} style={{ color: "#94a3b8" }}>Quien la escribio</label>
            <input id="re-autor" className={input} style={estiloInput} autoFocus
              value={campos.autor} onChange={e => cambiar("autor", e.target.value)}
              placeholder="Lorena Lopez"
            />
          </div>

          <div>
            <label htmlFor="re-texto" className={etiqueta} style={{ color: "#94a3b8" }}>Lo que escribio</label>
            <textarea id="re-texto" rows={5} className={input} style={{ ...estiloInput, resize: "vertical" }}
              value={campos.texto} onChange={e => cambiar("texto", e.target.value)}
              placeholder="Pega aqui el texto de la resena, sin cambiarlo."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="re-cal" className={etiqueta} style={{ color: "#94a3b8" }}>Estrellas</label>
              <select id="re-cal" className={input} style={estiloInput}
                value={campos.calificacion} onChange={e => cambiar("calificacion", Number(e.target.value))}
              >
                {[5,4,3,2,1].map(n => (
                  <option key={n} value={n} style={{ background: "#1a1a1a" }}>{n} estrella{n !== 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="re-orden" className={etiqueta} style={{ color: "#94a3b8" }}>Orden</label>
              <input id="re-orden" type="number" className={input} style={estiloInput}
                value={campos.orden} onChange={e => cambiar("orden", Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              {/* Google muestra "Hace un mes", no una fecha. Se guarda su forma
                  porque es la que la gente reconoce al ir a comprobarlo. */}
              <label htmlFor="re-cuando" className={etiqueta} style={{ color: "#94a3b8" }}>
                Antiguedad <span style={{ textTransform: "none", fontWeight: 400 }}>— como la muestra Google</span>
              </label>
              <input id="re-cuando" className={input} style={estiloInput}
                value={campos.cuando || ""} onChange={e => cambiar("cuando", e.target.value)}
                placeholder="Hace un mes"
              />
            </div>
            <div>
              <label htmlFor="re-fecha" className={etiqueta} style={{ color: "#94a3b8" }}>
                Fecha aprox. <span style={{ textTransform: "none", fontWeight: 400 }}>— opcional</span>
              </label>
              <input id="re-fecha" type="date" className={input} style={estiloInput}
                value={campos.fecha || ""} onChange={e => cambiar("fecha", e.target.value)}
              />
            </div>
          </div>

          <label className="flex items-center gap-3 py-2 cursor-pointer">
            <input type="checkbox" checked={campos.publicado}
              onChange={e => cambiar("publicado", e.target.checked)}
              className="w-4 h-4" style={{ accentColor: "#c0392b" }}
            />
            <span className="text-sm text-white">Mostrar en el inicio</span>
            <span className="text-xs" style={{ color: "#64748b" }}>
              {campos.publicado ? "visible para todos" : "guardada, sin publicar"}
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

// ── Resumen de la ficha ─────────────────────────────────────────────────────
// La calificacion y el total que se muestran en el inicio. Viven aqui y no en
// el codigo para que no envejezcan sin que nadie se entere: llegan opiniones
// nuevas y el numero del sitio se queda viejo.
const ResumenFicha = ({ onAviso }) => {
  const [campos, setCampos]   = useState({ google_calificacion: "", google_total: "", google_url: "" })
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    ajustesTodos().then(({ datos }) => {
      const mapa = Object.fromEntries((datos ?? []).map(a => [a.clave, a.valor ?? ""]))
      setCampos({
        google_calificacion: mapa.google_calificacion ?? "",
        google_total:        mapa.google_total ?? "",
        google_url:          mapa.google_url ?? FICHA,
      })
    })
  }, [])

  const guardar = async () => {
    setGuardando(true)
    const { error } = await guardarAjustes(campos)
    setGuardando(false)
    onAviso(error ? error.message : "Resumen actualizado.")
  }

  const input = "w-full px-3 py-2.5 rounded-lg text-sm text-white"
  const estiloInput = { background: "#0a0a0a", border: "1px solid #2a2a2a" }
  const etiqueta = "block text-xs font-semibold mb-1.5 uppercase tracking-wider"

  return (
    <div className="admin-card p-5">
      <h2 className="font-display text-lg text-white mb-1" style={{ fontFamily: "'Bebas Neue',Impact,sans-serif" }}>
        Resumen de la ficha
      </h2>
      <p className="text-xs mb-4" style={{ color: "#64748b" }}>
        Es el dato que cualquiera puede ir a comprobar en Google. Actualizalo cuando lleguen opiniones nuevas.
      </p>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="g-cal" className={etiqueta} style={{ color: "#94a3b8" }}>Calificacion</label>
          <input id="g-cal" className={input} style={estiloInput} placeholder="5.0"
            value={campos.google_calificacion}
            onChange={e => setCampos(c => ({ ...c, google_calificacion: e.target.value }))}
          />
        </div>
        <div>
          <label htmlFor="g-tot" className={etiqueta} style={{ color: "#94a3b8" }}>Total de opiniones</label>
          <input id="g-tot" className={input} style={estiloInput} placeholder="56"
            value={campos.google_total}
            onChange={e => setCampos(c => ({ ...c, google_total: e.target.value }))}
          />
        </div>
        <div>
          <label htmlFor="g-url" className={etiqueta} style={{ color: "#94a3b8" }}>Enlace a la ficha</label>
          <input id="g-url" className={input} style={estiloInput}
            value={campos.google_url}
            onChange={e => setCampos(c => ({ ...c, google_url: e.target.value }))}
          />
        </div>
      </div>

      <button onClick={guardar} disabled={guardando}
        className="mt-4 px-5 py-2.5 rounded-lg text-sm font-bold text-white"
        style={{ background: "#c0392b", fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: "14px" }}
      >{guardando ? "Guardando…" : "GUARDAR RESUMEN"}</button>
    </div>
  )
}

// ── Vista principal ─────────────────────────────────────────────────────────
const AdminResenas = () => {
  const [resenas, setResenas]     = useState([])
  const [cargando, setCargando]   = useState(true)
  const [error, setError]         = useState("")
  const [aviso, setAviso]         = useState("")
  const [editando, setEditando]   = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [porBorrar, setPorBorrar] = useState(null)

  const recargar = async () => {
    setCargando(true)
    const { datos, error } = await resenasTodas()
    if (error) setError(error.message)
    else { setResenas(datos); setError("") }
    setCargando(false)
  }

  useEffect(() => { recargar() }, [])

  const alGuardar = async resena => {
    setGuardando(true)
    const { error } = await guardarResena(resena)
    setGuardando(false)
    if (error) { setError(error.message); return }
    setEditando(null)
    recargar()
  }

  const alBorrar = async id => {
    const { error } = await borrarResena(id)
    setPorBorrar(null)
    if (error) { setError(error.message); return }
    recargar()
  }

  const alternarPublicado = async r => {
    const { error } = await guardarResena({ id: r.id, publicado: !r.publicado })
    if (error) { setError(error.message); return }
    recargar()
  }

  const publicadas = resenas.filter(r => r.publicado).length

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-white mb-1" style={{ fontFamily: "'Bebas Neue',Impact,sans-serif" }}>Resenas</h1>
          <p className="text-sm" style={{ color: "#64748b" }}>
            {cargando ? "Cargando…" : `${resenas.length} capturada${resenas.length !== 1 ? "s" : ""} · ${publicadas} en el sitio`}
          </p>
        </div>
        <button onClick={() => setEditando(resenaVacia())}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white"
          style={{ background: "#c0392b", fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: "14px" }}
        ><Plus size={15}/> <span className="hidden sm:inline">NUEVA RESENA</span></button>
      </div>

      {error && (
        <div role="alert" className="p-3 rounded-lg text-sm" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}>
          {error}
        </div>
      )}
      {aviso && (
        <div role="status" className="p-3 rounded-lg text-sm" style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80" }}>
          {aviso}
        </div>
      )}

      <ResumenFicha onAviso={setAviso}/>

      {!cargando && resenas.length === 0 && (
        <div className="admin-card p-10 text-center">
          <Star size={30} style={{ color: "#2a2a2a" }} className="mx-auto mb-3"/>
          <p className="text-sm mb-1" style={{ color: "#94a3b8" }}>Todavia no hay resenas capturadas.</p>
          <p className="text-xs" style={{ color: "#64748b" }}>
            Mientras tanto el inicio no muestra ninguna. Antes una seccion vacia que una opinion inventada.
          </p>
        </div>
      )}

      {resenas.length > 0 && (
        <div className="space-y-3">
          {resenas.map(r => (
            <div key={r.id} className="admin-card p-4 flex flex-col sm:flex-row sm:items-start gap-4"
              style={{ borderLeft: "3px solid #f5c518" }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-white text-sm">{r.autor}</span>
                  <span style={{ color: "#f5c518", fontSize: "12px" }}>{"★".repeat(r.calificacion)}</span>
                  {r.cuando && <span className="text-xs" style={{ color: "#64748b" }}>· {r.cuando}</span>}
                  {!r.publicado && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
                      style={{ background: "#2a2a2a", color: "#64748b" }}
                    >Sin publicar</span>
                  )}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>{r.texto}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => alternarPublicado(r)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "#1a1a1a", color: r.publicado ? "#4ade80" : "#64748b" }}
                  aria-label={r.publicado ? `Ocultar la resena de ${r.autor}` : `Mostrar la resena de ${r.autor}`}
                  title={r.publicado ? "Visible en el inicio" : "Oculta"}
                >{r.publicado ? <Eye size={14}/> : <EyeOff size={14}/>}</button>

                <button onClick={() => setEditando(r)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "#1a1a1a", color: "#94a3b8" }}
                  aria-label={`Editar la resena de ${r.autor}`}
                ><Pencil size={14}/></button>

                <button onClick={() => setPorBorrar(r)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "#1a1a1a", color: "#f87171" }}
                  aria-label={`Eliminar la resena de ${r.autor}`}
                ><Trash2 size={14}/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editando && (
          <Formulario resena={editando} guardando={guardando}
            onGuardar={alGuardar} onCancelar={() => setEditando(null)}
          />
        )}
      </AnimatePresence>

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
                Eliminar resena
              </h2>
              <p className="text-sm mb-1" style={{ color: "#94a3b8" }}>
                Se va a eliminar la opinion de <strong className="text-white">{porBorrar.autor}</strong>.
              </p>
              <p className="text-xs mb-5" style={{ color: "#64748b" }}>
                Esto no se puede deshacer. Si solo quieres quitarla del inicio, usa el ojo para ocultarla.
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

export default AdminResenas
