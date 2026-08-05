// App.jsx — importa desde Pages.jsx que contiene todo el router
import { useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import { Analytics } from "@vercel/analytics/react"
import AppRouter from "./pages/Pages"
import { medirContactos } from "./data/medicion"

export default function App() {
  // Registra los clics a WhatsApp, que son la conversion real del sitio
  useEffect(() => medirContactos(), [])

  return (
    <BrowserRouter>
      <AppRouter />
      {/* Analitica sin cookies: no requiere aviso de consentimiento.
          Hay que activarla en Vercel > el proyecto > Analytics. */}
      <Analytics />
    </BrowserRouter>
  )
}
