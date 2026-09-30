/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#3D81E3',
        cyber: {
          bg: '#0c0c0c',
          panel: '#12141a',
          cyan: '#00d2ff',
          neon: '#A4F4FD',
          alert: '#ff3366',
          warning: '#f59e0b',
          success: '#10b981',
          border: 'rgba(255, 255, 255, 0.1)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'shiny': 'shiny 6s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        shiny: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(0, 210, 255, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(0, 210, 255, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
