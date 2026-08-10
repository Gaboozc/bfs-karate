// Fotos de un producto — BFS Martial Arts
//
// Sustituye al campo "Imagen (enlace)", que pedia una URL. Para el Sensei, que
// va a fotografiar la mercancia con su telefono parado en el dojo, una URL es
// inservible: tendria que subir la foto a otro lado primero.
//
// SOBRE EL INPUT
// accept="image/*" sin capture: con capture se fuerza la camara, y muchas
// veces la foto ya esta en el carrete. Sin el, el telefono ofrece las dos
// opciones y decide quien sube.
//
// Las fotos se comprimen en el navegador antes de viajar (ver data/fotos.js).

import { useState, useEffect, useRef } from "react"
import { Upload, X, Star, Loader2, AlertCircle } from "lucide-react"
import {
  imagenesDeProducto, subirFotoProducto, borrarFotoProducto, reordenarFotos,
} from "../data/supabase"
import { comprimir, rutaDeFoto } from "../data/fotos"

const FotosProducto = ({ productoId }) => {
  const [fotos, setFotos]       = useState([])
  const [cargando, setCargando] = useState(false)
  const [subiendo, setSubiendo] = useState(0)   // cuantas faltan
  const [error, setError]       = useState("")
  const archivoRef = useRef(null)

  const recargar = async () => {
    if (!productoId) return
    setCargando(true)
    const { datos, error } = await imagenesDeProducto(productoId)
    if (error) setError(error.message); else setFotos(datos)
    setCargando(false)
  }

  useEffect(() => { recargar() }, [productoId])

  const elegir = async e => {
    const archivos = [...e.target.files]
    e.target.value = ""            // permite volver a elegir el mismo archivo
    if (!archivos.length) return

    setError("")
    setSubiendo(archivos.length)
    let orden = fotos.length

    for (const archivo of archivos) {
      const blob = await comprimir(archivo)
      const { error } = await subirFotoProducto(productoId, blob, rutaDeFoto(productoId, archivo), orden++)
      if (error) { setError(`No se pudo subir ${archivo.name}: ${error.message}`); break }
      setSubiendo(n => n - 1)
    }
    setSubiendo(0)
    recargar()
  }

  const quitar = async foto => {
    const { error } = await borrarFotoProducto(foto)
    if (error) { setError(error.message); return }
    recargar()
  }

  // Portada = primera. Se mueve al frente y se reenumera todo.
  const hacerPortada = async foto => {
    const resto = fotos.filter(f => f.id !== foto.id)
    const nuevo = [foto, ...resto]
    setFotos(nuevo)                       // se ve al instante
    const { error } = await reordenarFotos(nuevo)
    if (error) { setError(error.message); recargar() }
  }

  if (!productoId) {
    return (
      <div className="p-4 rounded-lg text-xs" style={{ background:"#0a0a0a", border:"1px dashed #2a2a2a", color:"#64748b" }}>
        Guarda el producto primero y despues podras agregarle fotos.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color:"#94a3b8" }}>
          Fotos {fotos.length > 0 && <span style={{ color:"#64748b", textTransform:"none" }}>· {fotos.length}</span>}
        </span>
        <button type="button" onClick={() => archivoRef.current?.click()}
          disabled={subiendo > 0}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
          style={{ background: subiendo > 0 ? "#2a2a2a" : "#c0392b", cursor: subiendo > 0 ? "wait" : "pointer" }}
        >
          {subiendo > 0
            ? <><Loader2 size={12} className="animate-spin"/> Subiendo {subiendo}…</>
            : <><Upload size={12}/> Agregar fotos</>}
        </button>
      </div>

      <input ref={archivoRef} type="file" accept="image/*" multiple
        onChange={elegir} className="hidden" aria-hidden="true" tabIndex={-1}
      />

      {error && (
        <p role="alert" className="flex items-start gap-2 text-xs p-2.5 rounded-lg"
          style={{ background:"rgba(248,113,113,0.1)", color:"#f87171" }}
        ><AlertCircle size={13} className="mt-0.5 shrink-0"/>{error}</p>
      )}

      {cargando ? (
        <p className="text-xs py-3" style={{ color:"#64748b" }}>Cargando fotos…</p>
      ) : fotos.length === 0 ? (
        <button type="button" onClick={() => archivoRef.current?.click()}
          className="w-full py-7 rounded-lg flex flex-col items-center gap-2"
          style={{ background:"#0a0a0a", border:"1px dashed #2a2a2a" }}
        >
          <Upload size={18} style={{ color:"#334155" }}/>
          <span className="text-xs" style={{ color:"#64748b" }}>
            Toma la foto o eligela de tu telefono
          </span>
          <span className="text-[11px]" style={{ color:"#475569" }}>
            Puedes subir varias a la vez
          </span>
        </button>
      ) : (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {fotos.map((f, i) => (
              <div key={f.id} className="relative group rounded-lg overflow-hidden"
                style={{ aspectRatio:"1/1", background:"#0a0a0a", border: i === 0 ? "2px solid #c0392b" : "1px solid #2a2a2a" }}
              >
                <img src={f.url} alt="" className="w-full h-full object-cover"/>

                {i === 0 && (
                  <span className="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background:"#c0392b", color:"#fff" }}
                  >PORTADA</span>
                )}

                <div className="absolute inset-x-0 bottom-0 flex justify-between p-1"
                  style={{ background:"linear-gradient(transparent, rgba(0,0,0,0.75))" }}
                >
                  {i !== 0 ? (
                    <button type="button" onClick={() => hacerPortada(f)}
                      aria-label="Usar como portada" title="Usar como portada"
                      style={{ color:"#e2e8f0" }}
                    ><Star size={13}/></button>
                  ) : <span/>}
                  <button type="button" onClick={() => quitar(f)}
                    aria-label="Quitar foto" title="Quitar foto"
                    style={{ color:"#f87171" }}
                  ><X size={14}/></button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px]" style={{ color:"#64748b" }}>
            La marcada como portada es la que se ve en la tienda. Toca la
            estrella de otra para cambiarla.
          </p>
        </>
      )}
    </div>
  )
}

export default FotosProducto
