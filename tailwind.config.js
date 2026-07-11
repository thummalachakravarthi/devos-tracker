/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B101F',
        surface: '#FFFFFF',
        surface2: '#EEF2F9',
        line: '#DFE5F1',
        text: '#1E2635',
        dim: '#8792A8',
        amber: '#E8B341',
        mint: '#3FA43C',
        red: '#D4342A',
        violet: '#7E57C2',
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
