/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',  // main brand green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        secondary: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',  // warm orange accent
          600: '#ea580c',
        },
        surface: '#f8fafc',    // card/panel backgrounds (slate-50)
        muted:   '#94a3b8',    // subdued text/borders (slate-400)
        danger:  '#ef4444',    // error states (red-500)
        success: '#22c55e',    // positive states (green-500)
      },
      borderRadius: {
        '2xl': '1rem',
      },
      boxShadow: {
        soft: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
