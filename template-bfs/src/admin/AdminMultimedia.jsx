// Multimedia y redes — BFS Martial Arts
//
// POR QUE NO HAY FEED AUTOMATICO
// Instagram y Facebook exigen un token de Meta que caduca cada 60 dias y que
// en un sitio sin backend quedaria expuesto en el navegador de cualquiera.
// TikTok pide revision de app. La unica red incrustable sin llave es YouTube:
// con el ID de una playlist, la seccion se actualiza sola.
//
// Para las demas, el Sensei pega la URL de la publicacion que quiere lucir.
// No es automatico, pero para una academia es mejor: se muestra el torneo
// ganado, no lo que tocara publicar ayer.

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, Trash2, X, Save, Youtube, Link2, Image as ImagenIcono, ExternalLink, GripVertical,
} from "lucide-react"
import {
  ajustesTodos, guardarAjustes,
  publicacionesTodas, guardarPublicacion, borrarPublicacion,
} from "../data/supabase"

const REDES = [
  { id:"instagram", nombre:"Instagram", color:"#e1306c" },
  { id:"tiktok",    nombre:"TikTok",    color:"#25f4ee" },
  { id:"facebook",  nombre:"Facebook",  color:"#1877f2" },
  { id:"youtube",   nombre:"YouTube",   color:"#ff0000" },
  { id:"otra",      nombre:"Otra",      color:"#888888" },
]

const colorDeRed = red => REDES.find(r => r.id === red)?.color ?? "#888888"

// Adivina la red por el dominio. Es una comodidad, no una validacion: el
// Sensei puede corregirla, y una URL rara simplemente cae en "otra".
const redSegunUrl = url => {
  const u = url.toLowerCase()
  if (u.includes("instagram."))                    return "instagram"
  if (u.includes("tiktok."))                       return "tiktok"
  if (u.includes("facebook.") || u.includes("fb.watch")) return "facebook"
  if (u.includes("youtube.")  || u.includes("youtu.be")) return "youtube"
  return "otra"
}

// Acepta el ID pelado o la URL completa de la playlist. Pegar la URL entera es
// lo que hace cualquiera, asi que pedir "solo el ID" seria pedir que falle.
const idDePlaylist = texto => {
  const t = (texto || "").trim()
  const m = t.match(/[?&]list=([A-Za-z0-9_-]+)/)
  return m ? m[1] : t
}

const publicacionVacia = () => ({ red:"instagram", url:"", titulo:"", imagen:"", orden:0, publicado:true })

