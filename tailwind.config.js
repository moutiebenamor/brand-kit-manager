/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/renderer/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        brand: {
          bg: '#0a0a0f',
          surface: '#12121a',
          card: '#16162a',
          hover: '#1e1e3a',
          border: '#2a2a4a',
          'border-light': '#3a3a5a',
        },
        accent: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          tertiary: '#a78bfa',
          glow: 'rgba(99, 102, 241, 0.15)',
        },
        // Light theme colors
        'light-brand': {
          bg: '#ffffff',
          surface: '#f8fafc',
          card: '#ffffff',
          hover: '#f1f5f9',
          border: '#e2e8f0',
          'border-light': '#cbd5e1',
        },
        'light-brand-text': {
          primary: '#1e293b',
          secondary: '#475569',
          tertiary: '#64748b',
          inverse: '#ffffff',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(99, 102, 241, 0.1)' },
          '50%': { boxShadow: '0 0 25px rgba(99, 102, 241, 0.25)' },
        },
      },
    },
  },
  plugins: [],
};
