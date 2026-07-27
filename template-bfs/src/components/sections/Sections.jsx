// Secciones publicas — BFS Martial Arts
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight, Trophy, Star, Shield, Zap, UserCheck, Users, CheckCircle, Clock, Award } from "lucide-react"
import { SectionHeader } from "../layout/Layout"
import { content } from "../../data/content"
import { heroTitle, heroSub, heroCTA, fadeIn, fadeInUp, fadeInLeft, fadeInRight, scaleIn, stagger, staggerSlow, viewportOnce } from "../../styles/animations"

const progIcons = { trophy:Trophy, star:Star, shield:Shield, zap:Zap, "user-shield":Shield, "user-check":UserCheck }
const beltColors = {
  "Blanco":"#f5f5f5", "Blanco raya Morada":"#f5f5f5",
  "Morada":"#8b3fa8", "Morada raya Amarilla":"#8b3fa8",
  "Amarilla":"#f5c518", "Naranja":"#e07b39",
  "Azul":"#2e75b6", "Azul raya Marron":"#2e75b6",
  "Marron":"#6b4c36", "Negro":"#0a0a0a",
}
const BELTS = [
  { name:"Blanco",              primary:"#f5f5f5", stripe:null        },
  { name:"Blanco raya Morada",  primary:"#f5f5f5", stripe:"#8b3fa8"  },
  { name:"Morada",              primary:"#8b3fa8", stripe:null        },
  { name:"Morada raya Amarilla",primary:"#8b3fa8", stripe:"#f5c518"  },
  { name:"Amarilla",            primary:"#f5c518", stripe:null        },
  { name:"Naranja",             primary:"#e07b39", stripe:null        },
  { name:"Azul",                primary:"#2e75b6", stripe:null        },
  { name:"Azul raya Marron",    primary:"#2e75b6", stripe:"#6b4c36"  },
  { name:"Marron",              primary:"#6b4c36", stripe:null        },
  { name:"Negro",               primary:"#0a0a0a", stripe:null        },
]
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
            <Link to="/sponsors"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold transition-all duration-200"
              style={{ background:"#f5c518", color:"#0a0a0a", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"16px" }}
              onMouseEnter={e=>e.currentTarget.style.background="#d4a916"}
              onMouseLeave={e=>e.currentTarget.style.background="#f5c518"}
            ><Award size={16}/> {content.hero.cta.sponsor}</Link>
          </motion.div>

          {/* Google Reviews */}
          <motion.div variants={heroCTA} className="pt-8" style={{ borderTop:"1px solid rgba(245,245,245,0.07)" }}>
            {/* Cabecera */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                {/* Google G */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-xs font-semibold" style={{ color:"rgba(245,245,245,0.5)" }}>Google Reviews</span>
              </div>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => <span key={s} style={{ color:"#f5c518", fontSize:"13px" }}>★</span>)}
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background:"rgba(245,193,24,0.1)", color:"#f5c518", border:"1px solid rgba(245,193,24,0.2)" }}>
                Solo 5 estrellas
              </span>
              {content.business.googleMapsUrl && !content.business.googleMapsUrl.includes("{{") && (
                <a href={content.business.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                  className="ml-auto text-[10px] tracking-widest uppercase transition-colors"
                  style={{ color:"rgba(245,245,245,0.25)", fontFamily:"'Bebas Neue',Impact,sans-serif" }}
                  onMouseEnter={e=>e.currentTarget.style.color="#c0392b"}
                  onMouseLeave={e=>e.currentTarget.style.color="rgba(245,245,245,0.25)"}
                >Ver todas →</a>
              )}
            </div>

            {/* Cards con scroll horizontal */}
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth:"none" }}>
              {content.reviews
                .filter(r => r.rating === 5)
                .sort((a, b) => new Date(b.date.replace(/\{\{|\}\}/g,"")) - new Date(a.date.replace(/\{\{|\}\}/g,"")))
                .map(review => {
                  const cleanName = review.name.replace(/\{\{|\}\}/g,"").trim()
                  const cleanText = review.text.replace(/\{\{|\}\}/g,"").trim()
                  const cleanDate = review.date.replace(/\{\{|\}\}/g,"").trim()
                  const initial   = cleanName[0] || "?"
                  const dateLabel = (() => {
                    const d = new Date(cleanDate)
                    return isNaN(d) ? cleanDate : d.toLocaleDateString("es-MX",{ month:"short", year:"numeric" })
                  })()
                  return (
                    <div key={review.id} className="shrink-0 w-60 p-4"
                      style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(245,245,245,0.08)" }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ background:"#c0392b", color:"#fff", fontFamily:"'Bebas Neue',Impact,sans-serif" }}
                        >{initial}</div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate" style={{ color:"#f5f5f5" }}>{cleanName}</div>
                          <div className="text-[10px]" style={{ color:"rgba(245,245,245,0.3)" }}>{dateLabel}</div>
                        </div>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {[1,2,3,4,5].map(s => <span key={s} style={{ color:"#f5c518", fontSize:"11px" }}>★</span>)}
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color:"rgba(245,245,245,0.5)" }}>
                        {cleanText.length > 110 ? cleanText.slice(0,110) + "…" : cleanText}
                      </p>
                    </div>
                  )
                })
              }
            </div>
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
      <motion.div className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
        initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger}
      >
        {BELTS.map((belt, i) => (
          <motion.div key={belt.name} variants={scaleIn} className="flex flex-col items-center gap-2">
            {/* Barra de cinta — con raya central si aplica */}
            <div className="relative w-10 h-2.5 rounded-sm overflow-hidden"
              style={{ background:belt.primary, boxShadow:`0 0 8px ${belt.primary}50` }}
            >
              {belt.stripe && (
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1.5"
                  style={{ background:belt.stripe }}
                />
              )}
            </div>
            <span className="text-[9px] tracking-wider uppercase text-center max-w-[52px] leading-tight"
              style={{ color:"rgba(245,245,245,0.4)" }}
            >{belt.name}</span>
          </motion.div>
        ))}
        <motion.div variants={scaleIn} className="text-xs tracking-widest uppercase ml-2" style={{ color:"rgba(245,245,245,0.2)" }}>
          → Tu trayectoria
        </motion.div>
      </motion.div>
    </div>
  </section>
)

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

