// Panel de administracion — BFS Martial Arts
//
// Vive separado del sitio publico y se carga bajo demanda (React.lazy en
// Pages.jsx). Eso mantiene recharts —la libreria mas pesada del proyecto—
// fuera del paquete que descargan los visitantes normales.
import { useState, useEffect } from "react"
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, Users, UserCheck, Award, LogOut, Eye, Search, Menu, X,
  Calendar, Clock, Package, Dumbbell,
} from "lucide-react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { adminData } from "../data/adminData"
import { BFSLogo } from "../components/layout/Layout"
import { fadeInUp, stagger } from "../styles/animations"
import { iniciarSesion, cerrarSesion, sesionActual, alCambiarSesion, hayConexion, eventosTodos, alumnosTodos } from "../data/supabase"
import AdminEventos from "./AdminEventos"
import AdminHorarios from "./AdminHorarios"
import AdminInventario from "./AdminInventario"
import AdminProgramas from "./AdminProgramas"
import AdminAlumnos from "./AdminAlumnos"

const CHART_COLORS = ["#c0392b","#f5c518","#1a5276","#6b4c36","#2d6a4f","#888888","#f5f5f5"]
const beltColors   = { "Blanco":"#f5f5f5", "Blanco raya Morada":"#f5f5f5", "Morada":"#8b3fa8", "Morada raya Amarilla":"#8b3fa8", "Amarilla":"#f5c518", "Naranja":"#e07b39", "Azul":"#2e75b6", "Azul raya Marron":"#2e75b6", "Marron":"#6b4c36", "Negro":"#1a1a1a" }


// Acceso con las cuentas creadas en Supabase. Ya no hay contrasena escrita
// en el codigo: las credenciales se validan contra el servidor.
const AdminLogin = () => {
  const [email, setEmail] = useState("")
  const [pw, setPw]       = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true); setError("")
    const { error } = await iniciarSesion(email.trim(), pw)
    if (error) {
      // No se distingue "correo inexistente" de "contrasena incorrecta":
      // decirlo permitiria averiguar que cuentas existen
      setError(
        error.message?.includes("Invalid login")
          ? "Correo o contrasena incorrectos."
          : error.message || "No se pudo iniciar sesion. Intenta de nuevo."
      )
      setPw("")
    }
    setLoading(false)
  }

  const listo = email.trim() && pw

  return (
    <div className="admin-body min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ opacity:0,y:24 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.5 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4" style={{ background:"#c0392b" }}>
            <span className="font-display text-3xl text-white" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>BFS</span>
          </div>
          <h1 className="font-display text-2xl text-white mb-1" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>Panel Administrativo</h1>
          <p className="text-sm" style={{ color:"#64748b" }}>BFS Martial Arts & High Performance</p>
        </div>
        <div className="admin-card p-7">
          {!hayConexion && (
            <p role="alert" className="text-xs mb-4 p-3 rounded-lg" style={{ background:"rgba(248,113,113,0.1)", color:"#f87171" }}>
              Falta configurar la conexion a la base de datos.
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color:"#94a3b8" }}>Correo</label>
              <input id="admin-email" name="email" type="email" autoComplete="username"
                value={email} onChange={e=>{ setEmail(e.target.value); setError("") }}
                placeholder="sensei@bfsmartialart.com" autoFocus spellCheck={false}
                aria-invalid={!!error}
                className="w-full px-4 py-3 rounded-lg text-sm text-white"
                style={{ background:"#0a0a0a", border:error?"1px solid #f87171":"1px solid #2a2a2a" }}
              />
            </div>
            <div>
              <label htmlFor="admin-pw" className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color:"#94a3b8" }}>Contrasena</label>
              <input id="admin-pw" name="password" type="password" autoComplete="current-password"
                value={pw} onChange={e=>{ setPw(e.target.value); setError("") }}
                placeholder="••••••••"
                aria-invalid={!!error} aria-describedby={error ? "admin-error" : undefined}
                className="w-full px-4 py-3 rounded-lg text-sm text-white"
                style={{ background:"#0a0a0a", border:error?"1px solid #f87171":"1px solid #2a2a2a" }}
              />
            </div>
            {error && <p id="admin-error" role="alert" className="text-xs" style={{ color:"#f87171" }}>{error}</p>}
            <motion.button type="submit" disabled={loading||!listo}
              className="w-full py-3 rounded-lg text-sm font-bold text-white"
              style={{ background:listo?"#c0392b":"#2a2a2a", cursor:listo?"pointer":"not-allowed", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"16px" }}
              whileHover={listo?{ scale:1.02 }:{}} whileTap={listo?{ scale:0.98 }:{}}
            >{loading?"Verificando…":"INGRESAR"}</motion.button>
          </form>
        </div>
        <div className="text-center mt-6">
          <Link to="/" className="text-xs transition-colors" style={{ color:"#334155" }}
            onMouseEnter={e=>e.target.style.color="#c0392b"} onMouseLeave={e=>e.target.style.color="#334155"}
          >Volver al sitio</Link>
        </div>
      </motion.div>
    </div>
  )
}

