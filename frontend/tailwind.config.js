/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cafe: {
          50: '#fdfbf7',
          100: '#f7f1e6',
          200: '#eedfcb',
          300: '#e1c6a4',
          400: '#cfa679',
          500: '#bf8855',
          600: '#a76d44',
          700: '#895338',
          800: '#704332',
          900: '#5c382b',
          950: '#321c16',
        },
        espresso: {
          50: '#f9f6f0',
          100: '#ede6db',
          200: '#dbc8b7',
          300: '#c4a48e',
          400: '#b08468',
          500: '#9d6c4d',
          600: '#8c593f',
          700: '#734633',
          800: '#5e3a2c',
          900: '#4e3025',
          950: '#2a1812',
        },
        cream: {
          50: '#fffdfa',
          100: '#fbf7ee',
          200: '#f5edd7',
          300: '#eddcb7',
          400: '#e3c690',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'warm': '0 4px 20px -2px rgba(120, 53, 15, 0.08), 0 2px 6px -1px rgba(120, 53, 15, 0.04)',
        'warm-lg': '0 10px 25px -3px rgba(120, 53, 15, 0.12), 0 4px 10px -2px rgba(120, 53, 15, 0.06)',
        'warm-xl': '0 20px 30px -5px rgba(120, 53, 15, 0.15), 0 8px 15px -3px rgba(120, 53, 15, 0.08)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-short': 'bounce 1s ease-in-out 2',
      }
    },
  },
  plugins: [],
}
