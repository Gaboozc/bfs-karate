// Panel de administracion — BFS Martial Arts
//
// Vive separado del sitio publico y se carga bajo demanda (React.lazy en
// Pages.jsx). Eso mantiene recharts —la libreria mas pesada del proyecto—
// fuera del paquete que descargan los visitantes normales.
import { useState, useEffect } from "react"
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, Users, Calendar, CreditCard, LogOut, Eye,
  TrendingUp, TrendingDown, Search, Bell, Menu, X, AlertTriangle,
  Clock, CheckCircle,
} from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import { adminData } from "../data/adminData"
import { BFSLogo } from "../components/layout/Layout"
import { fadeInUp, stagger } from "../styles/animations"

const ADMIN_PW     = "admin123"
const CHART_COLORS = ["#c0392b","#f5c518","#1a5276","#6b4c36","#2d6a4f","#888888","#f5f5f5"]
const beltColors   = { "Blanco":"#f5f5f5", "Blanco raya Morada":"#f5f5f5", "Morada":"#8b3fa8", "Morada raya Amarilla":"#8b3fa8", "Amarilla":"#f5c518", "Naranja":"#e07b39", "Azul":"#2e75b6", "Azul raya Marron":"#2e75b6", "Marron":"#6b4c36", "Negro":"#1a1a1a" }


const AdminLogin = ({ onLogin }) => {
  const [pw, setPw]   = useState("")
  const [err, setErr] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleSubmit = (e) => {
    e.preventDefault(); setLoading(true)
    setTimeout(()=>{
      if (pw===ADMIN_PW){ onLogin(); setErr(false) }
      else { setErr(true); setPw("") }
      setLoading(false)
    }, 600)
  }
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-pw" className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color:"#94a3b8" }}>Contrasena</label>
              <input id="admin-pw" name="password" type="password" autoComplete="current-password"
                value={pw} onChange={e=>{ setPw(e.target.value); setErr(false) }}
                placeholder="••••••••" autoFocus
                aria-invalid={err} aria-describedby={err ? "admin-pw-error" : undefined}
                className="w-full px-4 py-3 rounded-lg text-sm text-white"
                style={{ background:"#0a0a0a", border:err?"1px solid #f87171":"1px solid #2a2a2a" }}
              />
              {err && <p id="admin-pw-error" role="alert" className="text-xs mt-2" style={{ color:"#f87171" }}>Contrasena incorrecta. Verifica e intenta de nuevo.</p>}
            </div>
            <motion.button type="submit" disabled={loading||!pw}
              className="w-full py-3 rounded-lg text-sm font-bold text-white"
              style={{ background:pw?"#c0392b":"#2a2a2a", cursor:pw?"pointer":"not-allowed", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"16px" }}
              whileHover={pw?{ scale:1.02 }:{}} whileTap={pw?{ scale:0.98 }:{}}
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
    { href:"/admin/dashboard", Icon:LayoutDashboard, label:"Dashboard"  },
    { href:"/admin/alumnos",   Icon:Users,           label:"Alumnos"    },
    { href:"/admin/clases",    Icon:Calendar,        label:"Clases"     },
    { href:"/admin/pagos",     Icon:CreditCard,      label:"Pagos"      },
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
  const pageTitles = { "/admin/dashboard":"Dashboard", "/admin/alumnos":"Alumnos", "/admin/clases":"Clases del Dia", "/admin/pagos":"Pagos & Membresias" }
  const overdue = adminData.kpis.pagosVencidos.value

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
            <div className="relative">
              <button className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:"#1a1a1a" }}
                aria-label={overdue > 0 ? `Notificaciones: ${overdue} pagos vencidos` : "Notificaciones"}>
                <Bell size={14} className="text-gray-400" aria-hidden="true"/>
              </button>
              {overdue > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                  style={{ background:"#c0392b", color:"#ffffff" }}
                >{overdue}</span>
              )}
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
  const { kpis, charts } = adminData
  const kpiList = [
    { value:kpis.alumnosActivos.value,  label:kpis.alumnosActivos.label,  delta:kpis.alumnosActivos.delta,  up:kpis.alumnosActivos.up,  color:"#60a5fa", Icon:Users        },
    { value:kpis.ingresosHoy.value,     label:kpis.ingresosHoy.label,     delta:kpis.ingresosHoy.delta,     up:kpis.ingresosHoy.up,     color:"#4ade80", Icon:TrendingUp   },
    { value:kpis.clasesHoy.value,       label:kpis.clasesHoy.label,       delta:kpis.clasesHoy.delta,       up:kpis.clasesHoy.up,       color:"#f5c518", Icon:Calendar     },
    { value:kpis.pagosVencidos.value,   label:kpis.pagosVencidos.label,   delta:kpis.pagosVencidos.delta,   up:kpis.pagosVencidos.up,   color:"#f87171", Icon:AlertTriangle },
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
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{ background:k.up?"rgba(74,222,128,0.1)":"rgba(248,113,113,0.1)", color:k.up?"#4ade80":"#f87171" }}
              >{k.delta}</span>
            </div>
            <div className="font-display text-2xl text-white mb-1" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{k.value}</div>
            <div className="text-xs" style={{ color:"#64748b" }}>{k.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Graficas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="admin-card p-5 lg:col-span-2">
          <h3 className="font-display text-base text-white mb-4" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>Ingresos — Ultimos 7 dias</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={charts.ingresos7dias}>
              <defs><linearGradient id="bfsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#c0392b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#c0392b" stopOpacity={0}/>
              </linearGradient></defs>
              <XAxis dataKey="dia" tick={{ fill:"#64748b",fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:"#64748b",fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(1)}k`}/>
              <Tooltip content={<Tip/>}/>
              <Area type="monotone" dataKey="total" name="Ingresos" stroke="#c0392b" strokeWidth={2} fill="url(#bfsGrad)" dot={{ fill:"#c0392b",r:3 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="admin-card p-5">
          <h3 className="font-display text-base text-white mb-4" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>Alumnos por Programa</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={charts.alumnosPorPrograma} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="valor">
                {charts.alumnosPorPrograma.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]}/>)}
              </Pie>
              <Tooltip content={<Tip/>}/>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:"10px",color:"#64748b" }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Asistencia + clases de hoy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="admin-card p-5">
          <h3 className="font-display text-base text-white mb-4" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>Asistencia esta Semana</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={charts.asistenciaSemana}>
              <XAxis dataKey="dia" tick={{ fill:"#64748b",fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:"#64748b",fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<Tip/>}/>
              <Bar dataKey="total" name="Asistentes" fill="#c0392b" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="admin-card p-5">
          <h3 className="font-display text-base text-white mb-4" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>Clases de Hoy</h3>
          <div className="space-y-2.5 overflow-y-auto" style={{ maxHeight:"180px" }}>
            {adminData.clasesHoy.map(c=>(
              <div key={c.id} className="flex items-center gap-3 py-2" style={{ borderBottom:"1px solid #1a1a1a" }}>
                <span className="font-display text-xs font-bold w-10 shrink-0" style={{ color:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{c.hora}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{c.clase}</p>
                  <p className="text-[10px] truncate" style={{ color:"#64748b" }}>{c.instructor} — {c.sala}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-white">{c.inscritos}</p>
                  <p className="text-[9px]" style={{ color:"#64748b" }}>inscritos</p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${c.estado==="done"?"status-done":"status-pending"}`}>{c.estado}</span>
              </div>
            ))}
          </div>
        </div>
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

