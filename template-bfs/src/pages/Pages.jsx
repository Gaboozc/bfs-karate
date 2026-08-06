// Paginas publicas + router — BFS Martial Arts
// El panel de administracion vive en ../admin/AdminPanel y se carga aparte.
import { useState, useEffect, lazy, Suspense } from "react"
import { Routes, Route, useLocation, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Trophy, Star, Shield, Zap, UserCheck, Clock, CheckCircle, MapPin, Phone, Mail,
  ChevronDown, Award, Flame, Ruler,
} from "lucide-react"
import { content } from "../data/content"
import { precio, real, soloReales } from "../data/pendientes"
import { eventosPublicos, horariosPublicos, productosPublicos } from "../data/contenidoPublico"
import { Navbar, Footer, WhatsAppButton, SectionHeader } from "../components/layout/Layout"
import {
  Hero, BeltProgress, Testimonials, EnrollCTA, MetodologiaBFS, SponsorSection,
  SponsorsBanner, MultimediaSection,
} from "../components/sections/Sections"
import { fadeInUp, fadeIn, scaleIn, stagger, staggerSlow, viewportOnce, pageTransition } from "../styles/animations"

// Carga diferida: recharts y todo el panel quedan fuera del paquete publico
const AdminPanel = lazy(() => import("../admin/AdminPanel"))

const progIcons = { trophy:Trophy, star:Star, shield:Shield, zap:Zap, "user-shield":Shield, "user-check":UserCheck }

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
// El inicio NO repite el contenido de las secciones del navbar. Solo lleva
// material que le es exclusivo: hero, progresion de cintas, metodologia,
// testimonios y patrocinios.
export const Home = () => (
  <motion.main initial="initial" animate="animate" exit="exit" variants={pageTransition}>
    <Hero />
    <BeltProgress />
    <MetodologiaBFS />
    <MultimediaSection />
    <Testimonials />
    <SponsorsBanner />
    <EnrollCTA />
  </motion.main>
)

export const SponsorsPage = () => (
  <motion.div initial="initial" animate="animate" exit="exit" variants={pageTransition}>
    <PageBanner eyebrow={content.sponsor.eyebrow} title={content.sponsor.title} />
    <SponsorSection hideHeader />
  </motion.div>
)

