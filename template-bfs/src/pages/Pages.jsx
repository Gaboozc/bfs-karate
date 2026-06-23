// Pages + Admin + App — BFS Martial Arts
import { useState } from "react"
import { Routes, Route, useLocation, useNavigate, Link, Navigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, Users, Calendar, CreditCard, LogOut, Eye,
  TrendingUp, TrendingDown, Search, Bell, Menu, X, AlertTriangle,
  Trophy, Star, Shield, Zap, UserCheck, Clock, CheckCircle, MapPin, Phone, Mail,
} from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import { content }   from "../data/content"
import { adminData } from "../data/adminData"
import { Navbar, Footer, WhatsAppButton, BFSLogo, SectionHeader } from "../components/layout/Layout"
import {
  Hero, BeltProgress, ProgramsPreview, InstructorsPreview,
  ScheduleSection, Testimonials, EnrollCTA, MerchPreview, EventosPreview,
} from "../components/sections/Sections"
import { fadeInUp, fadeIn, scaleIn, stagger, staggerSlow, viewportOnce, pageTransition } from "../styles/animations"

const ADMIN_PW     = "admin123"
const CHART_COLORS = ["#c0392b","#f5c518","#1a5276","#6b4c36","#2d6a4f","#888888","#f5f5f5"]
const beltColors   = { Blanco:"#f5f5f5", Amarillo:"#f5c518", Naranja:"#e07b39", Verde:"#2d6a4f", Azul:"#1a5276", Cafe:"#6b4c36", Negro:"#1a1a1a" }
const progIcons    = { trophy:Trophy, star:Star, shield:Shield, zap:Zap, "user-shield":Shield, "user-check":UserCheck }

