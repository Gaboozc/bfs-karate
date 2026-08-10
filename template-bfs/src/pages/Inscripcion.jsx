// Inscripcion en linea — BFS Martial Arts
//
// Formulario publico que reemplaza la hoja de papel. La persona lo llena
// desde su celular, acepta el contrato y la solicitud llega a la bandeja del
// panel. El Sensei la revisa y la aprueba.
//
// Se guarda una copia literal del contrato aceptado, no una referencia: si el
// texto cambia despues, lo que esta persona acepto sigue siendo consultable.

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import { content } from "../data/content"
import { programaPorSlug, documentosDePrograma, enviarSolicitud } from "../data/contenidoPublico"
import FirmaDigital from "../components/FirmaDigital"

const vacio = () => ({
  nombre: "", fecha_nacimiento: "",
  tutor_nombre: "", tutor2_nombre: "", tutor_telefono: "", telefono2: "",
  lesiones_previas: "", deporte_previo: "", alergias: "", condiciones: "",
  contrato_firmante: "", firma: "",
  acepto_contrato: false, acepto_manifiesto: false, acepto_reglamento: false,
  acepto_imagen: false, acepto_salud: false,
})

// Documento con su propia barra de desplazamiento.
//
// El texto va completo, pero dentro de un recuadro contenido: el reglamento
// son 30 articulos y desplegado empujaba el boton de enviar tan abajo que la
// pagina parecia interminable. Sigue estando todo, solo que sin sepultar al
// resto del formulario.
//
// tabIndex={0} NO es decorativo: un recuadro con desplazamiento propio que no
// puede recibir foco es imposible de leer sin mouse. Con el, se recorre con
// las flechas. Por eso lleva tambien role y aria-label, que lo anuncian como
// una region navegable.
const Documento = ({ titulo, texto, color, indice }) => {
  const [alFinal, setAlFinal] = useState(false)

  // El degradado inferior avisa que hay mas texto; al llegar abajo estorba
  const alDesplazar = e => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    setAlFinal(scrollTop + clientHeight >= scrollHeight - 8)
  }

  return (
    <section aria-label={titulo}>
      <div className="flex items-baseline gap-3 mb-2">
        <span className="font-display text-sm shrink-0"
          style={{ color, fontFamily:"'Bebas Neue',Impact,sans-serif" }}
        >{indice}</span>
        <h2 className="text-sm font-semibold" style={{ color:"#f5f5f5" }}>{titulo}</h2>
      </div>

      <div className="relative">
        <div
          onScroll={alDesplazar}
          tabIndex={0}
          role="region"
          aria-label={`Texto de ${titulo}. Desplazate para leerlo completo`}
          className="px-4 py-3.5 text-[13px] leading-relaxed overflow-y-auto documento-scroll"
          style={{
            background:"#111111", border:"1px solid rgba(245,245,245,0.1)",
            color:"rgba(245,245,245,0.68)", whiteSpace:"pre-line",
            maxHeight:"200px",
          }}
        >{texto}</div>

        {/* Se apaga al llegar abajo, para no simular texto que ya no hay */}
        <div aria-hidden="true"
          className="absolute left-px right-px bottom-px pointer-events-none transition-opacity duration-200"
          style={{
            height:"48px", opacity: alFinal ? 0 : 1,
            background:"linear-gradient(to bottom, rgba(17,17,17,0) 0%, #111111 90%)",
          }}
        />
      </div>
    </section>
  )
}

