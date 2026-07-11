/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#E0F2FE',
        surface: '#FFFFFF',
        surface2: '#F0F9FF',
        line: '#BAE6FD',
        text: '#0C4A6E',
        dim: '#64748B',
        amber: '#0EA5E9',
        mint: '#38BDF8',
        red: '#0284C7',
        violet: '#6366F1',
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