// Banner reutilizable
const PageBanner = ({ eyebrow, title }) => (
  <div className="pt-24 pb-14 relative overflow-hidden" style={{ background:"#0a0a0a" }}>
    <div className="absolute inset-0 tatami-pattern"/>
    <div className="num-deco absolute bottom-0 right-4 opacity-40">{title.substring(0,4).toUpperCase()}</div>
    <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-0.5 w-8" style={{ background:"#c0392b" }}/>
        <span className="text-[11px] tracking-[0.28em] uppercase font-semibold" style={{ color:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{eyebrow}</span>
      </div>
      <h1 className="font-display" style={{ fontSize:"clamp(3rem,10vw,8rem)", color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif", letterSpacing:"0.03em" }}>{title}</h1>
    </div>
  </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// PAGINAS PUBLICAS
// ─────────────────────────────────────────────────────────────────────────────
export const Home = () => (
  <motion.main initial="initial" animate="animate" exit="exit" variants={pageTransition}>
    <Hero />
    <BeltProgress />
    <ProgramsPreview />
    <InstructorsPreview />
    <ScheduleSection />
    <EventosPreview />
    <Testimonials />
    <MerchPreview />
    <EnrollCTA />
  </motion.main>
)

export const ProgramasPage = () => (
  <motion.div initial="initial" animate="animate" exit="exit" variants={pageTransition}>
    <PageBanner eyebrow="Disciplinas" title="Nuestros Programas" />
    <section className="py-16 md:py-20" style={{ background:"#0a0a0a" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          initial="hidden" animate="visible" variants={stagger}
        >
          {content.programs.map(prog => {
            const Icon = progIcons[prog.icon] || Trophy
            return (
              <motion.div key={prog.id} variants={scaleIn}
                className="program-card p-7 relative overflow-hidden"
                style={{ borderColor: prog.featured?"rgba(192,57,43,0.4)":"rgba(192,57,43,0.1)" }}
              >
                <div className="w-8 h-1 mb-4" style={{ background:prog.color }}/>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-lg" style={{ background:`${prog.color}18` }}>
                    <Icon size={18} style={{ color:prog.color }}/>
                  </div>
                  {prog.featured && <span className="text-[9px] font-bold px-2 py-0.5 tracking-widest uppercase" style={{ background:"rgba(192,57,43,0.15)", color:"#c0392b" }}>Popular</span>}
                </div>
                <h3 className="font-display text-2xl mb-1" style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{prog.title}</h3>
                <p className="text-xs font-semibold mb-3 tracking-wider" style={{ color:prog.color }}>{prog.ageRange} · {prog.level}</p>
                <p className="text-sm leading-relaxed mb-5" style={{ color:"#888888" }}>{prog.desc}</p>
                <div className="space-y-1.5 mb-5">
                  {[["Horario",prog.schedule],["Duracion",prog.duration]].map(([label,val])=>(
                    <div key={label} className="flex items-center gap-2 text-xs" style={{ color:"#888888" }}>
                      <Clock size={11} style={{ color:prog.color }}/>{label}: {val}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4" style={{ borderTop:"1px solid rgba(245,245,245,0.06)" }}>
                  <div className="font-display text-2xl" style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{prog.price}</div>
                  <Link to="/contacto" className="px-4 py-2 text-xs font-bold transition-all duration-200"
                    style={{ background:prog.color, color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"13px" }}
                    onMouseEnter={e=>e.currentTarget.style.opacity="0.85"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}
                  >Inscribirse</Link>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
    <EnrollCTA />
  </motion.div>
)

export const InstructoresPage = () => (
  <motion.div initial="initial" animate="animate" exit="exit" variants={pageTransition}>
    <PageBanner eyebrow="El Equipo" title="Instructores" />
    <InstructorsPreview />
    <EnrollCTA />
  </motion.div>
)

export const HorariosPage = () => {
  const { schedule } = content
  const dayKeys = ["mon","tue","wed","thu","fri","sat","sun"]
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageTransition}>
      <PageBanner eyebrow="Disponibilidad" title="Horario Completo" />
      <section className="py-16 md:py-20" style={{ background:"#0a0a0a" }}>
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <motion.div className="overflow-x-auto" initial="hidden" animate="visible" variants={fadeInUp}>
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr style={{ borderBottom:"2px solid rgba(192,57,43,0.3)" }}>
                  <th className="py-4 pr-6 text-left w-16" style={{ color:"#888888", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"14px" }}>Hora</th>
                  {schedule.days.map(d=>(
                    <th key={d} className="py-4 px-2 text-center" style={{ color:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"15px" }}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedule.slots.map((slot,i)=>(
                  <tr key={i} style={{ borderBottom:"1px solid rgba(245,245,245,0.04)" }}>
                    <td className="py-3 pr-6 font-bold text-xs" style={{ color:"rgba(245,245,245,0.4)", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{slot.time}</td>
                    {dayKeys.map(key=>{
                      const cls = slot[key]
                      const color = { "Karate Kids":"#f5c518","Karate Competitivo":"#c0392b","Adultos":"#1a5276","High Perf.":"#6b4c36","Defensa P.":"#2d6a4f","High Performance":"#6b4c36" }[cls]
                      return (
                        <td key={key} className="py-2 px-1">
                          {cls ? (
                            <div className="py-2 px-2 text-center text-[10px] font-bold tracking-wider rounded schedule-cell has-class"
                              style={{ background:`${color}15`, color, border:`1px solid ${color}30` }}
                            >{cls}</div>
                          ) : (
                            <div className="py-2 text-center text-[10px]" style={{ color:"rgba(245,245,245,0.06)" }}>-</div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
          <p className="text-xs mt-6 text-center" style={{ color:"rgba(245,245,245,0.25)" }}>
            Horarios sujetos a cambio. Consulta disponibilidad de clases privadas directamente con tu instructor.
          </p>
        </div>
      </section>
      <EnrollCTA />
    </motion.div>
  )
}

export const ContactoPage = () => {
  const waUrl = `https://wa.me/${content.business.whatsapp}?text=${encodeURIComponent(content.enroll.whatsappMessage)}`
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageTransition}>
      <PageBanner eyebrow="Unete" title="Contacto & Inscripcion" />
      <section className="py-16 md:py-24" style={{ background:"#0a0a0a" }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6" style={{ background:"rgba(192,57,43,0.1)", border:"1px solid rgba(192,57,43,0.3)" }}>
                <CheckCircle size={13} style={{ color:"#c0392b" }}/><span className="text-xs font-bold" style={{ color:"#c0392b" }}>{content.enroll.badge}</span>
              </div>
              <h2 className="font-display mb-2" style={{ fontSize:"clamp(2.5rem,7vw,5rem)", color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>
                {content.enroll.headline}
              </h2>
              <div className="blood-line mb-5"/>
              <p className="text-base leading-relaxed mb-8" style={{ color:"#888888" }}>{content.enroll.subheadline}</p>

              <motion.a href={waUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 w-full py-4 text-base font-bold"
                style={{ background:"#c0392b", color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"16px" }}
                whileHover={{ scale:1.02, background:"#a93226" }} whileTap={{ scale:0.97 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                {content.enroll.cta}
              </motion.a>
              <p className="text-center text-xs mt-3" style={{ color:"rgba(245,245,245,0.25)" }}>Respondemos en menos de 15 minutos</p>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-4">
              <div className="p-7" style={{ background:"#111111", border:"1px solid rgba(192,57,43,0.15)" }}>
                <h3 className="font-display text-xl mb-5" style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>El Dojo</h3>
                {[{Icon:MapPin,label:"Direccion",val:`${content.business.address}, ${content.business.city}`},
                  {Icon:Phone, label:"Telefono",  val:content.business.phone},
                  {Icon:Mail,  label:"Email",     val:content.business.email},
                  {Icon:Clock, label:"Lun-Vie",   val:content.business.hours.weekdays},
                  {Icon:Clock, label:"Sabado",    val:content.business.hours.saturday},
                  {Icon:Clock, label:"Domingo",   val:content.business.hours.sunday},
                ].map(({Icon,label,val})=>(
                  <div key={label} className="flex items-start gap-3 py-3" style={{ borderBottom:"1px solid rgba(245,245,245,0.05)" }}>
                    <div className="w-7 h-7 flex items-center justify-center rounded shrink-0" style={{ background:"rgba(192,57,43,0.12)" }}>
                      <Icon size={13} style={{ color:"#c0392b" }}/>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color:"#c0392b" }}>{label}</p>
                      <p className="text-sm" style={{ color:"rgba(245,245,245,0.45)" }}>{val}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Certificaciones */}
              <div className="p-6" style={{ background:"#111111", border:"1px solid rgba(192,57,43,0.15)" }}>
                <h3 className="font-display text-lg mb-4" style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>Certificaciones</h3>
                {content.business.certifications.map((c,i)=>(
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <CheckCircle size={12} style={{ color:"#c0392b" }}/>
                    <span className="text-sm" style={{ color:"rgba(245,245,245,0.55)" }}>{c}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

export const MerchPage = () => {
  const [activeFilter, setActiveFilter] = useState("Todos")
  const categories = ["Todos", "Ropa", "Equipo", "Accesorios"]
  const filtered = activeFilter === "Todos"
    ? content.merch
    : content.merch.filter(p => p.category === activeFilter)

  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageTransition}>
      <PageBanner eyebrow="Tienda Oficial" title="BFS Merch" />
      <section className="py-16 md:py-20" style={{ background:"#0a0a0a" }}>
        <div className="max-w-7xl mx-auto px-5 md:px-10">

          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveFilter(cat)}
                className="px-4 py-2 text-xs font-bold tracking-wider transition-all duration-200"
                style={{
                  background: activeFilter === cat ? "#c0392b" : "#1a1a1a",
                  color:      activeFilter === cat ? "#f5f5f5" : "#888888",
                  border:     `1px solid ${activeFilter === cat ? "#c0392b" : "rgba(245,245,245,0.08)"}`,
                  fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize:"14px",
                }}
              >{cat}</button>
            ))}
            <span className="ml-auto text-xs" style={{ color:"#888888" }}>
              {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Grid de productos */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            initial="hidden" animate="visible" variants={stagger}
          >
            {filtered.map(product => {
              const waUrl = `https://wa.me/${content.business.whatsapp}?text=${encodeURIComponent(`Hola, me interesa: ${product.name}. Me pueden dar mas informacion y precio final?`)}`
              return (
                <motion.div key={product.id} variants={scaleIn}
                  className="overflow-hidden"
                  style={{ background:"#111111", border:"1px solid rgba(245,245,245,0.06)" }}
                  whileHover={{ borderColor:"rgba(192,57,43,0.3)" }}
                >
                  <div className="relative h-52 overflow-hidden">
                    <motion.img src={product.image} alt={product.name}
                      className="w-full h-full object-cover"
                      style={{ filter:"grayscale(30%)" }}
                      whileHover={{ scale:1.05, filter:"grayscale(0%)" }}
                      transition={{ duration:0.4 }}
                    />
                    {product.badge && (
                      <div className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold tracking-wider"
                        style={{ background:"#c0392b", color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}
                      >{product.badge}</div>
                    )}
                    <div className="absolute top-3 right-3 px-2 py-0.5 text-[10px]"
                      style={{ background:"rgba(10,10,10,0.75)", color:"rgba(245,245,245,0.5)" }}
                    >{product.category}</div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg mb-1" style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{product.name}</h3>
                    <p className="text-xs leading-relaxed mb-4" style={{ color:"#888888" }}>{product.desc}</p>
                    <div className="flex items-center justify-between pt-3" style={{ borderTop:"1px solid rgba(245,245,245,0.05)" }}>
                      <span className="font-display text-xl" style={{ color:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{product.price}</span>
                      <motion.a href={waUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold"
                        style={{ background:"#25D366", color:"#ffffff", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"13px" }}
                        whileHover={{ opacity:0.9 }} whileTap={{ scale:0.97 }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        Consultar
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          <p className="text-xs mt-8 text-center" style={{ color:"rgba(245,245,245,0.2)" }}>
            Precios en MXN. Disponibilidad de tallas sujeta a inventario. Consulta por WhatsApp.
          </p>
        </div>
      </section>
    </motion.div>
  )
}

export const EventosPage = () => {
  const today = new Date()
  const [curMonth, setCurMonth] = useState({ y: today.getFullYear(), m: today.getMonth() })
  const [selDay, setSelDay]     = useState(null)

  const { y, m } = curMonth
  const MONTHS   = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
  const DAYS     = ["Lun","Mar","Mie","Jue","Vie","Sab","Dom"]
  const TYPE_COL = { Torneo:"#c0392b", Seminario:"#1a5276", Competencia:"#c0392b", Formacion:"#6b4c36", Exhibicion:"#2d6a4f" }

  const daysInMonth  = new Date(y, m + 1, 0).getDate()
  const firstDow     = new Date(y, m, 1).getDay()
  const offset       = firstDow === 0 ? 6 : firstDow - 1
  const totalCells   = Math.ceil((offset + daysInMonth) / 7) * 7

  const cleanDate = str => str.replace(/\{\{|\}\}/g, "")

  const eventsByDay = {}
  content.eventos.forEach(e => {
    const d = new Date(cleanDate(e.date))
    if (d.getFullYear() === y && d.getMonth() === m) {
      const day = d.getDate()
      if (!eventsByDay[day]) eventsByDay[day] = []
      eventsByDay[day].push(e)
    }
  })

  const allFuture = content.eventos
    .filter(e => new Date(cleanDate(e.date)) >= new Date(today.getFullYear(), today.getMonth(), today.getDate()))
    .sort((a, b) => new Date(cleanDate(a.date)) - new Date(cleanDate(b.date)))

  const displayEvents = selDay
    ? (eventsByDay[selDay] || [])
    : Object.values(eventsByDay).flat().length > 0
      ? Object.values(eventsByDay).flat().sort((a,b) => new Date(cleanDate(a.date)) - new Date(cleanDate(b.date)))
      : allFuture.slice(0, 6)

  const prevMonth = () => { const d = new Date(y, m - 1, 1); setCurMonth({ y:d.getFullYear(), m:d.getMonth() }); setSelDay(null) }
  const nextMonth = () => { const d = new Date(y, m + 1, 1); setCurMonth({ y:d.getFullYear(), m:d.getMonth() }); setSelDay(null) }

  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageTransition}>
      <PageBanner eyebrow="Agenda" title="Eventos & Torneos" />
      <section className="py-16 md:py-20" style={{ background:"#0a0a0a" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Calendario */}
            <div className="lg:col-span-3">
              {/* Navegacion de mes */}
              <div className="flex items-center justify-between mb-6">
                <button onClick={prevMonth}
                  className="w-9 h-9 flex items-center justify-center text-lg transition-all"
                  style={{ border:"1px solid rgba(192,57,43,0.3)", color:"#c0392b" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(192,57,43,0.1)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                >‹</button>
                <h2 className="font-display text-2xl tracking-wider"
                  style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}
                >{MONTHS[m]} {y}</h2>
                <button onClick={nextMonth}
                  className="w-9 h-9 flex items-center justify-center text-lg transition-all"
                  style={{ border:"1px solid rgba(192,57,43,0.3)", color:"#c0392b" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(192,57,43,0.1)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                >›</button>
              </div>

              {/* Nombres de dias */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS.map(d => (
                  <div key={d} className="text-center py-2 text-[11px] font-bold tracking-widest"
                    style={{ color:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif" }}
                  >{d}</div>
                ))}
              </div>

              {/* Celdas */}
              <div className="grid grid-cols-7 gap-0.5">
                {Array.from({ length: totalCells }, (_, i) => {
                  const dayNum   = i - offset + 1
                  const valid    = dayNum >= 1 && dayNum <= daysInMonth
                  const dayEvts  = valid ? (eventsByDay[dayNum] || []) : []
                  const isToday  = valid && y === today.getFullYear() && m === today.getMonth() && dayNum === today.getDate()
                  const isSel    = valid && dayNum === selDay
                  const isPast   = valid && new Date(y, m, dayNum) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
                  const hasEvt   = dayEvts.length > 0

                  return (
                    <div key={i}
                      onClick={() => valid && hasEvt && setSelDay(isSel ? null : dayNum)}
                      className="aspect-square flex flex-col items-center justify-start pt-1.5 relative rounded-sm transition-all duration-150"
                      style={{
                        background: isSel ? "rgba(192,57,43,0.2)" : isToday ? "rgba(192,57,43,0.08)" : "transparent",
                        border: isSel ? "1px solid #c0392b" : isToday ? "1px solid rgba(192,57,43,0.35)" : "1px solid transparent",
                        cursor: valid && hasEvt ? "pointer" : "default",
                        opacity: !valid ? 0 : isPast && !hasEvt ? 0.3 : 1,
                      }}
                    >
                      {valid && (
                        <>
                          <span className="text-[11px] font-bold leading-none mb-1"
                            style={{ color: isToday || isSel ? "#c0392b" : "#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}
                          >{dayNum}</span>
                          <div className="flex gap-0.5 flex-wrap justify-center px-0.5">
                            {dayEvts.slice(0, 3).map((e, ei) => (
                              <div key={ei} className="w-1.5 h-1.5 rounded-full" style={{ background: e.color || "#c0392b" }}/>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Leyenda */}
              <div className="flex flex-wrap gap-4 mt-4 pt-4" style={{ borderTop:"1px solid rgba(245,245,245,0.06)" }}>
                {Object.entries(TYPE_COL).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background:color }}/>
                    <span className="text-[11px]" style={{ color:"rgba(245,245,245,0.45)" }}>{type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lista de eventos */}
            <div className="lg:col-span-2">
              <h3 className="font-display text-xl mb-5"
                style={{ color:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif", letterSpacing:"0.08em" }}
              >
                {selDay ? `${selDay} de ${MONTHS[m]}` : "Proximos Eventos"}
              </h3>
              <div className="space-y-3">
                {displayEvents.length === 0 ? (
                  <p className="text-sm" style={{ color:"#888888" }}>Sin eventos este mes.</p>
                ) : (
                  displayEvents.map(evt => {
                    const evtDate = new Date(cleanDate(evt.date))
                    const waLink  = evt.link || `https://wa.me/${content.business.whatsapp}?text=${encodeURIComponent(`Hola, me interesa inscribirme al evento: ${evt.title}`)}`
                    return (
                      <motion.div key={evt.id}
                        initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }}
                        className="p-4"
                        style={{ background:"#111111", borderLeft:`3px solid ${evt.color || "#c0392b"}`, border:`1px solid ${evt.color || "#c0392b"}20`, borderLeftWidth:"3px" }}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5"
                            style={{ background:`${evt.color || "#c0392b"}18`, color: evt.color || "#c0392b" }}
                          >{evt.type}</span>
                          <span className="text-[11px] font-bold shrink-0"
                            style={{ color:"rgba(245,245,245,0.3)", fontFamily:"'Bebas Neue',Impact,sans-serif" }}
                          >{evtDate.toLocaleDateString("es-MX",{ day:"numeric", month:"short", year:"numeric" })}</span>
                        </div>
                        <h4 className="font-display text-base mb-0.5" style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{evt.title}</h4>
                        <p className="text-xs mb-1" style={{ color:"#888888" }}>{evt.location}</p>
                        <p className="text-xs leading-relaxed mb-3" style={{ color:"rgba(245,245,245,0.4)" }}>{evt.desc}</p>
                        <a href={waLink} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold"
                          style={{ background: evt.color || "#c0392b", color:"#f5f5f5", padding:"5px 12px", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"12px" }}
                        >Inscribirse / Info →</a>
                      </motion.div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <EnrollCTA />
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PANEL ADMIN
// ─────────────────────────────────────────────────────────────────────────────

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
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color:"#94a3b8" }}>Contrasena</label>
              <input type="password" value={pw} onChange={e=>{ setPw(e.target.value); setErr(false) }}
                placeholder="••••••••" autoFocus
                className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none"
                style={{ background:"#0a0a0a", border:err?"1px solid #f87171":"1px solid #2a2a2a" }}
                onFocus={e=>!err&&(e.target.style.borderColor="#c0392b")}
                onBlur={e=>!err&&(e.target.style.borderColor="#2a2a2a")}
              />
              {err && <p className="text-xs mt-2" style={{ color:"#f87171" }}>Contrasena incorrecta.</p>}
            </div>
            <motion.button type="submit" disabled={loading||!pw}
              className="w-full py-3 rounded-lg text-sm font-bold text-white"
              style={{ background:pw?"#c0392b":"#2a2a2a", cursor:pw?"pointer":"not-allowed", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"16px" }}
              whileHover={pw?{ scale:1.02 }:{}} whileTap={pw?{ scale:0.98 }:{}}
            >{loading?"Verificando...":"INGRESAR"}</motion.button>
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
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
            <button className="md:hidden text-gray-400" onClick={()=>setSidebarOpen(true)}><Menu size={20}/></button>
            <h2 className="font-display text-base text-white" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif", letterSpacing:"0.08em" }}>
              {pageTitles[location.pathname]||"Panel"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
              <input placeholder="Buscar alumno..." className="pl-8 pr-4 py-2 rounded-lg text-xs outline-none"
                style={{ background:"#1a1a1a", border:"1px solid #2a2a2a", color:"#e2e8f0", width:"180px" }}
              />
            </div>
            <div className="relative">
              <button className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:"#1a1a1a" }}>
                <Bell size={14} className="text-gray-400"/>
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
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar alumno..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none text-white"
            style={{ background:"#1a1a1a", border:"1px solid #2a2a2a" }}
          />
        </div>
        {programas.map(prog=>(
          <button key={prog} onClick={()=>setFilterProg(prog)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
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
            className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all duration-200"
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
// ROUTER PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
const App = () => {
  const location = useLocation()
  const [isAuth, setIsAuth] = useState(()=>sessionStorage.getItem("bfs_admin_auth")==="1")
  const handleLogin  = () => { sessionStorage.setItem("bfs_admin_auth","1");  setIsAuth(true)  }
  const handleLogout = () => { sessionStorage.removeItem("bfs_admin_auth");   setIsAuth(false) }

  const isAdmin = location.pathname.startsWith("/admin")

  if (isAdmin) {
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

  return (
    <div style={{ background:"#0a0a0a" }}>
      <Navbar/>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"            element={<Home/>}/>
          <Route path="/programas"   element={<ProgramasPage/>}/>
          <Route path="/instructores"element={<InstructoresPage/>}/>
          <Route path="/horarios"    element={<HorariosPage/>}/>
          <Route path="/eventos"     element={<EventosPage/>}/>
          <Route path="/merch"       element={<MerchPage/>}/>
          <Route path="/contacto"    element={<ContactoPage/>}/>
        </Routes>
      </AnimatePresence>
      <Footer/>
      <WhatsAppButton/>
    </div>
  )
}

export default App
