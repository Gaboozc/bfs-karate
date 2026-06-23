// Secciones publicas — BFS Martial Arts
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight, Trophy, Star, Shield, Zap, UserCheck, Users, CheckCircle, Clock, Award } from "lucide-react"
import { SectionHeader } from "../layout/Layout"
import { content } from "../../data/content"
import { heroTitle, heroSub, heroCTA, fadeIn, fadeInUp, fadeInLeft, fadeInRight, scaleIn, stagger, staggerSlow, viewportOnce } from "../../styles/animations"

const progIcons = { trophy:Trophy, star:Star, shield:Shield, zap:Zap, "user-shield":Shield, "user-check":UserCheck }
const beltColors = { Blanco:"#f5f5f5", Amarillo:"#f5c518", Naranja:"#e07b39", Verde:"#2d6a4f", Azul:"#1a5276", Cafe:"#6b4c36", Negro:"#0a0a0a" }
const scheduleColors = {
  "Karate Kids":"#f5c518", "Karate Competitivo":"#c0392b",
  "Adultos":"#1a5276", "High Perf.":"#6b4c36",
  "Defensa P.":"#2d6a4f", "High Performance":"#6b4c36",
}

// ── Hero ──────────────────────────────────────────────────────────────────
export const Hero = () => {
  const waUrl = `https://wa.me/${content.business.whatsapp}?text=${encodeURIComponent(content.enroll.whatsappMessage)}`
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden" style={{ background:"#0a0a0a" }}>
      {/* Imagen de fondo */}
      <motion.div className="absolute inset-0 z-0"
        initial={{ scale:1.08 }} animate={{ scale:1 }} transition={{ duration:2, ease:"easeOut" }}
      >
        <img src={content.hero.image} alt="BFS Martial Arts" className="w-full h-full object-cover opacity-30"/>
        <div className="absolute inset-0" style={{ background:"linear-gradient(to top, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0.6) 50%, rgba(10,10,10,0.2) 100%)" }}/>
      </motion.div>
      <div className="absolute inset-0 z-0 tatami-pattern"/>

      {/* Numero decorativo */}
      <div className="absolute bottom-0 right-0 num-deco select-none pr-6 pb-0">BFS</div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10 w-full pt-24 pb-16">
        <motion.div initial="hidden" animate="visible"
          variants={{ hidden:{}, visible:{ transition:{ staggerChildren:0.13 } } }}
        >
          {/* Eyebrow */}
          <motion.div variants={fadeIn} className="flex items-center gap-3 mb-5">
            <div className="h-0.5 w-10" style={{ background:"#c0392b" }}/>
            <span className="text-[11px] tracking-[0.28em] uppercase font-semibold" style={{ color:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>
              {content.hero.eyebrow}
            </span>
          </motion.div>

          {/* Headline masivo */}
          <motion.h1 variants={heroTitle}
            className="font-display leading-none mb-5"
            style={{ fontSize:"clamp(5rem,16vw,14rem)", color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif", letterSpacing:"0.02em", whiteSpace:"pre-line" }}
          >{content.hero.headline}</motion.h1>

          {/* Linea roja */}
          <motion.div variants={heroSub} className="blood-line mb-5" style={{ width:"60px" }}/>

          {/* Subtitulo */}
          <motion.p variants={heroSub} className="text-base md:text-lg leading-relaxed mb-8 max-w-xl" style={{ color:"rgba(245,245,245,0.55)" }}>
            {content.hero.subheadline}
          </motion.p>

          {/* Badge */}
          <motion.div variants={heroSub} className="inline-flex items-center gap-2 px-4 py-2 mb-8"
            style={{ background:"rgba(192,57,43,0.15)", border:"1px solid rgba(192,57,43,0.35)" }}
          >
            <CheckCircle size={13} style={{ color:"#c0392b" }}/>
            <span className="text-xs font-bold" style={{ color:"#c0392b" }}>{content.hero.badge}</span>
          </motion.div>

          {/* CTAs */}
          <motion.div variants={heroCTA} className="flex flex-col sm:flex-row gap-4 mb-14">
            <Link to="/contacto"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold transition-all duration-200"
              style={{ background:"#c0392b", color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"16px" }}
              onMouseEnter={e=>e.currentTarget.style.background="#a93226"}
              onMouseLeave={e=>e.currentTarget.style.background="#c0392b"}
            >{content.hero.cta.primary} <ArrowRight size={16}/></Link>
            <Link to="/programas"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold transition-all duration-200"
              style={{ border:"1px solid rgba(245,245,245,0.2)", color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"16px" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor="#c0392b"; e.currentTarget.style.color="#c0392b" }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(245,245,245,0.2)"; e.currentTarget.style.color="#f5f5f5" }}
            >{content.hero.cta.secondary}</Link>
          </motion.div>

          {/* Stats */}
          <motion.div variants={heroCTA} className="flex flex-wrap gap-10 pt-8" style={{ borderTop:"1px solid rgba(245,245,245,0.07)" }}>
            {content.business.stats.map((s,i)=>(
              <div key={i}>
                <div className="font-display text-3xl" style={{ color:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{s.value}</div>
                <div className="text-[11px] tracking-wider uppercase mt-0.5" style={{ color:"rgba(245,245,245,0.35)" }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ── Progresion de cinturones ──────────────────────────────────────────────
export const BeltProgress = () => (
  <section style={{ background:"#111111" }}>
    <div className="belt-bar"/>
    <div className="max-w-7xl mx-auto px-5 md:px-10 py-10">
      <motion.div className="flex flex-wrap items-center justify-center gap-3 md:gap-5"
        initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger}
      >
        {["Blanco","Amarillo","Naranja","Verde","Azul","Cafe","Negro"].map((belt,i)=>(
          <motion.div key={belt} variants={scaleIn} className="flex flex-col items-center gap-2">
            <div className="w-10 h-2.5 rounded-sm" style={{ background:beltColors[belt], boxShadow:`0 0 8px ${beltColors[belt]}50` }}/>
            <span className="text-[10px] tracking-wider uppercase" style={{ color:"rgba(245,245,245,0.4)" }}>{belt}</span>
          </motion.div>
        ))}
        <motion.div variants={scaleIn} className="text-xs tracking-widest uppercase ml-4" style={{ color:"rgba(245,245,245,0.25)" }}>
          → Tu trayectoria
        </motion.div>
      </motion.div>
    </div>
  </section>
)

// ── Programas preview ─────────────────────────────────────────────────────
export const ProgramsPreview = () => {
  const featured = content.programs.slice(0,3)
  return (
    <section className="py-24 md:py-28" style={{ background:"#0a0a0a" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="flex items-end justify-between mb-12">
          <SectionHeader eyebrow="Disciplinas" title="Nuestros Programas" align="left" className="mb-0"/>
          <Link to="/programas" className="hidden md:inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold transition-colors duration-200"
            style={{ color:"rgba(245,245,245,0.4)", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"13px" }}
            onMouseEnter={e=>e.currentTarget.style.color="#c0392b"} onMouseLeave={e=>e.currentTarget.style.color="rgba(245,245,245,0.4)"}
          >Ver todos <ArrowRight size={12}/></Link>
        </div>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4"
          initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger}
        >
          {featured.map(prog => {
            const Icon = progIcons[prog.icon] || Trophy
            return (
              <motion.div key={prog.id} variants={scaleIn}
                className="program-card p-7 relative overflow-hidden"
                style={{ background:prog.featured?"#1c1c1c":"#111111", borderColor:prog.featured?"rgba(192,57,43,0.4)":"rgba(192,57,43,0.1)" }}
                whileHover={{ borderColor:"rgba(192,57,43,0.5)" }}
              >
                {/* Numero decorativo */}
                <div className="absolute top-4 right-5 font-display text-6xl leading-none select-none opacity-5"
                  style={{ color:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif" }}
                >{String(prog.id).padStart(2,"0")}</div>

                {/* Acento de color del programa */}
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

                <div className="flex items-center justify-between pt-4" style={{ borderTop:"1px solid rgba(245,245,245,0.06)" }}>
                  <div>
                    <div className="font-display text-2xl" style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{prog.price}</div>
                    <div className="text-[11px] flex items-center gap-1 mt-0.5" style={{ color:"#888888" }}>
                      <Clock size={10}/>{prog.schedule} · {prog.duration}
                    </div>
                  </div>
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
  )
}

// ── Instructores preview ──────────────────────────────────────────────────
export const InstructorsPreview = () => (
  <section className="py-24 md:py-28 section-steel">
    <div className="max-w-6xl mx-auto px-5 md:px-10">
      <SectionHeader eyebrow="El Equipo" title="Nuestro Instructor"
        subtitle="Maestros certificados con trayectoria en competencia nacional e internacional."
      />
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-5"
        initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger}
      >
        {content.instructors.map(inst => (
          <motion.div key={inst.id} variants={scaleIn}
            className="program-card overflow-hidden group"
            style={{ background:"#0a0a0a" }}
          >
            {/* Foto */}
            <div className="relative h-64 overflow-hidden">
              <motion.img src={inst.photo} alt={inst.name}
                className="w-full h-full object-cover" style={{ filter:"grayscale(80%)" }}
                whileHover={{ scale:1.05, filter:"grayscale(0%)" }} transition={{ duration:0.5 }}
              />
              {/* Cinta de color en la parte inferior */}
              <div className="absolute bottom-0 left-0 right-0 h-2" style={{ background:inst.beltColor }}/>
            </div>
            <div className="p-5">
              <div className="text-[10px] tracking-widest uppercase font-bold mb-1" style={{ color:"#c0392b" }}>{inst.rank}</div>
              <h3 className="font-display text-xl mb-0.5" style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{inst.name}</h3>
              <p className="text-xs font-medium mb-3" style={{ color:"#888888" }}>{inst.title}</p>
              <p className="text-sm leading-relaxed mb-4" style={{ color:"#888888" }}>{inst.bio}</p>
              <div className="flex flex-wrap gap-1.5">
                {inst.specialties.map((s,i)=>(
                  <span key={i} className="text-[10px] px-2 py-0.5 font-semibold tracking-wider"
                    style={{ background:"rgba(192,57,43,0.12)", color:"rgba(245,245,245,0.6)", border:"1px solid rgba(192,57,43,0.2)" }}
                  >{s}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
)

// ── Horario ───────────────────────────────────────────────────────────────
export const ScheduleSection = () => {
  const { schedule } = content
  const days3 = ["Lunes","Miercoles","Viernes"]
  return (
    <section className="py-24 md:py-28" style={{ background:"#0a0a0a" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="flex items-end justify-between mb-12">
          <SectionHeader eyebrow="Disponibilidad" title="Horario de Clases" align="left" className="mb-0"/>
          <Link to="/horarios" className="hidden md:inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold transition-colors duration-200"
            style={{ color:"rgba(245,245,245,0.4)", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"13px" }}
            onMouseEnter={e=>e.currentTarget.style.color="#c0392b"} onMouseLeave={e=>e.currentTarget.style.color="rgba(245,245,245,0.4)"}
          >Horario completo <ArrowRight size={12}/></Link>
        </div>

        {/* Preview — solo L/M/V en home */}
        <motion.div className="overflow-x-auto" initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeInUp}>
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr style={{ borderBottom:"1px solid rgba(192,57,43,0.2)" }}>
                <th className="py-3 pr-4 text-left w-16" style={{ color:"#888888", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"13px" }}>Hora</th>
                {days3.map(d => (
                  <th key={d} className="py-3 px-3 text-center" style={{ color:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"15px" }}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedule.slots.map((slot, i) => {
                const cells = [slot.mon, slot.wed, slot.fri]
                if (!cells.some(Boolean)) return null
                return (
                  <tr key={i} style={{ borderBottom:"1px solid rgba(245,245,245,0.04)" }}>
                    <td className="py-3 pr-4 font-bold text-xs" style={{ color:"rgba(245,245,245,0.4)", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{slot.time}</td>
                    {cells.map((cls, j) => (
                      <td key={j} className="py-2 px-2">
                        {cls ? (
                          <div className="schedule-cell has-class py-2 px-3 text-center text-[11px] font-bold tracking-wider rounded transition-all duration-200"
                            style={{ background:`${scheduleColors[cls] || "#888888"}15`, color:scheduleColors[cls] || "#888888",
                              border:`1px solid ${scheduleColors[cls] || "#888888"}30` }}
                          >{cls}</div>
                        ) : (
                          <div className="py-2 text-center text-[10px]" style={{ color:"rgba(245,245,245,0.08)" }}>-</div>
                        )}
                      </td>
                    ))}
                  </tr>
                )
              }).filter(Boolean)}
            </tbody>
          </table>
        </motion.div>

        {/* Leyenda de colores */}
        <motion.div className="flex flex-wrap gap-4 mt-8" initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger}>
          {Object.entries(scheduleColors).filter(([k])=>!k.includes("Perf.")).map(([cls,color])=>(
            <div key={cls} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ background:color }}/>
              <span className="text-xs" style={{ color:"rgba(245,245,245,0.45)" }}>{cls}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── Testimonios ───────────────────────────────────────────────────────────
export const Testimonials = () => (
  <section className="py-24 md:py-28 section-steel">
    <div className="max-w-5xl mx-auto px-5 md:px-10">
      <SectionHeader eyebrow="Familia BFS" title="Lo que Dicen Nuestros Atletas"/>
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-5"
        initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerSlow}
      >
        {content.testimonials.map(item=>(
          <motion.div key={item.id} variants={fadeInUp}
            className="p-7 relative" style={{ background:"#0a0a0a", border:"1px solid rgba(192,57,43,0.12)" }}
          >
            {/* Cinta decorativa del alumno */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-2 rounded-sm" style={{ background:beltColors[item.belt] || "#888888" }}/>
              <span className="text-[10px] tracking-widest uppercase font-bold" style={{ color:"rgba(245,245,245,0.35)" }}>Cinta {item.belt}</span>
            </div>
            <p className="text-sm leading-relaxed mb-5 italic" style={{ color:"rgba(245,245,245,0.65)" }}>"{item.text}"</p>
            <div className="h-px mb-4" style={{ background:"rgba(245,245,245,0.06)" }}/>
            <div>
              <div className="font-display text-base" style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{item.name}</div>
              <div className="text-xs mt-0.5" style={{ color:"#888888" }}>{item.role}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
)

// ── Preview Eventos ───────────────────────────────────────────────────────
export const EventosPreview = () => {
  const today = new Date()
  const upcoming = content.eventos
    .filter(e => {
      const raw = e.date.replace(/\{\{|\}\}/g, "")
      return new Date(raw) >= new Date(today.getFullYear(), today.getMonth(), today.getDate())
    })
    .sort((a, b) => new Date(a.date.replace(/\{\{|\}\}/g,"")) - new Date(b.date.replace(/\{\{|\}\}/g,"")))
    .slice(0, 3)
  return (
    <section className="py-24 md:py-28 section-steel">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="flex items-end justify-between mb-12">
          <SectionHeader eyebrow="Agenda" title="Proximos Eventos" align="left" className="mb-0"/>
          <Link to="/eventos" className="hidden md:inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold transition-colors duration-200"
            style={{ color:"rgba(245,245,245,0.4)", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"13px" }}
            onMouseEnter={e=>e.currentTarget.style.color="#c0392b"} onMouseLeave={e=>e.currentTarget.style.color="rgba(245,245,245,0.4)"}
          >Ver agenda <ArrowRight size={12}/></Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-sm" style={{ color:"#888888" }}>Proximos eventos disponibles pronto.</p>
        ) : (
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-5"
            initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger}
          >
            {upcoming.map(evt => {
              const evtDate = new Date(evt.date.replace(/\{\{|\}\}/g,""))
              const waUrl = evt.link || `https://wa.me/${content.business.whatsapp}?text=${encodeURIComponent(`Hola, me interesa el evento: ${evt.title}`)}`
              return (
                <motion.div key={evt.id} variants={fadeInUp}
                  className="p-6 relative overflow-hidden"
                  style={{ background:"#0a0a0a", border:`1px solid ${evt.color}20`, borderLeft:`3px solid ${evt.color}` }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-center px-3 py-2 shrink-0" style={{ background:`${evt.color}15` }}>
                      <div className="font-display text-2xl leading-none" style={{ color:evt.color, fontFamily:"'Bebas Neue',Impact,sans-serif" }}>
                        {evtDate.getDate()}
                      </div>
                      <div className="text-[10px] font-bold tracking-wider uppercase" style={{ color:"rgba(245,245,245,0.4)" }}>
                        {evtDate.toLocaleDateString("es-MX",{month:"short"}).replace(".","").toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 mb-2 inline-block"
                        style={{ background:`${evt.color}18`, color:evt.color }}
                      >{evt.type}</span>
                      <h3 className="font-display text-xl leading-none" style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{evt.title}</h3>
                    </div>
                  </div>
                  <p className="text-xs mb-1 flex items-center gap-1.5" style={{ color:"#888888" }}>
                    <Clock size={10} style={{ color:`${evt.color}90` }}/>{evt.location}
                  </p>
                  <p className="text-xs leading-relaxed mb-4" style={{ color:"rgba(245,245,245,0.4)" }}>{evt.desc}</p>
                  <a href={waUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold transition-opacity"
                    style={{ color:evt.color, fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"13px" }}
                    onMouseEnter={e=>e.currentTarget.style.opacity="0.7"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}
                  >Mas info / Inscripcion <ArrowRight size={12}/></a>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </section>
  )
}

// ── Preview Merch ─────────────────────────────────────────────────────────
export const MerchPreview = () => {
  const featured = content.merch.filter(p => p.featured).slice(0, 3)
  return (
    <section className="py-24 md:py-28" style={{ background:"#111111" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="flex items-end justify-between mb-12">
          <SectionHeader eyebrow="Tienda Oficial" title="BFS Merch" align="left" className="mb-0"/>
          <Link to="/merch" className="hidden md:inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold transition-colors duration-200"
            style={{ color:"rgba(245,245,245,0.4)", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"13px" }}
            onMouseEnter={e=>e.currentTarget.style.color="#c0392b"} onMouseLeave={e=>e.currentTarget.style.color="rgba(245,245,245,0.4)"}
          >Ver todo <ArrowRight size={12}/></Link>
        </div>
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-5"
          initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger}
        >
          {featured.map(product => {
            const waUrl = `https://wa.me/${content.business.whatsapp}?text=${encodeURIComponent(`Hola, me interesa: ${product.name}. Me pueden dar mas informacion?`)}`
            return (
              <motion.div key={product.id} variants={scaleIn}
                className="overflow-hidden"
                style={{ background:"#0a0a0a", border:"1px solid rgba(245,245,245,0.06)" }}
                whileHover={{ borderColor:"rgba(192,57,43,0.3)" }}
              >
                <div className="relative h-52 overflow-hidden">
                  <motion.img src={product.image} alt={product.name}
                    className="w-full h-full object-cover"
                    style={{ filter:"grayscale(40%)" }}
                    whileHover={{ scale:1.05, filter:"grayscale(0%)" }}
                    transition={{ duration:0.4 }}
                  />
                  {product.badge && (
                    <div className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold tracking-wider"
                      style={{ background:"#c0392b", color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}
                    >{product.badge}</div>
                  )}
                  <div className="absolute top-3 right-3 px-2 py-0.5 text-[10px] tracking-wider"
                    style={{ background:"rgba(10,10,10,0.75)", color:"rgba(245,245,245,0.5)" }}
                  >{product.category}</div>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-xl mb-1" style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{product.name}</h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color:"#888888" }}>{product.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl" style={{ color:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{product.price}</span>
                    <motion.a href={waUrl} target="_blank" rel="noopener noreferrer"
                      className="px-4 py-2 text-xs font-bold"
                      style={{ background:"#c0392b", color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"13px" }}
                      whileHover={{ opacity:0.85 }} whileTap={{ scale:0.97 }}
                    >Consultar</motion.a>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

// ── CTA de inscripcion ────────────────────────────────────────────────────
export const EnrollCTA = () => {
  const waUrl = `https://wa.me/${content.business.whatsapp}?text=${encodeURIComponent(content.enroll.whatsappMessage)}`
  return (
    <section className="py-20 section-red relative overflow-hidden tatami-pattern">
      <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-10 text-center">
        <motion.div initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }} viewport={viewportOnce} transition={{ duration:0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6" style={{ background:"rgba(10,10,10,0.35)", border:"1px solid rgba(10,10,10,0.3)" }}>
            <CheckCircle size={13} style={{ color:"#f5f5f5" }}/>
            <span className="text-xs font-bold text-white">{content.enroll.badge}</span>
          </div>
          <h2 className="font-display leading-none mb-3" style={{ fontSize:"clamp(3rem,8vw,7rem)", color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>
            {content.enroll.headline}
          </h2>
          <div className="w-14 h-0.5 mx-auto mb-5" style={{ background:"rgba(245,245,245,0.3)" }}/>
          <p className="text-base mb-8 leading-relaxed" style={{ color:"rgba(245,245,245,0.7)" }}>{content.enroll.subheadline}</p>
          <motion.a href={waUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-9 py-4 text-base font-bold"
            style={{ background:"#0a0a0a", color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"16px" }}
            whileHover={{ scale:1.03, background:"#1c1c1c" }} whileTap={{ scale:0.97 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            {content.enroll.cta}
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
