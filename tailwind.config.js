/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#08090C',
        surface: '#0F1218',
        surface2: '#141821',
        line: '#232833',
        text: '#E9EEF8',
        dim: '#8B94A8',
        amber: '#4C7BFF',
        mint: '#22C55E',
        red: '#F43F5E',
        violet: '#9358FF',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
