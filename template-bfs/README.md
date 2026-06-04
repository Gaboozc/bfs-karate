# BFS Martial Arts & High Performance — AlphaDev Studios

Sitio web completo para academia de artes marciales con panel admin.
Estetica: negro absoluto, rojo sangre BFS, Bebas Neue. Agresivo, disciplinado, profesional.

## Inicio rapido
```bash
npm install && npm run dev
```

## Paginas publicas (Tier 2 — 5 paginas)
| Ruta | Contenido |
|---|---|
| `/` | Hero masivo + Cinturones + Programas + Instructores + Horario + Testimonios + CTA |
| `/programas` | 6 programas con precios, horarios y descripcion completa |
| `/instructores` | 3 instructores con foto BW→color, rango y especialidades |
| `/horarios` | Tabla completa de horario semanal con codigo de colores |
| `/contacto` | Inscripcion + datos del dojo + certificaciones |

## Panel Administrativo — /admin
| Ruta | Modulo |
|---|---|
| `/admin/dashboard` | KPIs, graficas, distribucion de cinturones, clases del dia |
| `/admin/alumnos` | Directorio con barra de asistencia, cinta, mensualidad |
| `/admin/clases` | Clases del dia con asistencia real vs inscritos |
| `/admin/pagos` | Membresias con alerta de pagos vencidos y totales |

**Contrasena:** `admin123`

## Elementos unicos
- Barra de cinturones CSS (7 grados con colores reales)
- Logo SVG generado programaticamente basado en el logo BFS original
- Grid de horario con codigo de colores por programa
- Distribucion de cinturones en el dashboard con barras de color
- Foto de instructores con efecto BW->color en hover

## Personalizacion
- Sitio: `src/data/content.js`
- Admin: `src/data/adminData.js`
- Colores: `:root` en `src/index.css`

**AlphaDev Studios** · alphadevstudios.com
*Template #28 — BFS Martial Arts — Sistema de templates por nicho v2.0*