// ── Alumnos ───────────────────────────────────────────────────────────────
const AdminAlumnos = () => {
  const [search, setSearch]   = useState("")
  const [filterProg, setFilterProg] = useState("Todos")
  const programas = ["Todos", ...new Set(adminData.alumnos.map(a=>a.programa))]
  const filtered = adminData.alumnos.filter(a => {
    const matchS = a.nombre.toLowerCase().includes(search.toLowerCase())
    const matchP = filterProg==="Todos" || a.programa===filterProg
    return matchS && matchP
  })
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-white mb-1" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>Directorio de Alumnos</h1>
          <p className="text-sm" style={{ color:"#64748b" }}>{adminData.alumnos.length} alumnos registrados</p>
        </div>
        <button className="px-4 py-2.5 rounded-lg text-sm font-bold text-white" style={{ background:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"14px" }}>+ NUEVO ALUMNO</button>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={14} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
          <input type="search" name="buscar-alumno" aria-label="Buscar alumno"
            spellCheck={false} autoComplete="off"
            value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar alumno…"
            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm text-white"
            style={{ background:"#1a1a1a", border:"1px solid #2a2a2a" }}
          />
        </div>
        {programas.map(prog=>(
          <button key={prog} onClick={()=>setFilterProg(prog)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200"
            style={{ background:filterProg===prog?"#c0392b":"#1a1a1a", color:filterProg===prog?"#ffffff":"#64748b",
              border:`1px solid ${filterProg===prog?"#c0392b":"#2a2a2a"}` }}
          >{prog}</button>
        ))}
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom:"1px solid #2a2a2a" }}>
                {["Alumno","Programa","Cinta","Estado","Mensualidad","Vence","Asistencia %","Instructor"].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color:"#64748b" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a,i)=>(
                <tr key={a.id}
                  style={{ borderBottom:"1px solid #111111", background:i%2===0?"transparent":"rgba(255,255,255,0.01)" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(192,57,43,0.04)"}
                  onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"transparent":"rgba(255,255,255,0.01)"}
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-white text-xs">{a.nombre}</p>
                    <p className="text-[10px]" style={{ color:"#64748b" }}>{a.id} · {a.edad} anos</p>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color:"#94a3b8" }}>{a.programa}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-1.5 rounded-sm" style={{ background:beltColors[a.belt]||"#888888" }}/>
                      <span className="text-xs" style={{ color:"rgba(245,245,245,0.55)" }}>{a.belt}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${a.estado==="activo"?"status-active":"status-inactive"}`}>{a.estado}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${a.mensualidad==="Pagada"?"status-active":"status-overdue"}`}>{a.mensualidad}</span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color:"#64748b" }}>{a.vence}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${a.asistencia>=80?"text-green-400":a.asistencia>=60?"text-yellow-400":"text-red-400"}`}>{a.asistencia}%</span>
                      <div className="w-14 h-1.5 rounded-full" style={{ background:"#2a2a2a" }}>
                        <div className="h-full rounded-full" style={{ width:`${a.asistencia}%`, background:a.asistencia>=80?"#4ade80":a.asistencia>=60?"#f5c518":"#f87171" }}/>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color:"#64748b" }}>{a.instructor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Clases ────────────────────────────────────────────────────────────────
const AdminClases = () => {
  const total = adminData.clasesHoy.reduce((s,c)=>s+(c.inscritos||0),0)
  const done  = adminData.clasesHoy.filter(c=>c.estado==="done")
  const asistTotal = done.reduce((s,c)=>s+(c.asistentes||0),0)
  const inscDone   = done.reduce((s,c)=>s+(c.inscritos||0),0)
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl text-white mb-1" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>Clases del Dia</h1>
        <p className="text-sm" style={{ color:"#64748b" }}>{adminData.clasesHoy.length} clases programadas · {total} alumnos inscritos en total</p>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:"Clases completadas", value:`${done.length}/${adminData.clasesHoy.length}`, color:"#4ade80" },
          { label:"Asistencia promedio", value:inscDone>0?`${Math.round((asistTotal/inscDone)*100)}%`:"—", color:"#f5c518" },
          { label:"Total inscritos hoy", value:total, color:"#60a5fa" },
        ].map((s,i)=>(
          <div key={i} className="kpi-card p-4 text-center">
            <div className="font-display text-2xl mb-1" style={{ color:s.color, fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{s.value}</div>
            <div className="text-xs" style={{ color:"#64748b" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Lista de clases */}
      <div className="space-y-3">
        {adminData.clasesHoy.map(c=>{
          const progColor = { "High Performance":"#6b4c36","Karate Kids":"#f5c518","Adultos":"#1a5276","Karate Competitivo":"#c0392b","Defensa Personal":"#2d6a4f" }[c.clase]||"#888888"
          return (
            <motion.div key={c.id} className="admin-card p-5 flex flex-col md:flex-row md:items-center gap-4"
              whileHover={{ borderColor:"rgba(192,57,43,0.3)" }}
            >
              {/* Hora */}
              <div className="font-display text-3xl w-20 shrink-0" style={{ color:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{c.hora}</div>
              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display text-lg text-white" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{c.clase}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background:`${progColor}18`, color:progColor }}>{c.instructor}</span>
                </div>
                <p className="text-xs" style={{ color:"#64748b" }}>{c.sala}</p>
              </div>
              {/* Asistencia */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="font-display text-xl text-white" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{c.inscritos}</div>
                  <div className="text-[10px]" style={{ color:"#64748b" }}>inscritos</div>
                </div>
                {c.asistentes !== null ? (
                  <div className="text-center">
                    <div className="font-display text-xl" style={{ color:"#4ade80", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{c.asistentes}</div>
                    <div className="text-[10px]" style={{ color:"#64748b" }}>asistentes</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="font-display text-xl" style={{ color:"#334155", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>--</div>
                    <div className="text-[10px]" style={{ color:"#334155" }}>pendiente</div>
                  </div>
                )}
                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${c.estado==="done"?"status-done":"status-pending"}`}>{c.estado}</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ── Pagos ─────────────────────────────────────────────────────────────────