const AdminSidebar = ({ onLogout, onClose }) => {
  const location = useLocation()
  const items = [
    { href:"/admin/dashboard",  Icon:LayoutDashboard, label:"Dashboard"  },
    { href:"/admin/programas",  Icon:Dumbbell,        label:"Programas"  },
    { href:"/admin/eventos",    Icon:Calendar,        label:"Eventos"    },
    { href:"/admin/horarios",   Icon:Clock,           label:"Horarios"   },
    { href:"/admin/inventario", Icon:Package,         label:"Inventario" },
    { href:"/admin/alumnos",    Icon:Users,           label:"Alumnos"    },
  ]
  return (
    <div className="admin-sidebar flex flex-col" style={{ width:"210px", minWidth:"210px", height:"100vh" }}>
      <div className="p-5 border-b" style={{ borderColor:"#2a2a2a" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center" style={{ background:"#c0392b" }}>
            <span className="font-display text-sm text-white" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>BFS</span>
          </div>
          <div>
            <div className="text-xs font-bold text-white" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>BFS Admin</div>
            <div className="text-[10px]" style={{ color:"#334155" }}>Panel de control</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map(({ href, Icon, label })=>{
          const active = location.pathname === href
          return (
            <Link key={href} to={href} onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
              style={{ background:active?"rgba(192,57,43,0.15)":"transparent", color:active?"#c0392b":"#64748b",
                border:active?"1px solid rgba(192,57,43,0.3)":"1px solid transparent" }}
              onMouseEnter={e=>!active&&(e.currentTarget.style.color="#94a3b8")}
              onMouseLeave={e=>!active&&(e.currentTarget.style.color="#64748b")}
            ><Icon size={16}/>{label}</Link>
          )
        })}
      </nav>
      <div className="p-3 border-t" style={{ borderColor:"#2a2a2a" }}>
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs mb-1 transition-colors"
          style={{ color:"#64748b" }} onMouseEnter={e=>e.currentTarget.style.color="#94a3b8"} onMouseLeave={e=>e.currentTarget.style.color="#64748b"}
        ><Eye size={14}/>Ver sitio</Link>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-colors"
          style={{ color:"#64748b" }} onMouseEnter={e=>e.currentTarget.style.color="#f87171"} onMouseLeave={e=>e.currentTarget.style.color="#64748b"}
        ><LogOut size={14}/>Cerrar sesion</button>
      </div>
    </div>
  )
}

const AdminLayout = ({ children, onLogout }) => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pageTitles = {
    "/admin/dashboard":"Dashboard", "/admin/programas":"Programas", "/admin/eventos":"Eventos",
    "/admin/horarios":"Horarios", "/admin/inventario":"Inventario",
    "/admin/alumnos":"Alumnos",
  }

  return (
    <div className="admin-body flex">
      <div className="hidden md:flex sticky top-0 h-screen">
        <AdminSidebar onLogout={onLogout}/>
      </div>
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 z-40 md:hidden" style={{ background:"rgba(0,0,0,0.7)" }}
              onClick={()=>setSidebarOpen(false)}
            />
            <motion.div initial={{ x:-210 }} animate={{ x:0 }} exit={{ x:-210 }} transition={{ type:"tween",duration:0.25 }}
              className="fixed left-0 top-0 bottom-0 z-50 md:hidden flex"
            >
              <AdminSidebar onLogout={onLogout} onClose={()=>setSidebarOpen(false)}/>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-hidden">
        <div className="sticky top-0 z-30 flex items-center justify-between px-5 py-3.5 border-b"
          style={{ background:"rgba(10,10,10,0.97)", borderColor:"#2a2a2a", backdropFilter:"blur(10px)" }}
        >
          <div className="flex items-center gap-3">
            <button className="md:hidden text-gray-400" onClick={()=>setSidebarOpen(true)} aria-label="Abrir menu lateral"><Menu size={20} aria-hidden="true"/></button>
            <h2 className="font-display text-base text-white" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif", letterSpacing:"0.08em" }}>
              {pageTitles[location.pathname]||"Panel"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search size={14} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
              <input type="search" name="buscar-alumno" aria-label="Buscar alumno"
                spellCheck={false} autoComplete="off"
                placeholder="Buscar alumno…" className="pl-8 pr-4 py-2 rounded-lg text-xs"
                style={{ background:"#1a1a1a", border:"1px solid #2a2a2a", color:"#e2e8f0", width:"180px" }}
              />
            </div>
          </div>
        </div>
        <div className="p-5 md:p-7 overflow-y-auto" style={{ maxHeight:"calc(100vh - 57px)" }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { charts } = adminData
  const [eventos, setEventos] = useState([])
  const [alumnos, setAlumnos] = useState([])

  // El proximo evento se lee de la base, para que el tablero avise de lo que
  // viene sin tener que entrar a la seccion de eventos.
  useEffect(() => {
    let vigente = true
    Promise.all([eventosTodos(), alumnosTodos()]).then(([e, a]) => {
      if (!vigente) return
      setEventos(e.datos)
      setAlumnos(a.datos)
    })
    return () => { vigente = false }
  }, [])

  // Las cifras salen del propio padron, no de una lista aparte que se
  // desactualiza. Al conectar Supabase seguiran funcionando igual.
  const hoy      = new Date()
  const mesActual= `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}`

  const activos    = alumnos.filter(a => a.estado === "activo").length
  const nuevosMes  = alumnos.filter(a => a.fecha_inscripcion?.startsWith(mesActual)).length
  const cintasNegras = alumnos.filter(a => a.belt === "Negro").length

  const proximo = eventos
    .filter(e => e.publicado && new Date(e.fecha + "T12:00:00") >= hoy)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))[0]

  const diasAlProximo = proximo
    ? Math.ceil((new Date(proximo.fecha + "T12:00:00") - hoy) / 86400000)
    : null

  const kpiList = [
    { value:activos,        label:"Alumnos activos",     color:"#60a5fa", Icon:Users     },
    { value:nuevosMes,      label:"Nuevos este mes",     color:"#4ade80", Icon:UserCheck,
      nota: nuevosMes === 0 ? "ninguna alta todavia" : null },
    { value:cintasNegras,   label:"Cintas negras",       color:"#e2e8f0", Icon:Award     },
    { value:diasAlProximo != null ? (diasAlProximo === 0 ? "Hoy" : diasAlProximo) : "—",
      label: proximo ? "Dias al proximo evento" : "Sin eventos programados",
      color:"#c0392b", Icon:Calendar,
      nota: proximo?.titulo },
  ]
  const Tip = ({ active, payload, label }) => {
    if (!active||!payload?.length) return null
    return <div className="px-3 py-2 rounded-lg text-xs" style={{ background:"#1a1a1a", border:"1px solid #2a2a2a", color:"#e2e8f0" }}>
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p,i)=><p key={i} style={{ color:p.color }}>{p.name}: {p.value}</p>)}
    </div>
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-white mb-1" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>Dashboard</h1>
        <p className="text-sm" style={{ color:"#64748b" }}>{new Date().toLocaleDateString("es-MX",{ weekday:"long",year:"numeric",month:"long",day:"numeric" })}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiList.map((k,i)=>(
          <motion.div key={i} className="kpi-card p-5"
            initial={{ opacity:0,y:14 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background:`${k.color}18` }}>
                <k.Icon size={18} style={{ color:k.color }}/>
              </div>
            </div>
            <div className="font-display text-2xl text-white mb-1" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{k.value}</div>
            <div className="text-xs" style={{ color:"#64748b" }}>{k.label}</div>
            {k.nota && <div className="text-[10px] mt-1 truncate" style={{ color:"#475569" }}>{k.nota}</div>}
          </motion.div>
        ))}
      </div>

      {/* Reparto por programa */}
      <div className="admin-card p-5">
        <h3 className="font-display text-base text-white mb-4" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>Alumnos por Programa</h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={charts.alumnosPorPrograma} cx="50%" cy="50%" innerRadius={58} outerRadius={90} paddingAngle={3} dataKey="valor">
              {charts.alumnosPorPrograma.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]}/>)}
            </Pie>
            <Tooltip content={<Tip/>}/>
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:"11px",color:"#64748b" }}/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Distribucion de cinturones */}
      <div className="admin-card p-5">
        <h3 className="font-display text-base text-white mb-5" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>Distribucion de Cinturones</h3>
        <div className="flex flex-wrap gap-4">
          {charts.cinturones.map(c=>(
            <div key={c.nombre} className="flex flex-col items-center gap-1.5">
              <div className="font-display text-xl text-white" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{c.valor}</div>
              <div className="w-12 h-2 rounded-sm" style={{ background:beltColors[c.nombre]||"#888888", boxShadow:`0 0 6px ${beltColors[c.nombre]||"#888888"}60` }}/>
              <div className="text-[9px] tracking-wider uppercase" style={{ color:"rgba(245,245,245,0.35)" }}>{c.nombre}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Punto de entrada del panel: autenticacion + rutas internas
// ─────────────────────────────────────────────────────────────────────────────
const AdminPanel = () => {
  const [sesion, setSesion]     = useState(null)
  const [cargando, setCargando] = useState(true)

  // Al abrir, se pregunta a Supabase si hay sesion valida. Y se queda
  // escuchando: si expira o se cierra en otra pestana, el panel reacciona.
  useEffect(() => {
    let vigente = true
    sesionActual().then(s => {
      if (vigente) { setSesion(s); setCargando(false) }
    })
    return alCambiarSesion(s => { if (vigente) setSesion(s) }) || (() => { vigente = false })
  }, [])

  if (cargando) {
    return (
      <div className="admin-body min-h-screen flex items-center justify-center">
        <div className="w-9 h-9 rounded-full animate-spin"
          style={{ border:"3px solid rgba(192,57,43,0.2)", borderTopColor:"#c0392b" }}
          role="status" aria-label="Verificando sesion"
        />
      </div>
    )
  }

  if (!sesion) return <AdminLogin/>

  return (
    <AdminLayout onLogout={cerrarSesion}>
      <Routes>
        <Route path="/admin"           element={<Navigate to="/admin/dashboard" replace/>}/>
        <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
        <Route path="/admin/programas"  element={<AdminProgramas/>}/>
        <Route path="/admin/eventos"    element={<AdminEventos/>}/>
        <Route path="/admin/horarios"   element={<AdminHorarios/>}/>
        <Route path="/admin/inventario" element={<AdminInventario/>}/>
        <Route path="/admin/alumnos"    element={<AdminAlumnos/>}/>
        {/* Cualquier ruta vieja (clases, pagos) regresa al dashboard */}
        <Route path="*"                element={<Navigate to="/admin/dashboard" replace/>}/>
      </Routes>
    </AdminLayout>
  )
}

export default AdminPanel
