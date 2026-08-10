// Inventario de la tienda — BFS Martial Arts
//
// Controla el catalogo y las existencias. Lo que se agota deja de mostrarse
// en el sitio automaticamente, sin que nadie tenga que acordarse de ocultarlo.

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Pencil, Trash2, X, Package, AlertTriangle, Minus, Tag } from "lucide-react"
import {
  productosTodos, guardarProducto, borrarProducto, ajustarExistencias,
  categoriasTodas, guardarCategoria, borrarCategoria,
} from "../data/supabase"
import FotosProducto from "./FotosProducto"

const productoVacio = () => ({
  nombre: "", categoria_id: null, precio: "", descripcion: "",
  imagen: "", etiqueta: "", destacado: false, disponible: true,
  existencias: "", alerta_minima: 3,
})

// ── Formulario ──────────────────────────────────────────────────────────────
const Formulario = ({ producto, categorias, onGuardar, onCancelar, guardando }) => {
  const [campos, setCampos] = useState(producto)
  const cambiar = (llave, valor) => setCampos(c => ({ ...c, [llave]: valor }))

  const enviar = e => {
    e.preventDefault()
    onGuardar({
      ...campos,
      // Vacio significa "sin definir", no cero
      precio:       campos.precio === "" ? null : Number(campos.precio),
      existencias:  campos.existencias === "" ? null : Number(campos.existencias),
      categoria_id: campos.categoria_id || null,
      // Se conserva el texto por compatibilidad con el sitio publico
      categoria:    categorias.find(c => c.id === Number(campos.categoria_id))?.nombre ?? null,
    })
  }

  const input = "w-full px-3 py-2.5 rounded-lg text-sm text-white"
  const estilo = { background:"#0a0a0a", border:"1px solid #2a2a2a" }
  const etiq = "block text-xs font-semibold mb-1.5 uppercase tracking-wider"

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:"rgba(10,10,10,0.85)" }}
      onClick={onCancelar}
      role="dialog" aria-modal="true" aria-label={producto.id ? "Editar producto" : "Nuevo producto"}
    >
      <motion.div
        initial={{ scale:0.96, y:12 }} animate={{ scale:1, y:0 }} exit={{ scale:0.96, y:12 }}
        className="admin-card w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom:"1px solid #2a2a2a" }}>
          <h2 className="font-display text-lg text-white" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>
            {producto.id ? "Editar producto" : "Nuevo producto"}
          </h2>
          <button onClick={onCancelar} aria-label="Cerrar" style={{ color:"#64748b" }}><X size={18}/></button>
        </div>

        <form onSubmit={enviar} className="p-6 space-y-4">
          <div>
            <label htmlFor="pr-nombre" className={etiq} style={{ color:"#94a3b8" }}>Nombre</label>
            <input id="pr-nombre" className={input} style={estilo} autoFocus
              value={campos.nombre} onChange={e => cambiar("nombre", e.target.value)}
              placeholder="Gi BFS Pro"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="pr-cat" className={etiq} style={{ color:"#94a3b8" }}>Categoria</label>
              <select id="pr-cat" className={input} style={estilo}
                value={campos.categoria_id ?? ""} onChange={e => cambiar("categoria_id", e.target.value)}
              >
                <option value="" style={{ background:"#1a1a1a" }}>Sin categoria</option>
                {categorias.map(c => (
                  <option key={c.id} value={c.id} style={{ background:"#1a1a1a" }}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pr-precio" className={etiq} style={{ color:"#94a3b8" }}>Precio</label>
              <input id="pr-precio" type="number" min="0" step="1" className={input} style={estilo}
                value={campos.precio ?? ""} onChange={e => cambiar("precio", e.target.value)}
                placeholder="Vacio = Consultar"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="pr-exist" className={etiq} style={{ color:"#94a3b8" }}>Existencias</label>
              <input id="pr-exist" type="number" min="0" step="1" className={input} style={estilo}
                value={campos.existencias ?? ""} onChange={e => cambiar("existencias", e.target.value)}
                placeholder="Vacio = sin control"
              />
            </div>
            <div>
              <label htmlFor="pr-alerta" className={etiq} style={{ color:"#94a3b8" }}>Avisar cuando queden</label>
              <input id="pr-alerta" type="number" min="0" step="1" className={input} style={estilo}
                value={campos.alerta_minima ?? 3} onChange={e => cambiar("alerta_minima", Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label htmlFor="pr-desc" className={etiq} style={{ color:"#94a3b8" }}>Descripcion</label>
            <textarea id="pr-desc" rows={2} className={input} style={{ ...estilo, resize:"vertical" }}
              value={campos.descripcion || ""} onChange={e => cambiar("descripcion", e.target.value)}
              placeholder="Kimono oficial de algodon canvas 12oz."
            />
          </div>

          <div>
            <label htmlFor="pr-etq" className={etiq} style={{ color:"#94a3b8" }}>
              Etiqueta <span style={{ textTransform:"none", fontWeight:400, color:"#64748b" }}>· opcional</span>
            </label>
            <input id="pr-etq" className={input} style={estilo}
              value={campos.etiqueta || ""} onChange={e => cambiar("etiqueta", e.target.value)}
              placeholder="Nuevo, Mas vendido…"
            />
          </div>

          <FotosProducto productoId={producto.id}/>

          {/* Las dos casillas decian "Mostrar en el sitio" y "Destacar en la
              tienda": suenan casi igual y no explicaban la diferencia. Ahora
              cada una dice que hace. */}
          <div className="flex flex-col gap-3 pt-1">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={campos.disponible}
                onChange={e => cambiar("disponible", e.target.checked)}
                className="w-4 h-4 mt-0.5 shrink-0" style={{ accentColor:"#c0392b" }}
              />
              <span className="text-sm text-white">
                Visible en la tienda
                <span className="block text-xs mt-0.5" style={{ color:"#64748b" }}>
                  Desmarcado, nadie lo ve en el sitio. Sirve para ocultarlo sin
                  borrarlo mientras se agota o se prepara.
                </span>
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={campos.destacado}
                onChange={e => cambiar("destacado", e.target.checked)}
                className="w-4 h-4 mt-0.5 shrink-0" style={{ accentColor:"#c0392b" }}
              />
              <span className="text-sm text-white">
                Destacado
                <span className="block text-xs mt-0.5" style={{ color:"#64748b" }}>
                  Aparece primero en la tienda, antes que los demas.
                </span>
              </span>
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

// ── Gestor de categorias ────────────────────────────────────────────────────
// Vive dentro del inventario, no en su propia seccion: se administran mientras
// se cargan productos, que es cuando uno nota que falta una.
const PanelCategorias = ({ categorias, productos, onCerrar, onCambio }) => {
  const [nueva, setNueva] = useState("")
  const [error, setError] = useState("")
  const [porBorrar, setPorBorrar] = useState(null)

  const cuantosUsan = id => productos.filter(p => p.categoria_id === id).length

  const crear = async e => {
    e.preventDefault()
    const nombre = nueva.trim()
    if (!nombre) return
    if (categorias.some(c => c.nombre.toLowerCase() === nombre.toLowerCase())) {
      setError("Ya existe una categoria con ese nombre."); return
    }
    const { error } = await guardarCategoria({ nombre, orden: categorias.length })
    if (error) { setError(error.message); return }
    setNueva(""); setError(""); onCambio()
  }

  const eliminar = async cat => {
    const { error } = await borrarCategoria(cat.id)
    setPorBorrar(null)
    if (error) { setError(error.message); return }
    onCambio()
  }

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:"rgba(10,10,10,0.85)" }}
      onClick={onCerrar}
      role="dialog" aria-modal="true" aria-label="Categorias de la tienda"
    >
      <motion.div initial={{ scale:0.96, y:12 }} animate={{ scale:1, y:0 }}
        className="admin-card w-full max-w-md max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom:"1px solid #2a2a2a" }}>
          <h2 className="font-display text-lg text-white" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>
            Categorias
          </h2>
          <button onClick={onCerrar} aria-label="Cerrar" style={{ color:"#64748b" }}><X size={18}/></button>
        </div>

        <div className="p-6 space-y-4">
          <form onSubmit={crear} className="flex gap-2">
            <input value={nueva} onChange={e => { setNueva(e.target.value); setError("") }}
              placeholder="Ropa, Equipo, Suplementos…"
              aria-label="Nombre de la categoria"
              className="flex-1 px-3 py-2.5 rounded-lg text-sm text-white"
              style={{ background:"#0a0a0a", border:"1px solid #2a2a2a" }}
            />
            <button type="submit" disabled={!nueva.trim()}
              className="px-4 rounded-lg text-sm font-bold text-white shrink-0"
              style={{ background: nueva.trim() ? "#c0392b" : "#2a2a2a", cursor: nueva.trim() ? "pointer" : "not-allowed" }}
              aria-label="Crear categoria"
            ><Plus size={15}/></button>
          </form>

          {error && <p role="alert" className="text-xs" style={{ color:"#f87171" }}>{error}</p>}

          {categorias.length === 0 && (
            <p className="text-xs py-3 text-center" style={{ color:"#64748b" }}>
              Todavia no hay categorias. Crea la primera arriba.
            </p>
          )}

          <div className="space-y-2">
            {categorias.map(c => {
              const usos = cuantosUsan(c.id)
              return (
                <div key={c.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                  style={{ background:"#0a0a0a", border:"1px solid #2a2a2a" }}
                >
                  <Tag size={13} style={{ color:"#c0392b" }} className="shrink-0"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{c.nombre}</p>
                    <p className="text-[10px]" style={{ color:"#64748b" }}>
                      {usos === 0 ? "sin productos" : usos + (usos !== 1 ? " productos" : " producto")}
                    </p>
                  </div>
                  <button onClick={() => setPorBorrar(c)}
                    className="w-7 h-7 rounded flex items-center justify-center shrink-0"
                    style={{ background:"#1a1a1a", color:"#f87171" }}
                    aria-label={"Eliminar categoria " + c.nombre}
                  ><Trash2 size={12}/></button>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {porBorrar && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ background:"rgba(10,10,10,0.9)" }}
            onClick={e => { e.stopPropagation(); setPorBorrar(null) }}
            role="dialog" aria-modal="true" aria-label="Confirmar eliminacion de categoria"
          >
            <motion.div initial={{ scale:0.96 }} animate={{ scale:1 }}
              className="admin-card p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}
            >
              <h3 className="font-display text-lg text-white mb-2" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>
                Eliminar categoria
              </h3>
              <p className="text-sm mb-1" style={{ color:"#94a3b8" }}>
                Se va a eliminar <strong className="text-white">{porBorrar.nombre}</strong>.
              </p>
              <p className="text-xs mb-5" style={{ color:"#64748b" }}>
                {cuantosUsan(porBorrar.id) > 0
                  ? "Sus productos NO se borran: quedan sin categoria y podras reasignarlos."
                  : "No tiene productos asignados."}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setPorBorrar(null)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                  style={{ background:"#1a1a1a", color:"#94a3b8", border:"1px solid #2a2a2a" }}
                >Cancelar</button>
                <button onClick={() => eliminar(porBorrar)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white"
                  style={{ background:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"15px" }}
                >Eliminar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Vista principal ─────────────────────────────────────────────────────────
const AdminInventario = () => {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando]   = useState(true)
  const [error, setError]         = useState("")
  const [editando, setEditando]   = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [porBorrar, setPorBorrar] = useState(null)
  const [filtro, setFiltro]       = useState(null)   // null = todas
  const [categorias, setCategorias] = useState([])
  const [verCategorias, setVerCategorias] = useState(false)

  const recargar = async () => {
    setCargando(true)
    const [p, c] = await Promise.all([productosTodos(), categoriasTodas()])
    if (p.error) setError(p.error.message)
    else { setProductos(p.datos); setError("") }
    if (!c.error) setCategorias(c.datos)
    setCargando(false)
  }

  useEffect(() => { recargar() }, [])

  const alGuardar = async producto => {
    setGuardando(true)
    const { error } = await guardarProducto(producto)
    setGuardando(false)
    if (error) { setError(error.message); return }
    setEditando(null)
    recargar()
  }

  const alBorrar = async id => {
    const { error } = await borrarProducto(id)
    setPorBorrar(null)
    if (error) { setError(error.message); return }
    recargar()
  }

  // Sumar o restar una unidad sin abrir el formulario: es lo que se hace
  // despues de vender algo
  const mover = async (p, delta) => {
    if (p.existencias == null) return
    const nuevo = Math.max(0, p.existencias + delta)
    const { error } = await ajustarExistencias(p.id, nuevo)
    if (error) { setError(error.message); return }
    setProductos(ps => ps.map(x => x.id === p.id ? { ...x, existencias: nuevo } : x))
  }

  const visibles = filtro == null ? productos : productos.filter(p => p.categoria_id === filtro)
  const agotados = productos.filter(p => p.existencias === 0)
  const bajos    = productos.filter(p => p.existencias != null && p.existencias > 0 && p.existencias <= (p.alerta_minima ?? 3))

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-white mb-1" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>Inventario</h1>
          <p className="text-sm" style={{ color:"#64748b" }}>
            {cargando ? "Cargando…" : `${productos.length} producto${productos.length !== 1 ? "s" : ""} en catalogo`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setVerCategorias(true)}
            className="inline-flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold"
            style={{ background:"#1a1a1a", color:"#94a3b8", border:"1px solid #2a2a2a" }}
          ><Tag size={13}/> Categorias</button>
          <button onClick={() => setEditando(productoVacio())}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white"
            style={{ background:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"14px" }}
          ><Plus size={15}/> NUEVO PRODUCTO</button>
        </div>
      </div>

      {error && (
        <div role="alert" className="p-3 rounded-lg text-sm" style={{ background:"rgba(248,113,113,0.1)", color:"#f87171" }}>
          {error}
        </div>
      )}

      {/* Avisos de inventario */}
      {(agotados.length > 0 || bajos.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {agotados.length > 0 && (
            <div className="p-3 rounded-lg flex items-start gap-3" style={{ background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.2)" }}>
              <AlertTriangle size={15} style={{ color:"#f87171" }} className="mt-0.5 shrink-0"/>
              <div>
                <p className="text-xs font-semibold" style={{ color:"#f87171" }}>
                  {agotados.length} agotado{agotados.length !== 1 ? "s" : ""}
                </p>
                <p className="text-[11px]" style={{ color:"#94a3b8" }}>
                  {agotados.map(p => p.nombre).join(", ")} — ya no aparecen en el sitio
                </p>
              </div>
            </div>
          )}
          {bajos.length > 0 && (
            <div className="p-3 rounded-lg flex items-start gap-3" style={{ background:"rgba(245,197,24,0.08)", border:"1px solid rgba(245,197,24,0.2)" }}>
              <AlertTriangle size={15} style={{ color:"#f5c518" }} className="mt-0.5 shrink-0"/>
              <div>
                <p className="text-xs font-semibold" style={{ color:"#f5c518" }}>
                  {bajos.length} con pocas existencias
                </p>
                <p className="text-[11px]" style={{ color:"#94a3b8" }}>
                  {bajos.map(p => `${p.nombre} (${p.existencias})`).join(", ")}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFiltro(null)}
          className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
          style={{
            background: filtro == null ? "#c0392b" : "#1a1a1a",
            color:      filtro == null ? "#ffffff" : "#64748b",
            border:     `1px solid ${filtro == null ? "#c0392b" : "#2a2a2a"}`,
          }}
        >Todos</button>
        {categorias.map(c => (
          <button key={c.id} onClick={() => setFiltro(c.id)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
            style={{
              background: filtro === c.id ? "#c0392b" : "#1a1a1a",
              color:      filtro === c.id ? "#ffffff" : "#64748b",
              border:     `1px solid ${filtro === c.id ? "#c0392b" : "#2a2a2a"}`,
            }}
          >{c.nombre}</button>
        ))}
      </div>

      {!cargando && productos.length === 0 && (
        <div className="admin-card p-10 text-center">
          <Package size={30} style={{ color:"#2a2a2a" }} className="mx-auto mb-3"/>
          <p className="text-sm mb-1" style={{ color:"#94a3b8" }}>El catalogo esta vacio.</p>
          <p className="text-xs" style={{ color:"#64748b" }}>
            Mientras tanto, el sitio muestra los productos de ejemplo.
          </p>
        </div>
      )}

      {visibles.length > 0 && (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ minWidth:"680px" }}>
              <thead>
                <tr style={{ borderBottom:"1px solid #2a2a2a" }}>
                  {["Producto","Categoria","Precio","Existencias","Estado",""].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color:"#64748b" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibles.map((p, i) => {
                  const agotado = p.existencias === 0
                  const bajo    = p.existencias != null && p.existencias > 0 && p.existencias <= (p.alerta_minima ?? 3)
                  return (
                    <tr key={p.id} style={{ borderBottom:"1px solid #111111", background: i % 2 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-white text-xs">{p.nombre}</p>
                        {p.etiqueta && <p className="text-[10px]" style={{ color:"#c0392b" }}>{p.etiqueta}</p>}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: p.categorias ? "#94a3b8" : "#475569" }}>
                        {p.categorias?.nombre ?? "sin categoria"}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: p.precio != null ? "#e2e8f0" : "#64748b" }}>
                        {p.precio != null ? `$${Number(p.precio).toLocaleString("es-MX")}` : "Consultar"}
                      </td>
                      <td className="px-4 py-3">
                        {p.existencias == null ? (
                          <span className="text-xs" style={{ color:"#64748b" }}>sin control</span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => mover(p, -1)} disabled={p.existencias === 0}
                              className="w-6 h-6 rounded flex items-center justify-center"
                              style={{ background:"#0a0a0a", border:"1px solid #2a2a2a", color: p.existencias === 0 ? "#2a2a2a" : "#94a3b8" }}
                              aria-label={`Restar una unidad de ${p.nombre}`}
                            ><Minus size={11}/></button>
                            <span className="text-xs font-bold w-7 text-center"
                              style={{ color: agotado ? "#f87171" : bajo ? "#f5c518" : "#e2e8f0" }}
                            >{p.existencias}</span>
                            <button onClick={() => mover(p, 1)}
                              className="w-6 h-6 rounded flex items-center justify-center"
                              style={{ background:"#0a0a0a", border:"1px solid #2a2a2a", color:"#94a3b8" }}
                              aria-label={`Sumar una unidad de ${p.nombre}`}
                            ><Plus size={11}/></button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full"
                          style={
                            agotado ? { background:"rgba(248,113,113,0.12)", color:"#f87171" }
                            : !p.disponible ? { background:"#2a2a2a", color:"#64748b" }
                            : { background:"rgba(74,222,128,0.12)", color:"#4ade80" }
                          }
                        >{agotado ? "agotado" : !p.disponible ? "oculto" : "en linea"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button onClick={() => setEditando(p)}
                            className="w-7 h-7 rounded flex items-center justify-center"
                            style={{ background:"#0a0a0a", color:"#94a3b8" }}
                            aria-label={`Editar ${p.nombre}`}
                          ><Pencil size={12}/></button>
                          <button onClick={() => setPorBorrar(p)}
                            className="w-7 h-7 rounded flex items-center justify-center"
                            style={{ background:"#0a0a0a", color:"#f87171" }}
                            aria-label={`Eliminar ${p.nombre}`}
                          ><Trash2 size={12}/></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {verCategorias && (
          <PanelCategorias categorias={categorias} productos={productos}
            onCerrar={() => setVerCategorias(false)} onCambio={recargar}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editando && (
          <Formulario producto={editando} categorias={categorias} guardando={guardando}
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
                Eliminar producto
              </h2>
              <p className="text-sm mb-1" style={{ color:"#94a3b8" }}>
                Se va a eliminar <strong className="text-white">{porBorrar.nombre}</strong>.
              </p>
              <p className="text-xs mb-5" style={{ color:"#64748b" }}>
                Esto no se puede deshacer. Si solo quieres dejar de venderlo, desmarca "Mostrar en el sitio".
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

export default AdminInventario
