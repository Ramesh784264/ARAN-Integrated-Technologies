/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#06264D',
          midnight: '#041D3B',
          orange: '#FF8A00',
          'orange-hover': '#E07600',
          'orange-light': '#FFA733',
          'orange-glow': 'rgba(255, 138, 0, 0.25)',
          gray: {
            50: '#F8FAFC',
            100: '#F3F6FA',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
          }
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        heading: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.07) 1px, transparent 0)",
        'dark-grid': "radial-gradient(circle at 1px 1px, rgba(6, 38, 77, 0.08) 1px, transparent 0)",
        'tech-gradient': "linear-gradient(135deg, #041D3B 0%, #06264D 50%, #0A3669 100%)",
        'orange-gradient': "linear-gradient(135deg, #FF8A00 0%, #FF6200 100%)",
      },
      boxShadow: {
        'orange-glow': '0 0 25px rgba(255, 138, 0, 0.35)',
        'orange-glow-lg': '0 0 40px rgba(255, 138, 0, 0.5)',
        'tech-card': '0 10px 30px -10px rgba(4, 29, 59, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
