// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './modules/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-bg': '#0f172a', // Deep dark navy
        'brand-card': '#1e293b', // Lighter navy for cards
        'brand-blue': '#0ea5e9', // Bright sky blue
        'brand-green': '#10b981', // Success green for recording/active
      },
    },
  },
}