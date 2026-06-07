/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0a0a0a',
          50: '#f5f5f5',
          100: '#e8e8e8',
          200: '#d0d0d0',
          300: '#a8a8a8',
          400: '#717171',
          500: '#4a4a4a',
          600: '#2d2d2d',
          700: '#1a1a1a',
          800: '#111111',
          900: '#0a0a0a',
        },
        champagne: {
          DEFAULT: '#c9a96e',
          50: '#fdf8f0',
          100: '#f7edd8',
          200: '#efd8b0',
          300: '#e3be81',
          400: '#d4a055',
          500: '#c9a96e',
          600: '#b8832e',
          700: '#996924',
          800: '#7a5420',
          900: '#5c3f1a',
        },
        ivory: {
          DEFAULT: '#f5f0e8',
          50: '#fdfcfa',
          100: '#faf7f2',
          200: '#f5f0e8',
          300: '#ede4d5',
          400: '#ddd0bb',
          500: '#c8b99a',
        },
        sand: {
          DEFAULT: '#e8dfd0',
          50: '#faf8f5',
          100: '#f2ece3',
          200: '#e8dfd0',
          300: '#d8ccb8',
          400: '#c3b499',
          500: '#ab9876',
        },
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-jost)', 'system-ui', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