const Inscripcion = () => {
  const { slug } = useParams()
  const [programa, setPrograma] = useState(null)
  const [docs, setDocs]         = useState({})
  const [cargando, setCargando] = useState(true)
  const [campos, setCampos]     = useState(vacio())
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado]   = useState(false)
  const [error, setError]       = useState("")

  useEffect(() => {
    let vigente = true
    // En dos pasos: hay que saber que programa es para pedir el reglamento
    // que le toca, porque el de karate y el de acondicionamiento difieren
    programaPorSlug(slug)
      .then(async p => {
        const d = p ? await documentosDePrograma(p.id) : {}
        if (!vigente) return
        setPrograma(p); setDocs(d); setCargando(false)
      })
    return () => { vigente = false }
  }, [slug])

  const cambiar = (llave, valor) => setCampos(c => ({ ...c, [llave]: valor }))

  const edad = (() => {
    if (!campos.fecha_nacimiento) return null
    const n = new Date(campos.fecha_nacimiento), h = new Date()
    let e = h.getFullYear() - n.getFullYear()
    const m = h.getMonth() - n.getMonth()
    if (m < 0 || (m === 0 && h.getDate() < n.getDate())) e--
    return e
  })()
  const esMenor = edad != null && edad < 18

  // Las aceptaciones obligatorias se declaran UNA vez y de aqui salen tanto
  // las casillas como la validacion y el contador. Con dos listas separadas,
  // agregar un documento manana dejaria el boton exigiendo algo que la
  // pantalla no pide, o al reves.
  //
  // Cada una entra solo si su documento existe: si no, se pediria aceptar
  // algo que no esta en pantalla y el boton quedaria muerto sin explicacion.
  const obligatorias = [
    programa?.contrato && {
      llave: "acepto_contrato",
      texto: `He leido y acepto el contrato de ${programa.nombre}`,
    },
    docs.manifiesto && {
      llave: "acepto_manifiesto",
      texto: "He leido y acepto el manifiesto",
    },
    docs.reglamento && {
      llave: "acepto_reglamento",
      texto: "Estoy de acuerdo con el reglamento de la academia",
    },
  ].filter(Boolean)

  const totalObligatorias = obligatorias.length
  const faltantes = obligatorias.filter(o => !campos[o.llave]).length
  const totalDocs = 1 + (docs.manifiesto ? 1 : 0) + (docs.reglamento ? 1 : 0)

  // Imagen y salud siguen siendo opcionales: no bloquean el registro
  const listo =
    campos.nombre.trim() &&
    campos.tutor_telefono.trim() &&
    campos.contrato_firmante.trim() &&
    campos.firma &&
    faltantes === 0

  const enviar = async e => {
    e.preventDefault()
    setEnviando(true); setError("")
    const { error } = await enviarSolicitud({
      ...campos,
      programa_id: programa?.id ?? null,
      // Copia literal de los tres textos aceptados, no una referencia: si
      // manana se edita un articulo, esto sigue diciendo lo que decia hoy
      contrato_texto:   programa?.contrato ?? null,
      manifiesto_texto: docs.manifiesto?.texto ?? null,
      reglamento_texto: docs.reglamento?.texto ?? null,
      fecha_nacimiento: campos.fecha_nacimiento || null,
    })
    setEnviando(false)
    if (error) { setError("No se pudo enviar. Revisa tu conexion e intenta de nuevo."); return }
    setEnviado(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const input  = "w-full px-4 py-3 text-base"
  const estilo = { background:"#111111", border:"1px solid rgba(245,245,245,0.12)", color:"#f5f5f5" }
  const etiq   = "block text-xs font-semibold mb-2 uppercase tracking-wider"

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background:"#0a0a0a" }}>
        <div className="w-10 h-10 rounded-full animate-spin"
          style={{ border:"3px solid rgba(192,57,43,0.2)", borderTopColor:"#c0392b" }}
          role="status" aria-label="Cargando"
        />
      </div>
    )
  }

  if (!programa) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center" style={{ background:"#0a0a0a" }}>
        <AlertCircle size={36} style={{ color:"#c0392b" }} className="mb-4"/>
        <h1 className="font-display text-3xl mb-2" style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>
          Enlace no disponible
        </h1>
        <p className="text-sm mb-6 max-w-sm" style={{ color:"#888888" }}>
          Este formulario de inscripcion no existe o fue dado de baja.
          Escribenos por WhatsApp y te ayudamos.
        </p>
        <a href={`https://wa.me/${content.business.whatsapp}`} target="_blank" rel="noopener noreferrer"
          className="px-6 py-3 text-sm font-bold"
          style={{ background:"#c0392b", color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"15px" }}
        >Escribir por WhatsApp</a>
      </div>
    )
  }

  if (enviado) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center" style={{ background:"#0a0a0a" }}>
        <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }}>
          <CheckCircle size={44} style={{ color:"#4ade80" }} className="mb-5 mx-auto"/>
          <h1 className="font-display text-4xl mb-3" style={{ color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}>
            Registro enviado
          </h1>
          <p className="text-base mb-2 max-w-md" style={{ color:"rgba(245,245,245,0.7)" }}>
            Gracias, {campos.nombre.split(" ")[0]}. Ya tenemos tus datos.
          </p>
          <p className="text-sm mb-8 max-w-md" style={{ color:"#888888" }}>
            El Sensei va a revisar tu registro y te contactamos por WhatsApp
            para confirmarte tu primera clase.
          </p>
          <Link to="/" className="text-xs tracking-widest uppercase"
            style={{ color:"rgba(245,245,245,0.4)", fontFamily:"'Bebas Neue',Impact,sans-serif" }}
          >Volver al sitio</Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-5" style={{ background:"#0a0a0a" }}>
      <div className="max-w-xl mx-auto">

        <Link to="/" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase mb-8"
          style={{ color:"rgba(245,245,245,0.35)", fontFamily:"'Bebas Neue',Impact,sans-serif" }}
        ><ArrowLeft size={13}/> Volver</Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-0.5 w-8" style={{ background:programa.color }}/>
            <span className="text-[11px] tracking-[0.28em] uppercase font-semibold"
              style={{ color:programa.color, fontFamily:"'Bebas Neue',Impact,sans-serif" }}
            >Inscripcion</span>
          </div>
          <h1 className="font-display leading-none mb-3"
            style={{ fontSize:"clamp(2.5rem,9vw,4rem)", color:"#f5f5f5", fontFamily:"'Bebas Neue',Impact,sans-serif" }}
          >{programa.nombre}</h1>
          <p className="text-sm" style={{ color:"#888888" }}>
            Llena tus datos y acepta el acuerdo. Nosotros te contactamos para confirmar tu primera clase.
          </p>
        </div>

        <form onSubmit={enviar} className="space-y-5">

          <p className="text-xs font-bold uppercase tracking-widest pt-2" style={{ color:programa.color }}>
            Datos del alumno
          </p>

          <div>
            <label htmlFor="in-nombre" className={etiq} style={{ color:"rgba(245,245,245,0.5)" }}>
              Nombre completo del alumno
            </label>
            <input id="in-nombre" className={input} style={estilo} autoFocus required
              value={campos.nombre} onChange={e => cambiar("nombre", e.target.value)}
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="in-nac" className={etiq} style={{ color:"rgba(245,245,245,0.5)" }}>
              Fecha de nacimiento {edad != null && <span style={{ textTransform:"none", color:"#888888" }}>· {edad} anos</span>}
            </label>
            <input id="in-nac" type="date" className={input} style={estilo}
              value={campos.fecha_nacimiento} onChange={e => cambiar("fecha_nacimiento", e.target.value)}
            />
          </div>

          <p className="text-xs font-bold uppercase tracking-widest pt-3" style={{ color:programa.color }}>
            {esMenor ? "Padre, madre o tutor" : "Contacto"}
          </p>

          <div>
            <label htmlFor="in-tutor" className={etiq} style={{ color:"rgba(245,245,245,0.5)" }}>
              {esMenor ? "Nombre del padre, madre o tutor" : "Nombre completo"}
            </label>
            <input id="in-tutor" className={input} style={estilo}
              value={campos.tutor_nombre} onChange={e => cambiar("tutor_nombre", e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="in-tutor2" className={etiq} style={{ color:"rgba(245,245,245,0.5)" }}>
              Segundo tutor <span style={{ textTransform:"none", fontWeight:400, color:"#888888" }}>· opcional</span>
            </label>
            <input id="in-tutor2" className={input} style={estilo}
              value={campos.tutor2_nombre} onChange={e => cambiar("tutor2_nombre", e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="in-tel" className={etiq} style={{ color:"rgba(245,245,245,0.5)" }}>
              Celular de contacto
            </label>
            <input id="in-tel" type="tel" inputMode="tel" className={input} style={estilo} required
              value={campos.tutor_telefono} onChange={e => cambiar("tutor_telefono", e.target.value)}
              placeholder="55 1234 5678" autoComplete="tel"
            />
          </div>

          <div>
            <label htmlFor="in-tel2" className={etiq} style={{ color:"rgba(245,245,245,0.5)" }}>
              Segundo numero <span style={{ textTransform:"none", fontWeight:400, color:"#888888" }}>· opcional</span>
            </label>
            <input id="in-tel2" type="tel" inputMode="tel" className={input} style={estilo}
              value={campos.telefono2} onChange={e => cambiar("telefono2", e.target.value)}
            />
          </div>

          <p className="text-xs font-bold uppercase tracking-widest pt-3" style={{ color:programa.color }}>
            Salud
          </p>
          <p className="text-xs -mt-3" style={{ color:"#888888" }}>
            Solo lo necesario para cuidarte en clase. Si no aplica, dejalo vacio.
          </p>

          <div>
            <label htmlFor="in-lesiones" className={etiq} style={{ color:"rgba(245,245,245,0.5)" }}>
              Fracturas o lesiones graves
            </label>
            <input id="in-lesiones" className={input} style={estilo}
              value={campos.lesiones_previas} onChange={e => cambiar("lesiones_previas", e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="in-deporte" className={etiq} style={{ color:"rgba(245,245,245,0.5)" }}>
              Deportes de contacto que hayas practicado
            </label>
            <input id="in-deporte" className={input} style={estilo}
              value={campos.deporte_previo} onChange={e => cambiar("deporte_previo", e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="in-alergias" className={etiq} style={{ color:"rgba(245,245,245,0.5)" }}>
              Alergias
            </label>
            <input id="in-alergias" className={input} style={estilo}
              value={campos.alergias} onChange={e => cambiar("alergias", e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="in-cond" className={etiq} style={{ color:"rgba(245,245,245,0.5)" }}>
              Alguna condicion a considerar <span style={{ textTransform:"none", fontWeight:400, color:"#888888" }}>· asma, epilepsia…</span>
            </label>
            <input id="in-cond" className={input} style={estilo}
              value={campos.condiciones} onChange={e => cambiar("condiciones", e.target.value)}
            />
          </div>

          {/* Contrato */}
          <p className="text-xs font-bold uppercase tracking-widest pt-3" style={{ color:programa.color }}>
            Acuerdo
          </p>

          <p className="text-xs -mt-3" style={{ color:"#888888" }}>
            Es el mismo texto que se firma en papel en la academia, completo y
            sin recortes. Leelos y despues marca las casillas de abajo.
          </p>

          {/* Primero los documentos, seguidos. Las casillas se agrupan
              despues: intercaladas, cada una quedaba escondida entre dos
              bloques de texto y era facil pasarlas por alto. Juntas se ve de
              un vistazo cuantas faltan. */}
          <div className="space-y-4">
            <Documento indice={`1 / ${totalDocs}`} titulo={`Contrato de ${programa.nombre}`}
              texto={programa.contrato} color={programa.color}
            />
            {docs.manifiesto && (
              <Documento indice={`2 / ${totalDocs}`} titulo={docs.manifiesto.titulo}
                texto={docs.manifiesto.texto} color={programa.color}
              />
            )}
            {docs.reglamento && (
              <Documento indice={`${totalDocs} / ${totalDocs}`} titulo="Reglamento general de la academia"
                texto={docs.reglamento.texto} color={programa.color}
              />
            )}
          </div>

          {/* Aceptaciones, todas juntas */}
          <p className="text-xs font-bold uppercase tracking-widest pt-3" style={{ color:programa.color }}>
            Aceptacion
            <span className="ml-2 font-normal tracking-normal normal-case"
              style={{ color: faltantes === 0 ? "#4ade80" : "#888888" }}
            >
              {faltantes === 0
                ? "· listo"
                : `· falta${faltantes > 1 ? "n" : ""} ${faltantes} de ${totalObligatorias}`}
            </span>
          </p>

          <div className="space-y-2.5">
            {obligatorias.map(({ llave, texto }) => (
              <label key={llave} className="flex items-start gap-3 p-4 cursor-pointer"
                style={{ background:"#111111", border:`1px solid ${campos[llave] ? programa.color : "rgba(245,245,245,0.1)"}` }}
              >
                <input type="checkbox" checked={campos[llave]} required
                  onChange={e => cambiar(llave, e.target.checked)}
                  className="w-5 h-5 mt-0.5 shrink-0" style={{ accentColor:programa.color }}
                />
                <span className="text-sm" style={{ color:"#f5f5f5" }}>{texto}</span>
              </label>
            ))}

            {/* Las opcionales van despues y se ven distintas, para que no se
                confundan con las que si bloquean el registro */}
            <label className="flex items-start gap-3 p-4 cursor-pointer"
              style={{ background:"#0d0d0d", border:"1px solid rgba(245,245,245,0.07)" }}
            >
              <input type="checkbox" checked={campos.acepto_salud}
                onChange={e => cambiar("acepto_salud", e.target.checked)}
                className="w-5 h-5 mt-0.5 shrink-0" style={{ accentColor:programa.color }}
              />
              <span className="text-sm" style={{ color:"rgba(245,245,245,0.75)" }}>
                Autorizo que la academia guarde la informacion de salud para
                atender una urgencia
                <span className="block text-xs mt-0.5" style={{ color:"#888888" }}>
                  Opcional
                </span>
              </span>
            </label>

            <label className="flex items-start gap-3 p-4 cursor-pointer"
              style={{ background:"#0d0d0d", border:"1px solid rgba(245,245,245,0.07)" }}
            >
              <input type="checkbox" checked={campos.acepto_imagen}
                onChange={e => cambiar("acepto_imagen", e.target.checked)}
                className="w-5 h-5 mt-0.5 shrink-0" style={{ accentColor:programa.color }}
              />
              <span className="text-sm" style={{ color:"rgba(245,245,245,0.75)" }}>
                Autorizo que aparezca en fotos y videos de la academia
                <span className="block text-xs mt-0.5" style={{ color:"#888888" }}>
                  Opcional. Puedes inscribirte sin aceptar esto.
                </span>
              </span>
            </label>
          </div>

          {/* Firma */}
          <p className="text-xs font-bold uppercase tracking-widest pt-3" style={{ color:programa.color }}>
            Firma
          </p>

          <div>
            <label htmlFor="in-firmante" className={etiq} style={{ color:"rgba(245,245,245,0.5)" }}>
              {esMenor ? "Nombre del padre, madre o tutor que firma" : "Nombre de quien firma"}
            </label>
            <input id="in-firmante" className={input} style={estilo} required
              value={campos.contrato_firmante} onChange={e => cambiar("contrato_firmante", e.target.value)}
              placeholder="Nombre completo"
            />
          </div>

          <FirmaDigital
            valor={campos.firma}
            onCambio={v => cambiar("firma", v)}
            color={programa.color}
            etiqueta={esMenor
              ? "Firma del padre, madre o tutor"
              : "Firma del estudiante mayor de 18 anos"}
          />

          {error && (
            <p role="alert" className="text-sm p-3" style={{ background:"rgba(248,113,113,0.1)", color:"#f87171" }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={!listo || enviando}
            className="w-full py-4 text-base font-bold"
            style={{
              background: listo ? programa.color : "#2a2a2a",
              color: listo ? "#f5f5f5" : "#666666",
              cursor: listo ? "pointer" : "not-allowed",
              fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"18px",
            }}
          >{enviando ? "Enviando…" : "Enviar registro"}</button>

          <p className="text-xs text-center pb-4" style={{ color:"#666666" }}>
            Tus datos se usan solo para tu registro en la academia.
            Puedes pedirnos que los corrijamos o eliminemos cuando quieras.
          </p>
        </form>
      </div>
    </div>
  )
}

export default Inscripcion
