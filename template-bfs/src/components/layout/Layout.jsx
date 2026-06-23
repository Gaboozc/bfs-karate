// Layout — BFS Martial Arts
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Phone, MapPin, Mail, Clock, Instagram, Facebook, Youtube } from "lucide-react"
import { content } from "../../data/content"

// Logo — carga /logo.png desde public/; fallback al SVG de karateka si no existe
export const BFSLogo = ({ className="", size="md", light=false }) => {
  const s = { sm:{h:36}, md:{h:44}, lg:{h:56} }[size] || {h:44}
  const [imgErr, setImgErr] = useState(false)
  return (
    <motion.div className={`inline-flex items-center gap-2.5 cursor-default select-none ${className}`}
      whileHover={{ opacity:0.9 }} transition={{ duration:0.2 }}
    >
      {imgErr ? (
        <>
          <svg width={s.h} height={s.h} viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="36" stroke="#c0392b" strokeWidth="3.5" fill="none" strokeDasharray="4 2" opacity="0.85"/>
            <circle cx="40" cy="40" r="36" stroke="#1a1a1a" strokeWidth="2" fill={light?"transparent":"#0a0a0a"} strokeDasharray="200 30" strokeLinecap="round" opacity="0.6"/>
            <line x1="40" y1="14" x2="40" y2="52" stroke={light?"#ffffff":"#1c1c1c"} strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
            <circle cx="40" cy="12" r="4" fill={light?"rgba(255,255,255,0.8)":"rgba(28,28,28,0.9)"}/>
            <line x1="40" y1="28" x2="54" y2="18" stroke={light?"#ffffff":"#1c1c1c"} strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
            <line x1="54" y1="18" x2="62" y2="14" stroke={light?"#ffffff":"#1c1c1c"} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
            <line x1="40" y1="26" x2="30" y2="20" stroke={light?"#ffffff":"#1c1c1c"} strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
            <text x="18" y="44" fontFamily="'Bebas Neue', Impact, sans-serif" fontSize="22" fill="#c0392b" fontWeight="bold" letterSpacing="2" opacity="0.95">BFS</text>
            <line x1="14" y1="54" x2="66" y2="54" stroke="#c0392b" strokeWidth="1" opacity="0.3"/>
          </svg>
          <div className="flex flex-col leading-none gap-0.5">
            <span className="font-display tracking-[0.12em]"
              style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize: s.h < 40 ? "16px":"20px" }}
            >{content.business.name}</span>
            <span className="text-[9px] tracking-[0.2em] uppercase font-semibold" style={{ color:"#c0392b" }}>
              {content.business.tagline}
            </span>
          </div>
        </>
      ) : (
        <img
          src="/logo.png"
          alt={content.business.name}
          onError={() => setImgErr(true)}
          style={{ height:s.h, width:"auto", objectFit:"contain" }}
        />
      )}
    </motion.div>
  )
}

