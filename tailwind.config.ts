import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-blue': '#050818',
        'midnight': '#080c2a',
        'cosmic': '#0d1244',
        'nebula': '#1a1a4e',
        'violet-deep': '#2d1b69',
        'violet-mid': '#4c1d95',
        'rose-neon': '#f472b6',
        'rose-glow': '#ec4899',
        'violet-neon': '#a855f7',
        'violet-glow': '#7c3aed',
        'gold-subtle': '#fbbf24',
        'gold-glow': '#f59e0b',
        'aurora-1': '#667eea',
        'aurora-2': '#764ba2',
        'aurora-3': '#f093fb',
      },
      fontFamily: {
        'playfair': ['var(--font-playfair)', 'Georgia', 'serif'],
        'inter': ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'aurora': 'aurora 8s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)' },
          '50%': { boxShadow: '0 0 60px rgba(168, 85, 247, 0.8), 0 0 100px rgba(244, 114, 182, 0.4)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.3)' },
        },
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.15)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.15)' },
          '70%': { transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glow-violet': '0 0 30px rgba(168, 85, 247, 0.5)',
        'glow-rose': '0 0 30px rgba(244, 114, 182, 0.5)',
        'glow-gold': '0 0 30px rgba(251, 191, 36, 0.4)',
        'inner-glow': 'inset 0 0 30px rgba(168, 85, 247, 0.2)',
      },
    },
  },
  plugins: [],
}
export default config
