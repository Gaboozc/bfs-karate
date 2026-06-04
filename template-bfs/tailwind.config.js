/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blood:   '#c0392b',   // rojo BFS — acento principal
        void:    '#0a0a0a',   // negro absoluto
        steel:   '#1c1c1c',   // gris muy oscuro — cards
        iron:    '#2a2a2a',   // gris oscuro — bordes
        smoke:   '#f5f5f5',   // blanco humo — texto
        ash:     '#888888',   // gris — texto secundario
        crimson: '#a93226',   // rojo oscuro — hover
        // Cinturones — para progresion visual
        belt_white:  '#f5f5f5',
        belt_yellow: '#f5c518',
        belt_orange: '#e07b39',
        belt_green:  '#2d6a4f',
        belt_blue:   '#1a5276',
        belt_brown:  '#6b4c36',
        belt_black:  '#0a0a0a',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        body:    ['"Barlow Condensed"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
