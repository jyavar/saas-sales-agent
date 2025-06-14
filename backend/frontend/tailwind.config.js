/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'rgba(var(--color-primary-rgb), 0.05)',
          100: 'rgba(var(--color-primary-rgb), 0.1)',
          200: 'rgba(var(--color-primary-rgb), 0.2)',
          300: 'rgba(var(--color-primary-rgb), 0.3)',
          400: 'rgba(var(--color-primary-rgb), 0.4)',
          500: 'var(--color-primary)',
          600: 'rgba(var(--color-primary-rgb), 0.9)',
          700: 'rgba(var(--color-primary-rgb), 0.8)',
          800: 'rgba(var(--color-primary-rgb), 0.7)',
          900: 'rgba(var(--color-primary-rgb), 0.6)',
        },
        secondary: {
          50: 'rgba(var(--color-secondary-rgb), 0.05)',
          100: 'rgba(var(--color-secondary-rgb), 0.1)',
          200: 'rgba(var(--color-secondary-rgb), 0.2)',
          300: 'rgba(var(--color-secondary-rgb), 0.3)',
          400: 'rgba(var(--color-secondary-rgb), 0.4)',
          500: 'var(--color-secondary)',
          600: 'rgba(var(--color-secondary-rgb), 0.9)',
          700: 'rgba(var(--color-secondary-rgb), 0.8)',
          800: 'rgba(var(--color-secondary-rgb), 0.7)',
          900: 'rgba(var(--color-secondary-rgb), 0.6)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};