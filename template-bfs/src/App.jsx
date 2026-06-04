// App.jsx — importa desde Pages.jsx que contiene todo el router
import { BrowserRouter } from "react-router-dom"
import AppRouter from "./pages/Pages"
export default function App() {
  return <BrowserRouter><AppRouter /></BrowserRouter>
}