// ── Formulario de publicacion ───────────────────────────────────────────────
const Formulario = ({ publicacion, onGuardar, onCancelar, guardando }) => {
  const [campos, setCampos] = useState(publicacion)
  const cambiar = (llave, valor) => setCampos(c => ({ ...c, [llave]: valor }))

  const input  = "w-full px-3 py-2.5 rounded-lg text-sm text-white"
  const estilo = { background:"#0a0a0a", border:"1px solid #2a2a2a" }
  const etiq   = "block text-xs font-semibold mb-1.5 uppercase tracking-wider"

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:"rgba(10,10,10,0.85)" }}
      onClick={onCancelar}
      role="dialog" aria-modal="true" aria-label={publicacion.id ? "Editar publicacion" : "Nueva publicacion"}
    >
      <motion.div
        initial={{ scale:0.96, y:12 }} animate={{ scale:1, y:0 }} exit={{ scale:0.96, y:12 }}
        className="admin-card w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom:"1px solid #2a2a2a" }}>
          <h2 className="font-display text-lg text-white" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>
            {publicacion.id ? "Editar publicacion" : "Nueva publicacion"}
          </h2>
          <button onClick={onCancelar} aria-label="Cerrar" style={{ color:"#64748b" }}><X size={18}/></button>
        </div>

        <form onSubmit={e => { e.preventDefault(); onGuardar(campos) }} className="p-6 space-y-4">
          <div>
            <label htmlFor="pu-url" className={etiq} style={{ color:"#94a3b8" }}>
              Enlace de la publicacion
            </label>
            <input id="pu-url" className={input} style={estilo} autoFocus
              value={campos.url}
              onChange={e => {
                const url = e.target.value
                // La red se ajusta sola al pegar; el Sensei no tiene por que
                // elegirla si la URL ya lo dice
                setCampos(c => ({ ...c, url, red: url ? redSegunUrl(url) : c.red }))
              }}
              placeholder="https://www.instagram.com/p/…"
            />
            <p className="text-[11px] mt-1.5" style={{ color:"#64748b" }}>
              Abre la publicacion, copia el enlace y pegalo aqui.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="pu-red" className={etiq} style={{ color:"#94a3b8" }}>Red</label>
              <select id="pu-red" className={input} style={estilo}
                value={campos.red} onChange={e => cambiar("red", e.target.value)}
              >
                {REDES.map(r => (
                  <option key={r.id} value={r.id} style={{ background:"#1a1a1a" }}>{r.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pu-orden" className={etiq} style={{ color:"#94a3b8" }}>Orden</label>
              <input id="pu-orden" type="number" className={input} style={estilo}
                value={campos.orden} onChange={e => cambiar("orden", Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label htmlFor="pu-titulo" className={etiq} style={{ color:"#94a3b8" }}>
              Titulo <span style={{ textTransform:"none", fontWeight:400, color:"#64748b" }}>· opcional</span>
            </label>
            <input id="pu-titulo" className={input} style={estilo}
              value={campos.titulo || ""} onChange={e => cambiar("titulo", e.target.value)}
              placeholder="Primer lugar en el estatal"
            />
          </div>

          <div>
            <label htmlFor="pu-img" className={etiq} style={{ color:"#94a3b8" }}>
              Miniatura <span style={{ textTransform:"none", fontWeight:400, color:"#64748b" }}>· opcional</span>
            </label>
            <input id="pu-img" className={input} style={estilo}
              value={campos.imagen || ""} onChange={e => cambiar("imagen", e.target.value)}
              placeholder="https://…"
            />
            <p className="text-[11px] mt-1.5" style={{ color:"#64748b" }}>
              Sin miniatura se muestra el logo de la red. Redes sociales no
              permiten tomar la imagen automaticamente desde otro sitio.
            </p>
          </div>

          <label className="flex items-center gap-3 cursor-pointer pt-1">
            <input type="checkbox" checked={campos.publicado}
              onChange={e => cambiar("publicado", e.target.checked)}
              className="w-4 h-4" style={{ accentColor:"#c0392b" }}
            />
            <span className="text-sm text-white">Mostrar en el sitio</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancelar}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
              style={{ background:"#1a1a1a", color:"#94a3b8", border:"1px solid #2a2a2a" }}
            >Cancelar</button>
            <button type="submit" disabled={!campos.url.trim() || guardando}
              className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white"
              style={{
                background: campos.url.trim() ? "#c0392b" : "#2a2a2a",
                cursor: campos.url.trim() ? "pointer" : "not-allowed",
              }}
            >{guardando ? "Guardando…" : "Guardar"}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// ── Vista ───────────────────────────────────────────────────────────────────
const AdminMultimedia = () => {
  const [ajustes, setAjustes]   = useState({})
  const [publis, setPublis]     = useState([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado]   = useState(false)
  const [error, setError]         = useState("")
  const [editando, setEditando]   = useState(null)

  const recargar = async () => {
    setCargando(true)
    const [a, p] = await Promise.all([ajustesTodos(), publicacionesTodas()])
    if (a.error) setError(a.error.message); else setAjustes(a.datos)
    if (!p.error) setPublis(p.datos)
    setCargando(false)
  }

  useEffect(() => { recargar() }, [])

  const cambiarAjuste = (clave, valor) => {
    setAjustes(a => ({ ...a, [clave]: valor }))
    setGuardado(false)
  }

  const guardarTodo = async () => {
    setGuardando(true); setError("")
    const { error } = await guardarAjustes({
      ...ajustes,
      // Se normaliza al guardar, no al escribir: corregir el campo mientras
      // alguien teclea le mueve el cursor y desconcierta
      youtube_playlist: idDePlaylist(ajustes.youtube_playlist),
    })
    setGuardando(false)
    if (error) { setError(error.message); return }
    setGuardado(true)
    recargar()
  }

  const guardarPubli = async datos => {
    setGuardando(true)
    const { error } = await guardarPublicacion(datos)
    setGuardando(false)
    if (error) { setError(error.message); return }
    setEditando(null)
    recargar()
  }

  const eliminar = async p => {
    if (!window.confirm(`Quitar esta publicacion de ${p.red}?`)) return
    const { error } = await borrarPublicacion(p.id)
    if (error) { setError(error.message); return }
    recargar()
  }

  const input  = "w-full px-3 py-2.5 rounded-lg text-sm text-white"
  const estilo = { background:"#0a0a0a", border:"1px solid #2a2a2a" }
  const etiq   = "block text-xs font-semibold mb-1.5 uppercase tracking-wider"

  const playlist = idDePlaylist(ajustes.youtube_playlist)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-white mb-1" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>
          Multimedia y redes
        </h1>
        <p className="text-sm" style={{ color:"#64748b" }}>
          Lo que se muestra en el bloque "Miranos en Accion" del inicio.
        </p>
      </div>

      {error && (
        <div role="alert" className="p-3 rounded-lg text-sm" style={{ background:"rgba(248,113,113,0.1)", color:"#f87171" }}>
          {error}
        </div>
      )}

      {/* Videos */}
      <section className="admin-card p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <Youtube size={17} style={{ color:"#ff0000" }}/>
          <h2 className="text-sm font-bold text-white">Videos</h2>
        </div>
        <p className="text-xs" style={{ color:"#64748b" }}>
          Esta es la unica parte que se actualiza sola: pega el enlace de una
          playlist de YouTube y cada video que subas aparecera en el sitio sin
          que tengas que volver aqui.
        </p>
        <div>
          <label htmlFor="mm-playlist" className={etiq} style={{ color:"#94a3b8" }}>
            Playlist de YouTube
          </label>
          <input id="mm-playlist" className={input} style={estilo}
            value={ajustes.youtube_playlist ?? ""}
            onChange={e => cambiarAjuste("youtube_playlist", e.target.value)}
            placeholder="https://youtube.com/playlist?list=PL…"
          />
          {playlist && (
            <p className="text-[11px] mt-1.5" style={{ color:"#4ade80" }}>
              Playlist detectada: {playlist}
            </p>
          )}
        </div>
      </section>

      {/* Redes */}
      <section className="admin-card p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <Link2 size={17} style={{ color:"#c0392b" }}/>
          <h2 className="text-sm font-bold text-white">Perfiles de redes</h2>
        </div>
        <p className="text-xs" style={{ color:"#64748b" }}>
          Los que dejes vacios no se muestran en el sitio, en vez de llevar a
          una pagina que no existe.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {REDES.filter(r => r.id !== "otra").map(r => (
            <div key={r.id}>
              <label htmlFor={`mm-${r.id}`} className={etiq} style={{ color:r.color }}>{r.nombre}</label>
              <input id={`mm-${r.id}`} className={input} style={estilo}
                value={ajustes[`red_${r.id}`] ?? ""}
                onChange={e => cambiarAjuste(`red_${r.id}`, e.target.value)}
                placeholder={`https://${r.id}.com/…`}
              />
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button onClick={guardarTodo} disabled={guardando || cargando}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white"
          style={{ background:"#c0392b", cursor: guardando ? "wait" : "pointer" }}
        ><Save size={14}/> {guardando ? "Guardando…" : "Guardar videos y redes"}</button>
        {guardado && <span className="text-xs" style={{ color:"#4ade80" }}>Guardado</span>}
      </div>

      {/* Publicaciones */}
      <section className="admin-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <ImagenIcono size={17} style={{ color:"#c0392b" }}/>
              <h2 className="text-sm font-bold text-white">Publicaciones destacadas</h2>
            </div>
            <p className="text-xs" style={{ color:"#64748b" }}>
              {publis.length} publicacion{publis.length !== 1 ? "es" : ""}
            </p>
          </div>
          <button onClick={() => setEditando(publicacionVacia())}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white"
            style={{ background:"#c0392b" }}
          ><Plus size={13}/> Agregar</button>
        </div>

        <p className="text-xs" style={{ color:"#64748b" }}>
          Instagram, Facebook y TikTok no permiten traer las publicaciones
          automaticamente sin un servidor propio. A cambio, aqui eliges cuales
          se lucen: conviene el torneo ganado, no lo ultimo que tocara publicar.
        </p>

        {cargando ? (
          <p className="text-sm py-4" style={{ color:"#64748b" }}>Cargando…</p>
        ) : publis.length === 0 ? (
          <p className="text-sm py-6 text-center" style={{ color:"#64748b" }}>
            Todavia no hay publicaciones. El bloque no se muestra en el sitio
            hasta que agregues la primera.
          </p>
        ) : (
          <div className="space-y-2">
            {publis.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background:"#0a0a0a", border:"1px solid #2a2a2a" }}
              >
                <GripVertical size={14} style={{ color:"#334155" }} aria-hidden="true"/>
                <div className="w-2 h-8 rounded-sm shrink-0" style={{ background:colorDeRed(p.red) }}/>
                {p.imagen
                  ? <img src={p.imagen} alt="" className="w-10 h-10 rounded object-cover shrink-0"/>
                  : <div className="w-10 h-10 rounded shrink-0" style={{ background:"#1a1a1a" }}/>}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">{p.titulo || "Sin titulo"}</p>
                  <p className="text-[11px] truncate" style={{ color:"#64748b" }}>
                    {REDES.find(r => r.id === p.red)?.nombre} · {p.url}
                  </p>
                </div>
                {!p.publicado && (
                  <span className="text-[10px] px-2 py-0.5 rounded shrink-0"
                    style={{ background:"#1a1a1a", color:"#64748b" }}
                  >Oculta</span>
                )}
                <a href={p.url} target="_blank" rel="noopener noreferrer"
                  aria-label="Abrir publicacion" style={{ color:"#64748b" }}
                ><ExternalLink size={14}/></a>
                <button onClick={() => setEditando(p)} className="text-xs px-2" style={{ color:"#94a3b8" }}>
                  Editar
                </button>
                <button onClick={() => eliminar(p)} aria-label="Eliminar" style={{ color:"#64748b" }}>
                  <Trash2 size={14}/>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <AnimatePresence>
        {editando && (
          <Formulario publicacion={editando} guardando={guardando}
            onGuardar={guardarPubli} onCancelar={() => setEditando(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminMultimedia
