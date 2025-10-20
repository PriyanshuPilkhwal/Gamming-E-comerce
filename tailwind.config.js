/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff6b35',
        secondary: '#ff4500',
        background: '#1a1a2e',
        card: 'rgba(255, 255, 255, 0.05)',
        text: '#ffffff',
        'text-muted': '#a0a0a0',
      }
    },
  },
  plugins: [],
}