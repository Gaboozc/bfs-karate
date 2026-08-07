// Campo de firma — BFS Martial Arts
//
// Reemplaza la raya del papel donde el padre o tutor firma. Se dibuja con el
// dedo en el celular o con el mouse en computadora.
//
// SOBRE LOS EVENTOS
// Usa Pointer Events, no mouse+touch por separado: un solo camino de codigo
// cubre dedo, mouse y lapiz, y evita el doble disparo tipico de mezclarlos.
// setPointerCapture mantiene el trazo aunque el dedo se salga del recuadro.
//
// SOBRE LA NITIDEZ
// El lienzo se dimensiona en pixeles reales del dispositivo (devicePixelRatio).
// Sin eso, en un celular la firma sale borrosa: el navegador estira un lienzo
// de baja resolucion.

import { useRef, useState, useEffect, useCallback } from "react"
import { RotateCcw, PenLine } from "lucide-react"

const FirmaDigital = ({ valor, onCambio, color = "#c0392b", etiqueta }) => {
  const lienzoRef  = useRef(null)
  const dibujando  = useRef(false)
  const ultimo     = useRef(null)
  const [tieneTrazo, setTieneTrazo] = useState(Boolean(valor))

  // Ajusta el lienzo a su tamano real en pantalla, con la densidad del equipo
  const preparar = useCallback(() => {
    const lienzo = lienzoRef.current
    if (!lienzo) return
    const caja = lienzo.getBoundingClientRect()
    const densidad = window.devicePixelRatio || 1
    // Cambiar width/height borra el contenido, asi que solo se hace si cambio
    const anchoReal = Math.round(caja.width * densidad)
    const altoReal  = Math.round(caja.height * densidad)
    if (lienzo.width === anchoReal && lienzo.height === altoReal) return
    lienzo.width  = anchoReal
    lienzo.height = altoReal
    const ctx = lienzo.getContext("2d")
    ctx.scale(densidad, densidad)
    ctx.lineWidth   = 2.2
    ctx.lineCap     = "round"
    ctx.lineJoin    = "round"
    ctx.strokeStyle = "#f5f5f5"
  }, [])

  useEffect(() => {
    preparar()
    window.addEventListener("resize", preparar)
    return () => window.removeEventListener("resize", preparar)
  }, [preparar])

  const posicion = e => {
    const caja = lienzoRef.current.getBoundingClientRect()
    return { x: e.clientX - caja.left, y: e.clientY - caja.top }
  }

  const iniciar = e => {
    e.preventDefault()
    lienzoRef.current.setPointerCapture(e.pointerId)
    dibujando.current = true
    ultimo.current = posicion(e)
    // Un toque suelto tambien deja marca: asi se puede poner un punto
    const ctx = lienzoRef.current.getContext("2d")
    ctx.beginPath()
    ctx.arc(ultimo.current.x, ultimo.current.y, 1.1, 0, Math.PI * 2)
    ctx.fillStyle = "#f5f5f5"
    ctx.fill()
    setTieneTrazo(true)
  }

  const mover = e => {
    if (!dibujando.current) return
    e.preventDefault()
    const ctx = lienzoRef.current.getContext("2d")
    const p = posicion(e)
    ctx.beginPath()
    ctx.moveTo(ultimo.current.x, ultimo.current.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    ultimo.current = p
  }

  const terminar = e => {
    if (!dibujando.current) return
    dibujando.current = false
    try { lienzoRef.current.releasePointerCapture(e.pointerId) } catch {}
    onCambio(lienzoRef.current.toDataURL("image/png"))
  }

  const borrar = () => {
    const lienzo = lienzoRef.current
    lienzo.getContext("2d").clearRect(0, 0, lienzo.width, lienzo.height)
    setTieneTrazo(false)
    onCambio("")
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-semibold uppercase tracking-wider"
          style={{ color:"rgba(245,245,245,0.5)" }}
        >{etiqueta}</label>
        {tieneTrazo && (
          <button type="button" onClick={borrar}
            className="inline-flex items-center gap-1.5 text-xs"
            style={{ color:"rgba(245,245,245,0.45)" }}
          ><RotateCcw size={12}/> Borrar y repetir</button>
        )}
      </div>

      <div className="relative" style={{ background:"#111111", border:`1px solid ${tieneTrazo ? color : "rgba(245,245,245,0.12)"}` }}>
        <canvas
          ref={lienzoRef}
          onPointerDown={iniciar}
          onPointerMove={mover}
          onPointerUp={terminar}
          onPointerCancel={terminar}
          onPointerLeave={terminar}
          className="block w-full"
          // touchAction none: sin esto, arrastrar el dedo desplaza la pagina
          // en vez de dibujar
          style={{ height:"170px", touchAction:"none", cursor:"crosshair" }}
          aria-label={etiqueta}
          role="img"
        />
        {!tieneTrazo && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-2">
            <PenLine size={20} style={{ color:"rgba(245,245,245,0.2)" }}/>
            <span className="text-xs" style={{ color:"rgba(245,245,245,0.3)" }}>
              Firma aqui con el dedo
            </span>
          </div>
        )}
        {/* Raya de firma, como en la hoja de papel */}
        <div className="absolute left-6 right-6 pointer-events-none"
          style={{ bottom:"34px", borderBottom:"1px dashed rgba(245,245,245,0.15)" }}
        />
      </div>
    </div>
  )
}

export default FirmaDigital
