// Patrocinadores — BFS Martial Arts
//
// El sitio publico solo muestra los niveles y sus beneficios; el precio, el
// contrato y las condiciones los trata el Sensei por WhatsApp. Aqui vive el
// seguimiento: quien es cada uno, desde cuando, cuanto paga y si va al dia.
//
// SOBRE LA FECHA DEL PAGO
// Es editable y no se fija sola al momento de guardar. Los pagos se registran
// cuando el Sensei se entera —un deposito del martes capturado el viernes— y
// forzar la fecha de captura falsearia el historial.

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, Pencil, Trash2, X, Handshake, Search, Check, CircleDollarSign,
  AlertTriangle, Phone, ExternalLink,
} from "lucide-react"
import {
  sponsorsTodos, guardarSponsor, borrarSponsor,
  registrarPagoSponsor, borrarPagoSponsor,
} from "../data/supabase"

const TIERS = {
  oro:    { nombre:"Oro",    color:"#f5c518" },
  plata:  { nombre:"Plata",  color:"#c0c0c0" },
  bronce: { nombre:"Bronce", color:"#6b4c36" },
}

const hoy = () => new Date().toISOString().slice(0, 10)

const sponsorVacio = () => ({
  marca:"", tier:"bronce", contacto:"", telefono:"", email:"",
  logo:"", url:"", monto_mensual:"", dia_de_pago:"",
  inicio: hoy(), fin:"", estado:"activo", notas:"",
})

const dinero = n =>
  n == null || n === "" ? "—" : `$${Number(n).toLocaleString("es-MX", { minimumFractionDigits:0 })}`

const enFecha = f =>
  f ? new Date(f + "T12:00:00").toLocaleDateString("es-MX", { day:"numeric", month:"short", year:"numeric" }) : "—"

// Ultimo pago de la lista, sin suponer que vienen ordenados
const ultimoPago = s =>
  (s.sponsor_pagos ?? []).slice().sort((a, b) => b.fecha.localeCompare(a.fecha))[0] ?? null

/**
 * Un patrocinador va tarde si su dia de pago del mes en curso ya paso y no
 * hay ningun pago registrado desde entonces. Sin dia de pago acordado no se
 * puede afirmar nada, asi que no se marca.
 */
const vaTarde = s => {
  if (s.estado !== "activo" || !s.dia_de_pago) return false
  const ahora = new Date()
  const vence = new Date(ahora.getFullYear(), ahora.getMonth(), s.dia_de_pago, 12)
  if (ahora < vence) return false
  const ultimo = ultimoPago(s)
  return !ultimo || new Date(ultimo.fecha + "T12:00:00") < vence
}

