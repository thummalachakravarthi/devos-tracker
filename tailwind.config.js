/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0E13',
        surface: '#131822',
        surface2: '#1B2231',
        line: '#26314A',
        text: '#E9EEF6',
        dim: '#8E9AAE',
        amber: '#F2A33C',
        mint: '#43D6B5',
        red: '#E5484D',
        violet: '#8B7CF6',
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