// ── CTA de inscripcion ────────────────────────────────────────────────────
// `variant` toma el mensaje contextual de content.enroll.variants (programas,
// instructor, horarios, eventos). Sin variant usa el texto base.
export const EnrollCTA = ({ variant }) => {
  const base = content.enroll
  const v    = (variant && base.variants?.[variant]) || {}
  const copy = {
    headline:        v.headline        ?? base.headline,
    subheadline:     v.subheadline     ?? base.subheadline,
    badge:           v.badge           ?? base.badge,
    cta:             v.cta             ?? base.cta,
    whatsappMessage: v.whatsappMessage ?? base.whatsappMessage,
  }
  const waUrl = `https://wa.me/${content.business.whatsapp}?text=${encodeURIComponent(copy.whatsappMessage)}`
  return (
    <section className="py-20 section-red relative overflow-hidden tatami-pattern">
      <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-10 text-center">
        <motion.div initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }} viewport={viewportOnce} transition={{ duration:0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6" style={{ background:"rgba(10,10,10,0.35)", border:"1px solid rgba(10,10,10,0.3)" }}>
            <CheckCircle size={13} style={{ color:"#f5f5f5" }}/>
            <span className="text-xs font-bold text-white">{copy.badge}</span>
          </div>
          <h2 className="font-display leading-none mb-3" style={{ fontSize:"clamp(3rem,8vw,7rem)", color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>
            {copy.headline}
          </h2>
          <div className="w-14 h-0.5 mx-auto mb-5" style={{ background:"rgba(245,245,245,0.3)" }}/>
          <p className="text-base mb-8 leading-relaxed" style={{ color:"rgba(245,245,245,0.7)" }}>{copy.subheadline}</p>
          <motion.a href={waUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-9 py-4 text-base font-bold"
            style={{ background:"#0a0a0a", color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"16px" }}
            whileHover={{ scale:1.03, background:"#1c1c1c" }} whileTap={{ scale:0.97 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            {copy.cta}
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

// ── Metodologia BFS — bloque exclusivo del inicio ─────────────────────────
export const MetodologiaBFS = () => {
  const { eyebrow, title, intro, pilares } = content.metodologia
  return (
    <section className="py-24 md:py-28" style={{ background:"#0a0a0a" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <SectionHeader eyebrow={eyebrow} title={title} align="left" className="mb-6"/>
        <p className="text-base leading-relaxed max-w-2xl mb-14" style={{ color:"#888888" }}>{intro}</p>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-5"
          initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger}
        >
          {pilares.map(p => (
            <motion.div key={p.letter} variants={fadeInUp}
              className="p-8 relative overflow-hidden"
              style={{ background:"#111111", border:"1px solid rgba(245,245,245,0.06)", borderTop:`3px solid ${p.color}` }}
            >
              {/* Letra gigante de fondo */}
              <div className="absolute -bottom-6 right-2 font-display leading-none select-none pointer-events-none"
                style={{ fontSize:"9rem", color:p.color, opacity:0.07, fontFamily:"'Bebas Neue',Impact,sans-serif" }}
              >{p.letter}</div>

              <div className="relative z-10">
                <div className="font-display text-sm tracking-[0.25em] mb-4"
                  style={{ color:p.color, fontFamily:"'Bebas Neue',Impact,sans-serif" }}
                >{p.word}</div>
                <h3 className="font-display text-3xl mb-3" style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{p.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color:"#888888" }}>{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── Patrocinios ───────────────────────────────────────────────────────────
// `hideHeader` se usa en la pagina /sponsors, donde el PageBanner ya trae el titulo.
export const SponsorSection = ({ hideHeader = false }) => {
  const s = content.sponsor
  const waUrl = `https://wa.me/${content.business.whatsapp}?text=${encodeURIComponent(s.whatsappMessage)}`
  return (
    <section className="py-16 md:py-20 section-steel">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-14">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeInLeft}>
            {!hideHeader && <SectionHeader eyebrow={s.eyebrow} title={s.title} align="left" className="mb-4"/>}
            <p className="text-sm font-semibold tracking-wider uppercase mb-4" style={{ color:"#f5c518" }}>{s.subtitle}</p>
            <p className="text-base leading-relaxed mb-8" style={{ color:"#888888" }}>{s.desc}</p>
            <motion.a href={waUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold"
              style={{ background:"#f5c518", color:"#0a0a0a", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"16px" }}
              whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            ><Award size={17}/> {s.cta}</motion.a>
          </motion.div>

          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger}
          >
            {s.beneficios.map(b => (
              <motion.div key={b.title} variants={scaleIn} className="p-5"
                style={{ background:"#0a0a0a", border:"1px solid rgba(245,193,24,0.15)" }}
              >
                <Award size={16} style={{ color:"#f5c518" }} className="mb-3"/>
                <h4 className="font-display text-lg mb-1.5" style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{b.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color:"#888888" }}>{b.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Paquetes — sin precio publicado. Cada tier abre WhatsApp con su
            propio mensaje para que se pueda identificar el interes. */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-5"
          initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger}
        >
          {s.paquetes.map(p => {
            const pkgWaUrl = `https://wa.me/${content.business.whatsapp}?text=${encodeURIComponent(p.whatsappMessage)}`
            return (
              <motion.div key={p.name} variants={fadeInUp} className="p-7 flex flex-col"
                style={{ background:"#0a0a0a", border:`1px solid ${p.color}30`, borderTop:`3px solid ${p.color}` }}
              >
                <h3 className="font-display text-3xl leading-none mb-1" style={{ color:p.color, fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{p.name}</h3>
                <p className="text-[11px] font-bold tracking-widest uppercase mb-5" style={{ color:"rgba(245,245,245,0.35)" }}>{p.tagline}</p>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {p.items.map((it,i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color:"rgba(245,245,245,0.55)" }}>
                      <CheckCircle size={13} style={{ color:p.color }} className="mt-0.5 shrink-0"/>{it}
                    </li>
                  ))}
                </ul>
                <a href={pkgWaUrl} target="_blank" rel="noopener noreferrer"
                  className="text-center py-3 text-sm font-bold transition-opacity"
                  style={{ border:`1px solid ${p.color}`, color:p.color, fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"15px" }}
                  onMouseEnter={e=>e.currentTarget.style.opacity="0.75"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}
                >Solicitar informacion</a>
              </motion.div>
            )
          })}
        </motion.div>

        <p className="text-xs mt-6 text-center" style={{ color:"rgba(245,245,245,0.3)" }}>{s.priceNote}</p>
      </div>
    </section>
  )
}