// ── Formulario de patrocinador ──────────────────────────────────────────────
const Formulario = ({ sponsor, onGuardar, onCancelar, guardando }) => {
  const [campos, setCampos] = useState(sponsor)
  const cambiar = (llave, valor) => setCampos(c => ({ ...c, [llave]: valor }))

  const enviar = e => {
    e.preventDefault()
    onGuardar({
      ...campos,
      // Vacio significa "sin acordar", no cero
      monto_mensual: campos.monto_mensual === "" ? null : Number(campos.monto_mensual),
      dia_de_pago:   campos.dia_de_pago   === "" ? null : Number(campos.dia_de_pago),
      fin:           campos.fin || null,
    })
  }

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
      role="dialog" aria-modal="true" aria-label={sponsor.id ? "Editar patrocinador" : "Nuevo patrocinador"}
    >
      <motion.div
        initial={{ scale:0.96, y:12 }} animate={{ scale:1, y:0 }} exit={{ scale:0.96, y:12 }}
        className="admin-card w-full max-w-xl max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
          style={{ borderBottom:"1px solid #2a2a2a", background:"#1a1a1a" }}
        >
          <h2 className="font-display text-lg text-white" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>
            {sponsor.id ? "Editar patrocinador" : "Nuevo patrocinador"}
          </h2>
          <button onClick={onCancelar} aria-label="Cerrar" style={{ color:"#64748b" }}><X size={18}/></button>
        </div>

        <form onSubmit={enviar} className="p-6 space-y-5">
          <p className={seccion} style={{ color:"#c0392b" }}>Marca</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="sp-marca" className={etiq} style={{ color:"#94a3b8" }}>Nombre de la marca</label>
              <input id="sp-marca" className={input} style={estilo} autoFocus
                value={campos.marca} onChange={e => cambiar("marca", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="sp-tier" className={etiq} style={{ color:"#94a3b8" }}>Nivel</label>
              <select id="sp-tier" className={input} style={estilo}
                value={campos.tier} onChange={e => cambiar("tier", e.target.value)}
              >
                {Object.entries(TIERS).map(([id, t]) => (
                  <option key={id} value={id} style={{ background:"#1a1a1a" }}>{t.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="sp-logo" className={etiq} style={{ color:"#94a3b8" }}>Logo (enlace)</label>
              <input id="sp-logo" className={input} style={estilo}
                value={campos.logo || ""} onChange={e => cambiar("logo", e.target.value)}
                placeholder="https://…"
              />
            </div>
            <div>
              <label htmlFor="sp-url" className={etiq} style={{ color:"#94a3b8" }}>Sitio de la marca</label>
              <input id="sp-url" className={input} style={estilo}
                value={campos.url || ""} onChange={e => cambiar("url", e.target.value)}
                placeholder="https://…"
              />
            </div>
          </div>

          <p className={seccion} style={{ color:"#c0392b" }}>Contacto</p>
          <p className="text-[11px] -mt-3" style={{ color:"#64748b" }}>
            Nunca se muestra en el sitio. Solo se ve aqui.
          </p>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="sp-contacto" className={etiq} style={{ color:"#94a3b8" }}>Persona</label>
              <input id="sp-contacto" className={input} style={estilo}
                value={campos.contacto || ""} onChange={e => cambiar("contacto", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="sp-tel" className={etiq} style={{ color:"#94a3b8" }}>Telefono</label>
              <input id="sp-tel" type="tel" inputMode="tel" className={input} style={estilo}
                value={campos.telefono || ""} onChange={e => cambiar("telefono", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="sp-mail" className={etiq} style={{ color:"#94a3b8" }}>Correo</label>
              <input id="sp-mail" type="email" className={input} style={estilo}
                value={campos.email || ""} onChange={e => cambiar("email", e.target.value)}
              />
            </div>
          </div>

          <p className={seccion} style={{ color:"#c0392b" }}>Acuerdo</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="sp-monto" className={etiq} style={{ color:"#94a3b8" }}>Monto mensual</label>
              <input id="sp-monto" type="number" min="0" step="50" className={input} style={estilo}
                value={campos.monto_mensual ?? ""} onChange={e => cambiar("monto_mensual", e.target.value)}
                placeholder="Vacio = sin acordar"
              />
            </div>
            <div>
              <label htmlFor="sp-dia" className={etiq} style={{ color:"#94a3b8" }}>Dia de pago</label>
              <input id="sp-dia" type="number" min="1" max="31" className={input} style={estilo}
                value={campos.dia_de_pago ?? ""} onChange={e => cambiar("dia_de_pago", e.target.value)}
                placeholder="1 a 31"
              />
              <p className="text-[11px] mt-1" style={{ color:"#64748b" }}>
                Sin este dato no se puede avisar quien va tarde.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="sp-inicio" className={etiq} style={{ color:"#94a3b8" }}>Desde</label>
              <input id="sp-inicio" type="date" className={input} style={estilo}
                value={campos.inicio || ""} onChange={e => cambiar("inicio", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="sp-fin" className={etiq} style={{ color:"#94a3b8" }}>Hasta</label>
              <input id="sp-fin" type="date" className={input} style={estilo}
                value={campos.fin || ""} onChange={e => cambiar("fin", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="sp-estado" className={etiq} style={{ color:"#94a3b8" }}>Estado</label>
              <select id="sp-estado" className={input} style={estilo}
                value={campos.estado} onChange={e => cambiar("estado", e.target.value)}
              >
                <option value="activo"  style={{ background:"#1a1a1a" }}>Activo</option>
                <option value="pausado" style={{ background:"#1a1a1a" }}>Pausado</option>
                <option value="baja"    style={{ background:"#1a1a1a" }}>Baja</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="sp-notas" className={etiq} style={{ color:"#94a3b8" }}>Notas</label>
            <textarea id="sp-notas" rows={2} className={input} style={{ ...estilo, resize:"vertical" }}
              value={campos.notas || ""} onChange={e => cambiar("notas", e.target.value)}
              placeholder="Lo acordado por WhatsApp, condiciones, contacto alterno…"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancelar}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
              style={{ background:"#1a1a1a", color:"#94a3b8", border:"1px solid #2a2a2a" }}
            >Cancelar</button>
            <button type="submit" disabled={!campos.marca.trim() || guardando}
              className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white"
              style={{
                background: campos.marca.trim() ? "#c0392b" : "#2a2a2a",
                cursor: campos.marca.trim() ? "pointer" : "not-allowed",
              }}
            >{guardando ? "Guardando…" : "Guardar"}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// ── Historial y registro de pagos ───────────────────────────────────────────
const Pagos = ({ sponsor, onCerrar, onCambio }) => {
  const [fecha, setFecha]   = useState(hoy())
  const [monto, setMonto]   = useState(sponsor.monto_mensual ?? "")
  const [metodo, setMetodo] = useState("Transferencia")
  const [nota, setNota]     = useState("")
  const [guardando, setGuardando] = useState(false)
  const [error, setError]   = useState("")

  const pagos = (sponsor.sponsor_pagos ?? []).slice().sort((a, b) => b.fecha.localeCompare(a.fecha))

  const registrar = async e => {
    e.preventDefault()
    setGuardando(true); setError("")
    const { error } = await registrarPagoSponsor({
      sponsor_id: sponsor.id,
      fecha,
      monto: monto === "" ? null : Number(monto),
      metodo, nota,
    })
    setGuardando(false)
    if (error) { setError(error.message); return }
    setNota("")
    onCambio()
  }

  const quitar = async pago => {
    if (!window.confirm(`Borrar el pago del ${enFecha(pago.fecha)}?`)) return
    const { error } = await borrarPagoSponsor(pago.id)
    if (error) { setError(error.message); return }
    onCambio()
  }

  const input  = "w-full px-3 py-2.5 rounded-lg text-sm text-white"
  const estilo = { background:"#0a0a0a", border:"1px solid #2a2a2a" }
  const etiq   = "block text-xs font-semibold mb-1.5 uppercase tracking-wider"

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:"rgba(10,10,10,0.85)" }}
      onClick={onCerrar}
      role="dialog" aria-modal="true" aria-label={`Pagos de ${sponsor.marca}`}
    >
      <motion.div
        initial={{ scale:0.96, y:12 }} animate={{ scale:1, y:0 }} exit={{ scale:0.96, y:12 }}
        className="admin-card w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
          style={{ borderBottom:"1px solid #2a2a2a", background:"#1a1a1a" }}
        >
          <div>
            <h2 className="font-display text-lg text-white" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>
              Pagos de {sponsor.marca}
            </h2>
            <p className="text-[11px]" style={{ color:"#64748b" }}>
              {TIERS[sponsor.tier]?.nombre} · {dinero(sponsor.monto_mensual)} al mes
            </p>
          </div>
          <button onClick={onCerrar} aria-label="Cerrar" style={{ color:"#64748b" }}><X size={18}/></button>
        </div>

        <form onSubmit={registrar} className="p-6 space-y-4" style={{ borderBottom:"1px solid #2a2a2a" }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="pg-fecha" className={etiq} style={{ color:"#94a3b8" }}>Fecha del pago</label>
              <input id="pg-fecha" type="date" className={input} style={estilo}
                value={fecha} onChange={e => setFecha(e.target.value)}
              />
              <p className="text-[11px] mt-1" style={{ color:"#64748b" }}>
                Cambiala si el pago fue otro dia.
              </p>
            </div>
            <div>
              <label htmlFor="pg-monto" className={etiq} style={{ color:"#94a3b8" }}>Monto</label>
              <input id="pg-monto" type="number" min="0" step="50" className={input} style={estilo}
                value={monto} onChange={e => setMonto(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="pg-metodo" className={etiq} style={{ color:"#94a3b8" }}>Metodo</label>
              <select id="pg-metodo" className={input} style={estilo}
                value={metodo} onChange={e => setMetodo(e.target.value)}
              >
                {["Transferencia","Deposito","Efectivo","Otro"].map(m => (
                  <option key={m} value={m} style={{ background:"#1a1a1a" }}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pg-nota" className={etiq} style={{ color:"#94a3b8" }}>Nota</label>
              <input id="pg-nota" className={input} style={estilo}
                value={nota} onChange={e => setNota(e.target.value)}
                placeholder="Opcional"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="text-xs p-2.5 rounded-lg" style={{ background:"rgba(248,113,113,0.1)", color:"#f87171" }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={guardando}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold text-white"
            style={{ background:"#c0392b" }}
          ><Check size={14}/> {guardando ? "Guardando…" : "Registrar pago"}</button>
        </form>

        <div className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color:"#94a3b8" }}>
            Historial · {pagos.length}
          </p>
          {pagos.length === 0 ? (
            <p className="text-sm py-4 text-center" style={{ color:"#64748b" }}>
              Todavia no hay pagos registrados.
            </p>
          ) : (
            <div className="space-y-2">
              {pagos.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background:"#0a0a0a", border:"1px solid #2a2a2a" }}
                >
                  <CircleDollarSign size={15} style={{ color:"#4ade80" }} className="shrink-0"/>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white">{enFecha(p.fecha)} · {dinero(p.monto)}</p>
                    <p className="text-[11px] truncate" style={{ color:"#64748b" }}>
                      {p.metodo}{p.nota ? ` · ${p.nota}` : ""}
                    </p>
                  </div>
                  <button onClick={() => quitar(p)} aria-label="Borrar pago" style={{ color:"#64748b" }}>
                    <Trash2 size={14}/>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Vista ───────────────────────────────────────────────────────────────────
const AdminSponsors = () => {
  const [sponsors, setSponsors] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError]       = useState("")
  const [busca, setBusca]       = useState("")
  const [editando, setEditando] = useState(null)
  const [viendoPagos, setViendoPagos] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const recargar = async () => {
    setCargando(true)
    const { datos, error } = await sponsorsTodos()
    if (error) setError(error.message); else { setSponsors(datos); setError("") }
    setCargando(false)
  }

  useEffect(() => { recargar() }, [])

  // Se mantiene abierta la ventana de pagos con los datos frescos
  useEffect(() => {
    if (!viendoPagos) return
    const actualizado = sponsors.find(s => s.id === viendoPagos.id)
    if (actualizado && actualizado !== viendoPagos) setViendoPagos(actualizado)
  }, [sponsors])

  const guardar = async datos => {
    setGuardando(true)
    const { error } = await guardarSponsor(datos)
    setGuardando(false)
    if (error) { setError(error.message); return }
    setEditando(null)
    recargar()
  }

  const eliminar = async s => {
    if (!window.confirm(`Eliminar a ${s.marca}? Se borra tambien su historial de pagos.`)) return
    const { error } = await borrarSponsor(s.id)
    if (error) { setError(error.message); return }
    recargar()
  }

  const filtrados = sponsors.filter(s =>
    !busca || s.marca.toLowerCase().includes(busca.toLowerCase()) ||
    (s.contacto || "").toLowerCase().includes(busca.toLowerCase()))

  const activos   = sponsors.filter(s => s.estado === "activo")
  const atrasados = activos.filter(vaTarde)
  const mensual   = activos.reduce((t, s) => t + Number(s.monto_mensual || 0), 0)

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-white mb-1" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>
            Patrocinadores
          </h1>
          <p className="text-sm" style={{ color:"#64748b" }}>
            {cargando ? "Cargando…" : `${activos.length} activo${activos.length !== 1 ? "s" : ""} · ${dinero(mensual)} al mes`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"#475569" }}/>
            <input value={busca} onChange={e => setBusca(e.target.value)}
              type="search" aria-label="Buscar patrocinador" spellCheck={false}
              placeholder="Buscar…"
              className="pl-9 pr-3 py-2 rounded-lg text-sm text-white"
              style={{ background:"#0a0a0a", border:"1px solid #2a2a2a" }}
            />
          </div>
          <button onClick={() => setEditando(sponsorVacio())}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white shrink-0"
            style={{ background:"#c0392b" }}
          ><Plus size={13}/> Agregar</button>
        </div>
      </div>

      {error && (
        <div role="alert" className="p-3 rounded-lg text-sm" style={{ background:"rgba(248,113,113,0.1)", color:"#f87171" }}>
          {error}
        </div>
      )}

      {atrasados.length > 0 && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg"
          style={{ background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.2)" }}
        >
          <AlertTriangle size={15} style={{ color:"#fbbf24" }} className="mt-0.5 shrink-0"/>
          <p className="text-xs" style={{ color:"#fbbf24" }}>
            {atrasados.length === 1
              ? `${atrasados[0].marca} no registra pago de este mes.`
              : `${atrasados.length} patrocinadores sin pago registrado este mes: ${atrasados.map(s => s.marca).join(", ")}.`}
          </p>
        </div>
      )}

      <div className="admin-card overflow-hidden">
        {cargando ? (
          <p className="text-sm p-6" style={{ color:"#64748b" }}>Cargando…</p>
        ) : filtrados.length === 0 ? (
          <div className="p-10 text-center">
            <Handshake size={26} style={{ color:"#334155" }} className="mx-auto mb-3"/>
            <p className="text-sm" style={{ color:"#64748b" }}>
              {busca ? "Ningun patrocinador coincide." : "Todavia no hay patrocinadores registrados."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth:"820px" }}>
              <thead>
                <tr style={{ borderBottom:"1px solid #2a2a2a" }}>
                  {["Marca","Nivel","Desde","Mensual","Ultimo pago","Estado",""].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color:"#64748b" }}
                    >{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map(s => {
                  const tier = TIERS[s.tier] ?? TIERS.bronce
                  const ultimo = ultimoPago(s)
                  const tarde = vaTarde(s)
                  return (
                    <tr key={s.id} style={{ borderBottom:"1px solid #111111" }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          {s.logo
                            ? <img src={s.logo} alt="" className="w-7 h-7 rounded object-contain shrink-0" style={{ background:"#0a0a0a" }}/>
                            : <div className="w-7 h-7 rounded shrink-0" style={{ background:`${tier.color}22` }}/>}
                          <div className="min-w-0">
                            <p className="text-sm text-white truncate">{s.marca}</p>
                            {s.contacto && (
                              <p className="text-[11px] truncate" style={{ color:"#64748b" }}>{s.contacto}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
                          style={{ background:`${tier.color}1e`, color:tier.color }}
                        >{tier.nombre}</span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color:"#94a3b8" }}>{enFecha(s.inicio)}</td>
                      <td className="px-4 py-3 text-xs" style={{ color:"#e2e8f0" }}>{dinero(s.monto_mensual)}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => setViendoPagos(s)}
                          className="text-xs underline underline-offset-2"
                          style={{ color: tarde ? "#fbbf24" : ultimo ? "#4ade80" : "#64748b" }}
                        >{ultimo ? enFecha(ultimo.fecha) : "Sin pagos"}</button>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px]"
                          style={{ color: s.estado === "activo" ? "#4ade80" : s.estado === "pausado" ? "#fbbf24" : "#64748b" }}
                        >{s.estado}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {s.telefono && (
                            <a href={`https://wa.me/${s.telefono.replace(/\D/g, "")}`}
                              target="_blank" rel="noopener noreferrer"
                              aria-label={`Escribir a ${s.marca}`} style={{ color:"#4ade80" }} className="p-1.5"
                            ><Phone size={13}/></a>
                          )}
                          {s.url && (
                            <a href={s.url} target="_blank" rel="noopener noreferrer"
                              aria-label={`Sitio de ${s.marca}`} style={{ color:"#64748b" }} className="p-1.5"
                            ><ExternalLink size={13}/></a>
                          )}
                          <button onClick={() => setViendoPagos(s)} aria-label={`Pagos de ${s.marca}`}
                            style={{ color:"#64748b" }} className="p-1.5"
                          ><CircleDollarSign size={14}/></button>
                          <button onClick={() => setEditando(s)} aria-label={`Editar ${s.marca}`}
                            style={{ color:"#64748b" }} className="p-1.5"
                          ><Pencil size={13}/></button>
                          <button onClick={() => eliminar(s)} aria-label={`Eliminar ${s.marca}`}
                            style={{ color:"#64748b" }} className="p-1.5"
                          ><Trash2 size={13}/></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs" style={{ color:"#475569" }}>
        Los montos y contactos de esta seccion no se muestran en el sitio. Alla
        solo aparecen los niveles con sus beneficios y el boton de WhatsApp.
      </p>

      <AnimatePresence>
        {editando && (
          <Formulario sponsor={editando} guardando={guardando}
            onGuardar={guardar} onCancelar={() => setEditando(null)}
          />
        )}
        {viendoPagos && (
          <Pagos sponsor={viendoPagos} onCerrar={() => setViendoPagos(null)} onCambio={recargar}/>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminSponsors
