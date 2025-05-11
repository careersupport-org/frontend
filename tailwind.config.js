/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards'
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#A0A0B0',
            a: {
              color: '#5AC8FA',
              '&:hover': {
                color: '#4AB8EA',
              },
            },
            strong: {
              color: '#E0E0E6',
            },
            h1: {
              color: '#E0E0E6',
            },
            h2: {
              color: '#E0E0E6',
            },
            h3: {
              color: '#E0E0E6',
            },
            h4: {
              color: '#E0E0E6',
            },
            code: {
              color: '#5AC8FA',
            },
            pre: {
              backgroundColor: '#1A1A20',
              color: '#A0A0B0',
            },
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
    require('@tailwindcss/typography'),
  ],
};