const AdminPagos = () => {
  const [filter, setFilter] = useState("todas")
  const filtered = filter==="todas" ? adminData.membresias : adminData.membresias.filter(m=>m.estado===filter)
  const counts = {
    todas:   adminData.membresias.length,
    activo:  adminData.membresias.filter(m=>m.estado==="activo").length,
    vencida: adminData.membresias.filter(m=>m.estado==="vencida").length,
  }
  const totalActivo  = adminData.membresias.filter(m=>m.estado==="activo").reduce((s,m)=>s+parseInt(m.monto.replace(/\D/g,"")),0)
  const totalVencido = adminData.membresias.filter(m=>m.estado==="vencida").reduce((s,m)=>s+parseInt(m.monto.replace(/\D/g,"")),0)

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-white mb-1" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>Pagos & Membresias</h1>
          <p className="text-sm" style={{ color:"#64748b" }}>{adminData.membresias.length} membresias registradas</p>
        </div>
        <button className="px-4 py-2.5 rounded-lg text-sm font-bold text-white" style={{ background:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"14px" }}>+ REGISTRAR PAGO</button>
      </div>

      {/* Alerta de pagos vencidos */}
      {counts.vencida > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.2)" }}>
          <AlertTriangle size={16} style={{ color:"#f87171" }}/>
          <p className="text-sm" style={{ color:"#f87171" }}>
            <strong>{counts.vencida} membresias vencidas</strong> — Total pendiente de cobro: <strong>${totalVencido.toLocaleString()}</strong>
          </p>
        </div>
      )}

      {/* Resumen de ingresos */}
      <div className="grid grid-cols-2 gap-4">
        <div className="kpi-card p-4">
          <div className="font-display text-2xl mb-1" style={{ color:"#4ade80", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>${totalActivo.toLocaleString()}</div>
          <div className="text-xs" style={{ color:"#64748b" }}>Ingresos activos este mes</div>
        </div>
        <div className="kpi-card p-4">
          <div className="font-display text-2xl mb-1" style={{ color:"#f87171", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>${totalVencido.toLocaleString()}</div>
          <div className="text-xs" style={{ color:"#64748b" }}>Pagos pendientes de cobro</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        {Object.entries(counts).map(([key,count])=>(
          <button key={key} onClick={()=>setFilter(key)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors duration-200"
            style={{ background:filter===key?"#c0392b":"#1a1a1a", color:filter===key?"#ffffff":"#64748b",
              border:`1px solid ${filter===key?"#c0392b":"#2a2a2a"}` }}
          >{key} ({count})</button>
        ))}
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom:"1px solid #2a2a2a" }}>
                {["Alumno","Programa","Monto","Fecha","Metodo","Estado"].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color:"#64748b" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m,i)=>(
                <tr key={m.id}
                  style={{ borderBottom:"1px solid #111111", background:i%2===0?"transparent":"rgba(255,255,255,0.01)" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(192,57,43,0.04)"}
                  onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"transparent":"rgba(255,255,255,0.01)"}
                >
                  <td className="px-4 py-3 font-semibold text-white text-xs">{m.alumno}</td>
                  <td className="px-4 py-3 text-xs" style={{ color:"#94a3b8" }}>{m.programa}</td>
                  <td className="px-4 py-3 font-bold" style={{ color:"#f5c518", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"14px" }}>{m.monto}</td>
                  <td className="px-4 py-3 text-xs" style={{ color:"#64748b" }}>{m.fecha}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background:"rgba(96,165,250,0.1)",color:"#60a5fa" }}>{m.metodo}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${m.estado==="activo"?"status-active":"status-overdue"}`}>{m.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// Punto de entrada del panel: autenticacion + rutas internas
// ─────────────────────────────────────────────────────────────────────────────
const AdminPanel = () => {
  const [isAuth, setIsAuth] = useState(() => sessionStorage.getItem("bfs_admin_auth") === "1")
  const handleLogin  = () => { sessionStorage.setItem("bfs_admin_auth", "1"); setIsAuth(true)  }
  const handleLogout = () => { sessionStorage.removeItem("bfs_admin_auth");   setIsAuth(false) }

  if (!isAuth) return <AdminLogin onLogin={handleLogin}/>

  return (
    <AdminLayout onLogout={handleLogout}>
      <Routes>
        <Route path="/admin"           element={<Navigate to="/admin/dashboard" replace/>}/>
        <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
        <Route path="/admin/alumnos"   element={<AdminAlumnos/>}/>
        <Route path="/admin/clases"    element={<AdminClases/>}/>
        <Route path="/admin/pagos"     element={<AdminPagos/>}/>
      </Routes>
    </AdminLayout>
  )
}

export default AdminPanel
