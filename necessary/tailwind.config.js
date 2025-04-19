/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      perspective: {
        '1000': '1000px',
      },
      rotateX: {
        '1': '1deg',
        '2': '2deg',
      },
      translate: {
        'z-0': '0px',
        'z-2': '2px',
        'z-4': '4px',
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      const newUtilities = {
        '.perspective-1000': {
          'perspective': '1000px',
        },
        '.preserve-3d': {
          'transform-style': 'preserve-3d',
        },
        '.rotate-x-1': {
          'transform': 'rotateX(1deg)',
        },
        '.rotate-x-2': {
          'transform': 'rotateX(2deg)',
        },
        '.translate-z-2': {
          'transform': 'translateZ(2px)',
        },
        '.translate-z-4': {
          'transform': 'translateZ(4px)',
        }
      }
      addUtilities(newUtilities)
    }
  ],
}