// Encabezado de seccion
export const SectionHeader = ({ eyebrow, title, subtitle, align="center", light=true, className="" }) => {
  const tc   = light ? "#f5f5f5" : "#0a0a0a"
  const tsub = light ? "#888888" : "#555555"
  return (
    <motion.div className={`mb-12 ${align==="center"?"text-center":""} ${className}`}
      initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-60px" }}
      variants={{ hidden:{opacity:0,y:28}, visible:{opacity:1,y:0,transition:{duration:0.55}} }}
    >
      {eyebrow && (
        <div className={`flex items-center gap-3 mb-3 ${align==="center"?"justify-center":""}`}>
          <div className="w-8 h-0.5" style={{ background:"#c0392b" }}/>
          <span className="text-[11px] tracking-[0.25em] uppercase font-semibold" style={{ color:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>{eyebrow}</span>
        </div>
      )}
      <h2 className="font-display leading-none mb-3"
        style={{ fontSize:"clamp(2.5rem,6vw,5rem)", color:tc, fontFamily:"'Bebas Neue',Impact,sans-serif", letterSpacing:"0.04em" }}
      >{title}</h2>
      <div className={`blood-line mb-5 ${align==="center"?"mx-auto":""}`}/>
      {subtitle && <p className={`text-base leading-relaxed max-w-2xl ${align==="center"?"mx-auto":""}`} style={{ color:tsub }}>{subtitle}</p>}
    </motion.div>
  )
}

// Navbar
export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const location                = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])
  useEffect(() => { setOpen(false) }, [location.pathname])

  return (
    <>
      <motion.nav initial={{ y:-64,opacity:0 }} animate={{ y:0,opacity:1 }} transition={{ duration:0.5 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{ background:scrolled?"rgba(10,10,10,0.97)":"transparent",
          backdropFilter:scrolled?"blur(12px)":"none",
          borderBottom:scrolled?"1px solid rgba(192,57,43,0.2)":"none" }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between h-16 md:h-18">
          <Link to="/"><BFSLogo size="sm"/></Link>

          <div className="hidden md:flex items-center gap-8">
            {content.nav.links.map(l => (
              <Link key={l.href} to={l.href}
                className="text-xs tracking-[0.15em] uppercase font-semibold transition-colors duration-200 relative"
                style={{ color:location.pathname===l.href?"#c0392b":"rgba(245,245,245,0.55)", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"14px" }}
              >
                {l.label}
                {location.pathname===l.href && <motion.span layoutId="activeBFS" className="absolute -bottom-1 left-0 right-0 h-0.5" style={{ background:"#c0392b" }}/>}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/contacto"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold transition-all duration-200"
              style={{ background:"#c0392b", color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"13px" }}
              onMouseEnter={e=>e.currentTarget.style.background="#a93226"}
              onMouseLeave={e=>e.currentTarget.style.background="#c0392b"}
            >{content.nav.ctaText}</Link>
            <button className="md:hidden" onClick={()=>setOpen(!open)} style={{ color:"#f5f5f5" }}>
              {open?<X size={22}/>:<Menu size={22}/>}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-40 flex flex-col justify-center items-start px-10"
            style={{ background:"#0a0a0a" }}
          >
            {content.nav.links.map((l,i)=>(
              <motion.div key={l.href} initial={{ opacity:0,x:-30 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.07 }}>
                <Link to={l.href} className="block font-display text-5xl mb-4 tracking-wider"
                  style={{ color:location.pathname===l.href?"#c0392b":"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}
                >{l.label}</Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.35 }} className="mt-6">
              <Link to="/contacto" className="inline-flex px-8 py-3 text-sm font-bold" style={{ background:"#c0392b", color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>
                {content.nav.ctaText}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Footer
export const Footer = () => (
  <footer style={{ background:"#050505", borderTop:"2px solid #c0392b" }}>
    {/* Barra de cinturones */}
    <div className="belt-bar"/>
    <div className="max-w-7xl mx-auto px-5 md:px-10 py-14">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
        <div>
          <BFSLogo size="sm" className="mb-4"/>
          <p className="text-sm leading-relaxed mb-4" style={{ color:"rgba(245,245,245,0.35)", fontFamily:"'Barlow Condensed',sans-serif" }}>
            {content.business.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {content.business.certifications.slice(0,2).map((c,i)=>(
              <span key={i} className="text-[9px] px-2 py-1 rounded font-semibold" style={{ background:"rgba(192,57,43,0.15)", color:"#c0392b" }}>{c}</span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm tracking-widest mb-5" style={{ color:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>Programas</h4>
          <ul className="space-y-2.5">
            {content.nav.links.map(l=>(
              <li key={l.href}><Link to={l.href} className="text-sm transition-colors duration-200" style={{ color:"rgba(245,245,245,0.35)" }}
                onMouseEnter={e=>e.target.style.color="#c0392b"} onMouseLeave={e=>e.target.style.color="rgba(245,245,245,0.35)"}
              >{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm tracking-widest mb-5" style={{ color:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>Horarios</h4>
          <ul className="space-y-2.5">
            {Object.values(content.business.hours).map((h,i)=>(
              <li key={i} className="flex items-start gap-2"><Clock size={12} className="mt-0.5 shrink-0" style={{ color:"#c0392b" }}/><span className="text-sm" style={{ color:"rgba(245,245,245,0.35)" }}>{h}</span></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm tracking-widest mb-5" style={{ color:"#c0392b", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>Contacto</h4>
          <ul className="space-y-3">
            {[{Icon:MapPin,val:`${content.business.address}, ${content.business.city}`},{Icon:Phone,val:content.business.phone},{Icon:Mail,val:content.business.email}].map(({Icon,val},i)=>(
              <li key={i} className="flex items-start gap-2"><Icon size={13} className="mt-0.5 shrink-0" style={{ color:"#c0392b" }}/><span className="text-sm" style={{ color:"rgba(245,245,245,0.35)" }}>{val}</span></li>
            ))}
          </ul>
          <div className="flex gap-3 mt-5">
            {[{href:content.business.social.instagram,label:"IG"},{href:content.business.social.facebook,label:"FB"},{href:content.business.social.youtube,label:"YT"}].filter(s=>s.href).map(({href,label})=>(
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center text-xs font-bold transition-all duration-200 font-display"
                style={{ border:"1px solid rgba(192,57,43,0.3)", color:"rgba(245,245,245,0.3)", fontFamily:"'Bebas Neue',Impact,sans-serif" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#c0392b";e.currentTarget.style.color="#c0392b"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(192,57,43,0.3)";e.currentTarget.style.color="rgba(245,245,245,0.3)"}}
              >{label}</a>
            ))}
          </div>
        </div>
      </div>
      <div className="h-px mb-5" style={{ background:"rgba(245,245,245,0.05)" }}/>
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <p className="text-xs" style={{ color:"rgba(245,245,245,0.15)" }}>{content.footer.copyright}</p>
        <a href={content.footer.creditUrl} target="_blank" rel="noopener noreferrer"
          className="text-xs transition-colors" style={{ color:"rgba(245,245,245,0.15)" }}
          onMouseEnter={e=>e.target.style.color="#c0392b"} onMouseLeave={e=>e.target.style.color="rgba(245,245,245,0.15)"}
        >{content.footer.credit}</a>
      </div>
    </div>
  </footer>
)

// WhatsApp flotante
export const WhatsAppButton = () => {
  const waUrl = `https://wa.me/${content.business.whatsapp}?text=${encodeURIComponent(content.enroll.whatsappMessage)}`
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div className="absolute inset-0 rounded-full" style={{ background:"rgba(37,211,102,0.25)" }}
        animate={{ scale:[1,1.6,1.6], opacity:[0.5,0,0] }} transition={{ duration:2.2,repeat:Infinity,ease:"easeOut" }}
      />
      <motion.a href={waUrl} target="_blank" rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-xl"
        style={{ background:"#25D366" }}
        whileHover={{ scale:1.1 }} whileTap={{ scale:0.95 }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      </motion.a>
    </div>
  )
}
