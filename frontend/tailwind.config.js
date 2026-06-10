/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core surfaces
        'surface-0': 'var(--background-base)',
        'surface-1': 'var(--background-cream)',
        'surface-2': 'var(--background-white)',
        'surface-3': 'var(--background-darker-sand)',
        'surface-4': 'var(--background-darker-sand)',
        // Text
        'text-1': 'var(--text-primary)',
        'text-2': 'var(--text-secondary)',
        'text-3': 'var(--text-muted)',
        'text-4': 'var(--text-muted)',
        // Accent (Coral Red)
        'accent': 'var(--color-accent)',
        'accent-light': 'var(--color-accent-hover)',
        'accent-dim': 'var(--color-accent-dim)',
        'accent-border': 'var(--color-accent-border)',
        // Semantic
        'success': 'var(--color-success)',
        'success-dim': 'var(--color-success-dim)',
        'warning': 'var(--color-warning)',
        'warning-dim': 'var(--color-warning-dim)',
        'danger': 'var(--color-danger)',
        'danger-dim': 'var(--color-danger-dim)',
        // Borders
        'border-1': 'var(--border-color)',
        'border-2': 'var(--border-color-medium)',
        'border-3': 'var(--border-color-high)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Bricolage Grotesque', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-xl': ['3.75rem', { lineHeight: '1.08', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-md': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-sm': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
        'heading-xl': ['1.5rem', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '600' }],
        'heading-lg': ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-md': ['1.125rem', { lineHeight: '1.35', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-sm': ['1rem', { lineHeight: '1.4', letterSpacing: '-0.005em', fontWeight: '600' }],
      },
      letterSpacing: {
        'tighter': '-0.03em',
        'tight': '-0.02em',
        'snug': '-0.01em',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '28px',
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0,0,0,0.4)',
        'sm': '0 2px 8px rgba(0,0,0,0.4)',
        'md': '0 4px 16px rgba(0,0,0,0.5)',
        'lg': '0 8px 32px rgba(0,0,0,0.6)',
        'xl': '0 16px 48px rgba(0,0,0,0.7)',
        '2xl': '0 24px 80px rgba(0,0,0,0.8)',
        'inset': 'inset 0 1px 0 rgba(255,255,255,0.06)',
        'inset-sm': 'inset 0 0 0 1px rgba(255,255,255,0.06)',
        'accent': '0 0 0 3px rgba(79, 70, 229, 0.2)',
        'float': '0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)',
      },
      backdropBlur: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '32px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'fade-up': 'fadeUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'shimmer': 'shimmer 1.8s infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-8px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
    },
  },
  plugins: [],
}
