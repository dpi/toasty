/** @type {import('tailwindcss').Config} */
export default {
  important: '.toasty-toaster',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      zIndex: {
        '200': '200',
      },
      keyframes: {
        'new-notification': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}


