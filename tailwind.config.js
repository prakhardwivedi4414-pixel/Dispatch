/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#FDFCF9',
          100: '#FAF7F2',
          200: '#F4EFE6',
          300: '#EAE3D6',
          400: '#DDD5C7',
          900: '#18181A',
        },
        ink: {
          950: '#111113',
          900: '#18181A',
          800: '#27272A',
          700: '#3F3F46',
          600: '#52525B',
          500: '#71717A',
          400: '#A1A1AA',
        },
        editorial: {
          red: '#9E1B1B',
          'red-dark': '#7F1515',
          'red-light': '#FBF2F2',
          DEFAULT: '#9E1B1B',
        },
        rule: {
          light: '#ECE7DE',
          DEFAULT: '#D8D1C5',
          dark: '#B5ACA0',
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        headline: ['Newsreader', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'Consolas', 'monospace'],
      },
      letterSpacing: {
        'editorial': '0.14em',
        'subtle': '0.04em',
      }
    },
  },
  plugins: [],
}
