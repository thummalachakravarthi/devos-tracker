/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F6F6FB',
        surface: '#FFFFFF',
        surface2: '#F3F4FA',
        line: '#E8EAF3',
        text: '#151A2D',
        dim: '#667085',
        amber: '#F0932C',
        mint: '#21C39E',
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