// Acordeon de preguntas frecuentes — solo se usa en Programas
const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom:"1px solid rgba(245,245,245,0.07)" }}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left transition-colors"
        style={{ color: open ? "#c0392b" : "#f5f5f5" }}
        onMouseEnter={e=>e.currentTarget.style.color="#c0392b"}
        onMouseLeave={e=>e.currentTarget.style.color = open ? "#c0392b" : "#f5f5f5"}
      >
        <span className="font-display text-lg md:text-xl" style={{ fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration:0.2 }} className="shrink-0">
          <ChevronDown size={18} style={{ color:"#c0392b" }}/>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }}
            transition={{ duration:0.25 }} style={{ overflow:"hidden" }}
          >
            <p className="text-sm leading-relaxed pb-5 pr-8" style={{ color:"#888888" }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const ProgramasPage = () => (
  <motion.div initial="initial" animate="animate" exit="exit" variants={pageTransition}>
    <PageBanner eyebrow="Disciplinas" title="Nuestros Programas" />
    <section className="py-16 md:py-20" style={{ background:"#0a0a0a" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <p className="text-base leading-relaxed max-w-2xl mb-12" style={{ color:"#888888" }}>
          {content.programasPage.intro}
        </p>
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
                  <div className="font-display text-2xl" style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{precio(prog.price)}</div>
                  <Link to="/contacto" className="px-4 py-2 text-xs font-bold transition-colors duration-200"
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

    {/* Como empezar */}
    <section className="py-16 md:py-20 section-steel">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <SectionHeader eyebrow="Primer paso" title={content.programasPage.pasos.title} align="left" className="mb-10"/>
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-5"
          initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger}
        >
          {content.programasPage.pasos.items.map(step => (
            <motion.div key={step.n} variants={fadeInUp} className="p-7 relative overflow-hidden"
              style={{ background:"#0a0a0a", borderLeft:"3px solid #c0392b" }}
            >
              <div className="absolute top-3 right-4 font-display leading-none select-none pointer-events-none"
                style={{ fontSize:"4.5rem", color:"#c0392b", opacity:0.09, fontFamily:"'Bebas Neue',Impact,sans-serif" }}
              >{step.n}</div>
              <div className="relative z-10">
                <div className="font-display text-sm tracking-[0.2em] mb-3" style={{ color:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>PASO {step.n}</div>
                <h3 className="font-display text-2xl mb-2" style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color:"#888888" }}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Preguntas frecuentes */}
    <section className="py-16 md:py-20" style={{ background:"#0a0a0a" }}>
      <div className="max-w-3xl mx-auto px-5 md:px-10">
        <SectionHeader eyebrow="Dudas" title="Preguntas Frecuentes" align="left" className="mb-8"/>
        <div>
          {content.programasPage.faq.map(item => <FaqItem key={item.q} q={item.q} a={item.a}/>)}
        </div>
      </div>
    </section>

    <EnrollCTA variant="programas" />
  </motion.div>
)

export const InstructoresPage = () => {
  const inst = content.instructors[0]
  if (!inst) return null
  const igUrl = `https://instagram.com/${inst.instagram.replace("@","")}`
  const { trayectoria, filosofia } = content.instructorPage

  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageTransition}>
      <PageBanner eyebrow="El Equipo" title="Instructor" />

      {/* Perfil */}
      <section className="py-16 md:py-20" style={{ background:"#0a0a0a" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <motion.div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start"
            initial="hidden" animate="visible" variants={stagger}
          >
            <motion.div variants={fadeInUp} className="lg:col-span-2">
              <div className="relative overflow-hidden" style={{ aspectRatio:"3/4" }}>
                <img src={inst.photo} alt={`Retrato de ${inst.name}`} width="900" height="1200"
                  className="w-full h-full object-cover" style={{ filter:"grayscale(70%)" }}/>
                <div className="absolute inset-0" style={{ background:"linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 50%)" }}/>
                <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ background:inst.beltColor }}/>
                <div className="absolute bottom-4 left-4">
                  <div className="text-[10px] font-bold tracking-widest uppercase px-3 py-1"
                    style={{ background:"#c0392b", color:"#fff", fontFamily:"'Bebas Neue',Impact,sans-serif" }}
                  >{inst.rank}</div>
                </div>
              </div>
              <a href={igUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 mt-4 text-xs font-semibold transition-colors"
                style={{ color:"rgba(245,245,245,0.35)" }}
                onMouseEnter={e=>e.currentTarget.style.color="#c0392b"}
                onMouseLeave={e=>e.currentTarget.style.color="rgba(245,245,245,0.35)"}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
                {inst.instagram}
              </a>

              {/* Especialidades */}
              <div className="mt-6">
                <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color:"#c0392b" }}>Especialidades</p>
                <div className="flex flex-wrap gap-2">
                  {inst.specialties.map((s,i) => (
                    <span key={i} className="text-[11px] px-3 py-1 font-semibold tracking-wider"
                      style={{ background:"rgba(192,57,43,0.12)", color:"rgba(245,245,245,0.65)", border:"1px solid rgba(192,57,43,0.25)" }}
                    >{s}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="lg:col-span-3 flex flex-col gap-6">
              <div>
                <h2 className="font-display leading-none mb-1"
                  style={{ fontSize:"clamp(2rem,5vw,3.5rem)", color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif", letterSpacing:"0.03em" }}
                >{inst.name}</h2>
                <p className="text-sm font-semibold tracking-wider uppercase" style={{ color:"#c0392b" }}>{inst.title}</p>
                <div className="blood-line mt-3"/>
              </div>
              <p className="text-base leading-relaxed" style={{ color:"rgba(245,245,245,0.6)" }}>{inst.bio}</p>
              {inst.quote && (
                <blockquote className="border-l-2 pl-5 italic text-base leading-relaxed"
                  style={{ borderColor:"#c0392b", color:"rgba(245,245,245,0.45)" }}
                >"{inst.quote}"</blockquote>
              )}
              {inst.achievements && (
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color:"#c0392b" }}>Logros destacados</p>
                  <ul className="space-y-2">
                    {inst.achievements.map((a,i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color:"rgba(245,245,245,0.55)" }}>
                        <Award size={13} style={{ color:"#c0392b" }} className="mt-0.5 shrink-0"/>{a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Linea de tiempo */}
      <section className="py-16 md:py-20 section-steel">
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <SectionHeader eyebrow="Carrera" title="Trayectoria" align="left" className="mb-10"/>
          <motion.div className="relative" initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger}>
            {/* Linea vertical */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px" style={{ background:"rgba(192,57,43,0.25)" }}/>
            {trayectoria.map(t => (
              <motion.div key={t.year} variants={fadeInUp} className="relative pl-10 pb-9 last:pb-0">
                <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full"
                  style={{ background:"#0a0a0a", border:"2px solid #c0392b" }}
                />
                <div className="font-display text-xl mb-1" style={{ color:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{t.year}</div>
                <h3 className="font-display text-2xl mb-1.5" style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{t.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color:"#888888" }}>{t.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filosofia de entrenamiento */}
      <section className="py-16 md:py-20" style={{ background:"#0a0a0a" }}>
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <SectionHeader eyebrow="Metodo" title={filosofia.title} align="left" className="mb-10"/>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-5"
            initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger}
          >
            {filosofia.items.map(item => (
              <motion.div key={item.title} variants={scaleIn} className="p-7"
                style={{ background:"#111111", borderLeft:"3px solid #c0392b" }}
              >
                <h3 className="font-display text-2xl mb-2" style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color:"#888888" }}>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <EnrollCTA variant="instructor" />
    </motion.div>
  )
}

export const HorariosPage = () => {
  // El horario viene de la base, donde el Sensei lo edita en la parrilla.
  const [schedule, setSchedule] = useState(content.schedule)
  useEffect(() => {
    let vigente = true
    horariosPublicos(content.schedule).then(d => { if (vigente) setSchedule(d) })
    return () => { vigente = false }
  }, [])
  const dayKeys = ["mon","tue","wed","thu","fri","sat","sun"]
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageTransition}>
      <PageBanner eyebrow="Disponibilidad" title="Horario Completo" />
      <section className="py-16 md:py-20" style={{ background:"#0a0a0a" }}>
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <p className="text-base leading-relaxed max-w-2xl mb-10" style={{ color:"#888888" }}>
            {content.horariosPage.intro}
          </p>
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
          <p className="text-xs mt-6" style={{ color:"rgba(245,245,245,0.25)" }}>
            Horarios sujetos a cambio. Consulta disponibilidad de clases privadas directamente con tu instructor.
          </p>
        </div>
      </section>

      {/* Como funciona cada clase */}
      <section className="py-16 md:py-20 section-steel">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <SectionHeader eyebrow="Que esperar" title="Como es cada Clase" align="left" className="mb-10"/>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger}
          >
            {content.horariosPage.tiposClase.map(t => (
              <motion.div key={t.name} variants={scaleIn} className="p-6"
                style={{ background:"#0a0a0a", border:`1px solid ${t.color}25`, borderTop:`3px solid ${t.color}` }}
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h3 className="font-display text-2xl" style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{t.full}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 tracking-wider uppercase shrink-0"
                    style={{ background:`${t.color}18`, color:t.color }}
                  >{t.name}</span>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color:"#888888" }}>{t.desc}</p>
                <div className="flex items-center gap-2 pt-3" style={{ borderTop:"1px solid rgba(245,245,245,0.06)" }}>
                  <Flame size={12} style={{ color:t.color }}/>
                  <span className="text-[11px] font-semibold tracking-wider uppercase" style={{ color:"rgba(245,245,245,0.45)" }}>
                    Intensidad: {t.intensidad}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Notas */}
          <motion.div className="mt-12 p-7" style={{ background:"#0a0a0a", border:"1px solid rgba(192,57,43,0.15)" }}
            initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeInUp}
          >
            <h3 className="font-display text-xl mb-4" style={{ color:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>Antes de venir</h3>
            <ul className="space-y-2.5">
              {content.horariosPage.notas.map((n,i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color:"rgba(245,245,245,0.55)" }}>
                  <CheckCircle size={13} style={{ color:"#c0392b" }} className="mt-0.5 shrink-0"/>{n}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <EnrollCTA variant="horarios" />
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
                {/* Los datos que siguen pendientes no se listan */}
                {[{Icon:MapPin,label:"Direccion",val:`${content.business.address}, ${content.business.city}`},
                  {Icon:Phone, label:"Telefono",  val:content.business.phone},
                  {Icon:Mail,  label:"Email",     val:real(content.business.email)},
                  {Icon:Clock, label:"Lun-Vie",   val:content.business.hours.weekdays},
                  {Icon:Clock, label:"Sabado",    val:content.business.hours.saturday},
                  {Icon:Clock, label:"Domingo",   val:content.business.hours.sunday},
                ].filter(({val}) => val).map(({Icon,label,val})=>(
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
  // El catalogo viene del inventario del panel. Lo agotado ya no llega aqui:
  // la base lo filtra antes.
  const [merch, setMerch] = useState(content.merch)
  useEffect(() => {
    let vigente = true
    productosPublicos(content.merch).then(d => { if (vigente) setMerch(d) })
    return () => { vigente = false }
  }, [])

  const filtered = activeFilter === "Todos"
    ? merch
    : merch.filter(p => p.category === activeFilter)

  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageTransition}>
      <PageBanner eyebrow="Tienda Oficial" title="BFS Merch" />
      <section className="py-16 md:py-20" style={{ background:"#0a0a0a" }}>
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <p className="text-base leading-relaxed max-w-2xl mb-10" style={{ color:"#888888" }}>
            {content.merchPage.intro}
          </p>

          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveFilter(cat)}
                className="px-4 py-2 text-xs font-bold tracking-wider transition-colors duration-200"
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
                      width="500" height="500" loading="lazy"
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
                      <span className="font-display text-xl" style={{ color:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{precio(product.price)}</span>
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

          <p className="text-xs mt-8" style={{ color:"rgba(245,245,245,0.2)" }}>
            Precios en MXN. Disponibilidad de tallas sujeta a inventario. Consulta por WhatsApp.
          </p>
        </div>
      </section>

      {/* Como comprar + guia de tallas */}
      <section className="py-16 md:py-20 section-steel">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

            <div className="lg:col-span-3">
              <SectionHeader eyebrow="Proceso" title={content.merchPage.comoComprar.title} align="left" className="mb-8"/>
              <motion.div className="space-y-4" initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger}>
                {content.merchPage.comoComprar.items.map(step => (
                  <motion.div key={step.n} variants={fadeInUp} className="flex items-start gap-5 p-5"
                    style={{ background:"#0a0a0a", border:"1px solid rgba(245,245,245,0.06)" }}
                  >
                    <div className="font-display text-3xl leading-none shrink-0"
                      style={{ color:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif" }}
                    >{step.n}</div>
                    <div>
                      <h3 className="font-display text-xl mb-1" style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{step.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color:"#888888" }}>{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.div className="lg:col-span-2 p-6" style={{ background:"#0a0a0a", border:"1px solid rgba(192,57,43,0.15)" }}
              initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeInUp}
            >
              <div className="flex items-center gap-2 mb-4">
                <Ruler size={15} style={{ color:"#c0392b" }}/>
                <h3 className="font-display text-xl" style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>
                  {content.merchPage.tallas.title}
                </h3>
              </div>
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr style={{ borderBottom:"1px solid rgba(192,57,43,0.25)" }}>
                    <th className="py-2 text-left" style={{ color:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"14px" }}>Talla</th>
                    <th className="py-2 text-right" style={{ color:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"14px" }}>Estatura</th>
                  </tr>
                </thead>
                <tbody>
                  {content.merchPage.tallas.rows.map(r => (
                    <tr key={r.talla} style={{ borderBottom:"1px solid rgba(245,245,245,0.04)" }}>
                      <td className="py-2 font-bold" style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{r.talla}</td>
                      <td className="py-2 text-right text-xs" style={{ color:"#888888" }}>{r.estatura}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs leading-relaxed" style={{ color:"rgba(245,245,245,0.35)" }}>{content.merchPage.tallas.note}</p>
            </motion.div>
          </div>
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

  // Los eventos vienen de la base de datos, donde el Sensei los publica.
  // Mientras cargan —o si la base no responde— se usa el contenido local.
  const [eventos, setEventos] = useState(content.eventos)
  useEffect(() => {
    let vigente = true
    eventosPublicos(content.eventos).then(datos => { if (vigente) setEventos(datos) })
    return () => { vigente = false }
  }, [])

  // Los ya realizados salen de la misma lista: son los de fecha pasada con
  // resultado registrado. Sin resultado confirmado no se muestran, porque
  // afirmarian medallas o promociones que nadie ha verificado.
  const pasadosReales = soloReales(
    eventos.filter(e => new Date(cleanDate(e.date)) < today && e.resultado),
    "title", "location", "resultado", "date"
  )

  const eventsByDay = {}
  eventos.forEach(e => {
    const d = new Date(cleanDate(e.date))
    if (d.getFullYear() === y && d.getMonth() === m) {
      const day = d.getDate()
      if (!eventsByDay[day]) eventsByDay[day] = []
      eventsByDay[day].push(e)
    }
  })

  const allFuture = eventos
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
                <button onClick={prevMonth} aria-label="Mes anterior"
                  className="w-9 h-9 flex items-center justify-center text-lg transition-colors"
                  style={{ border:"1px solid rgba(192,57,43,0.3)", color:"#c0392b" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(192,57,43,0.1)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                ><span aria-hidden="true">‹</span></button>
                <h2 className="font-display text-2xl tracking-wider"
                  style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}
                >{MONTHS[m]} {y}</h2>
                <button onClick={nextMonth} aria-label="Mes siguiente"
                  className="w-9 h-9 flex items-center justify-center text-lg transition-colors"
                  style={{ border:"1px solid rgba(192,57,43,0.3)", color:"#c0392b" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(192,57,43,0.1)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                ><span aria-hidden="true">›</span></button>
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

                  // Los dias con evento son botones: se pueden enfocar y activar
                  // con teclado. Los vacios quedan como celdas inertes.
                  const clickable = valid && hasEvt
                  const Celda = clickable ? "button" : "div"
                  const etiqueta = clickable
                    ? `${dayNum} de ${MONTHS[m]}: ${dayEvts.length} evento${dayEvts.length !== 1 ? "s" : ""}`
                    : undefined

                  return (
                    <Celda key={i}
                      {...(clickable ? {
                        type: "button",
                        onClick: () => setSelDay(isSel ? null : dayNum),
                        "aria-label": etiqueta,
                        "aria-pressed": isSel,
                      } : { "aria-hidden": !valid })}
                      className="aspect-square flex flex-col items-center justify-start pt-1.5 relative rounded-sm transition-colors duration-150"
                      style={{
                        background: isSel ? "rgba(192,57,43,0.2)" : isToday ? "rgba(192,57,43,0.08)" : "transparent",
                        border: isSel ? "1px solid #c0392b" : isToday ? "1px solid rgba(192,57,43,0.35)" : "1px solid transparent",
                        cursor: clickable ? "pointer" : "default",
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
                    </Celda>
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

      {/* Historial — solo eventos confirmados. Los de relleno afirman
          resultados y medallas que nadie ha verificado. */}
      {pasadosReales.length > 0 && (
      <section className="py-16 md:py-20 section-steel">
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <SectionHeader eyebrow="Historial" title="Eventos Anteriores" align="left" className="mb-10"/>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-5"
            initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger}
          >
            {pasadosReales.map(evt => {
              const d = new Date(evt.date)
              return (
                <motion.div key={evt.id} variants={fadeInUp} className="p-6"
                  style={{ background:"#0a0a0a", border:"1px solid rgba(245,245,245,0.06)", borderLeft:`3px solid ${evt.color}` }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5"
                      style={{ background:`${evt.color}18`, color:evt.color }}
                    >{evt.type}</span>
                    <span className="text-[11px] font-bold shrink-0"
                      style={{ color:"rgba(245,245,245,0.3)", fontFamily:"'Bebas Neue',Impact,sans-serif" }}
                    >{d.toLocaleDateString("es-MX",{ day:"numeric", month:"long", year:"numeric" })}</span>
                  </div>
                  <h3 className="font-display text-2xl mb-1" style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{evt.title}</h3>
                  <p className="text-xs mb-3" style={{ color:"#888888" }}>{evt.location}</p>
                  <div className="flex items-start gap-2 pt-3" style={{ borderTop:"1px solid rgba(245,245,245,0.06)" }}>
                    <Trophy size={13} style={{ color:evt.color }} className="mt-0.5 shrink-0"/>
                    <span className="text-sm" style={{ color:"rgba(245,245,245,0.6)" }}>{evt.resultado}</span>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>
      )}

      <EnrollCTA variant="eventos" />
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTER PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }) }, [pathname])
  return null
}

// Pantalla mientras se descarga el panel de administracion
const CargandoPanel = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background:"#0a0a0a" }}>
    <div className="w-10 h-10 rounded-full animate-spin"
      style={{ border:"3px solid rgba(192,57,43,0.2)", borderTopColor:"#c0392b" }}
      role="status" aria-label="Cargando panel"
    />
    <p className="text-sm" style={{ color:"#888888" }}>Cargando panel…</p>
  </div>
)

const App = () => {
  const location = useLocation()
  const isAdmin  = location.pathname.startsWith("/admin")

  // El panel se descarga solo cuando alguien entra a /admin
  if (isAdmin) {
    return (
      <Suspense fallback={<CargandoPanel/>}>
        <AdminPanel/>
      </Suspense>
    )
  }

  return (
    <div style={{ background:"#0a0a0a" }}>
      {/* Primer elemento tabulable: permite saltarse el menu con teclado */}
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <ScrollToTop/>
      <Navbar/>
      <div id="contenido" tabIndex={-1}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"            element={<Home/>}/>
            <Route path="/programas"   element={<ProgramasPage/>}/>
            <Route path="/instructores"element={<InstructoresPage/>}/>
            <Route path="/horarios"    element={<HorariosPage/>}/>
            <Route path="/eventos"     element={<EventosPage/>}/>
            <Route path="/merch"       element={<MerchPage/>}/>
            <Route path="/sponsors"    element={<SponsorsPage/>}/>
            <Route path="/contacto"    element={<ContactoPage/>}/>
          </Routes>
        </AnimatePresence>
      </div>
      <Footer/>
      <WhatsAppButton/>
    </div>
  )
}

export default App
