/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0A0F1C',
        'bg-card': '#121A2A',
        'bg-card-hover': '#1a2540',
        'accent': '#00E5FF',
        'accent-dark': '#00B8CC',
        'accent-glow': 'rgba(0, 229, 255, 0.15)',
        'success': '#22C55E',
        'warning': '#F59E0B',
        'danger': '#EF4444',
        'text-primary': '#FFFFFF',
        'text-secondary': '#94A3B8',
        'text-muted': '#64748B',
        'border-subtle': 'rgba(255,255,255,0.08)',
        'border-accent': 'rgba(0, 229, 255, 0.3)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(135deg, #00E5FF 0%, #7C3AED 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(18,26,42,0.9) 0%, rgba(10,15,28,0.9) 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 229, 255, 0.3)',
        'glow-sm': '0 0 10px rgba(0, 229, 255, 0.2)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 16px 48px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
