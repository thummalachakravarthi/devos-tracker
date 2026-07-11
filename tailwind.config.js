/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#E9EDF5',
        surface: '#FFFFFF',
        surface2: '#EEF2F9',
        line: '#DFE5F1',
        text: '#1E2635',
        dim: '#8792A8',
        amber: '#2563EB',
        mint: '#2563EB',
        red: '#E5484D',
        violet: '#2563EB',
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
