/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Share Tech Mono"', 'monospace'],
        display: ['"Space Mono"', 'monospace'],
      },
      colors: {
        neonGreen: '#00ff41',
        neonPink: '#ff007f',
        brutalDark: '#0a0a0a',
        brutalLight: '#f4f4f4',
        brutalGray: '#222222'
      }
    },
  },
  plugins: [],
}
