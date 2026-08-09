/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          dark: '#0B0F19',
          darkcard: '#121826',
          light: '#F7F8FC',
          lightcard: '#FFFFFF',
        },
        aurora: {
          violet: '#7C3AED',
          cyan: '#06B6D4',
          pink: '#EC4899',
        },
        ink: {
          dark: '#E7E9F1',
          light: '#111528',
          muted: '#8B93A7',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'aurora-gradient': 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
        'aurora-gradient-soft': 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(6,182,212,0.15) 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.24)',
        glow: '0 0 40px rgba(124,58,237,0.25)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
