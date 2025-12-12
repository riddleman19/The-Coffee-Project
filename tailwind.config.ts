import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2a1607',
        secondary: '#5b3411',
        accent: '#d4a574',
        'accent-dark': '#c89d63',
        'light-bg': '#faf7f2',
        gray: '#666',
        'gray-light': '#999',
        border: '#e8e0d8',
        success: '#27ae60',
        warning: '#e74c3c',
        highlight: '#8b6f47',
      },
      fontFamily: {
        system: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      spacing: {
        'safe-inset': 'env(safe-area-inset-bottom)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-in': 'slide-in 0.6s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
      },
      boxShadow: {
        sm: '0 2px 8px rgba(0, 0, 0, 0.04)',
        md: '0 4px 12px rgba(0, 0, 0, 0.05)',
        lg: '0 8px 20px rgba(0, 0, 0, 0.08)',
        xl: '0 12px 35px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        lg: '0.75rem',
      },
      transitionDuration: {
        250: '250ms',
      },
      maxWidth: {
        'coffee': '1000px',
      },
    },
  },
  plugins: [],
}

export default config
