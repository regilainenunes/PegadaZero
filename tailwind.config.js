/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // PegadaZero Color Palette
        'verde-folha': '#2BA84A',
        'azul-esverdeado': '#007E80',
        'verde-escuro': '#004D1C',
        'verde-claro': '#C4EAD0',
        'branco': '#FFFFFF',
        
        // Semantic colors
        primary: '#2BA84A',
        secondary: '#007E80',
        accent: '#C4EAD0',
        dark: '#004D1C',
        light: '#FFFFFF',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2BA84A 0%, #007E80 100%)',
        'gradient-light': 'linear-gradient(135deg, #C4EAD0 0%, #FFFFFF 100%)',
        'gradient-dark': 'linear-gradient(135deg, #004D1C 0%, #007E80 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'pegada': '0 4px 20px rgba(0, 77, 28, 0.1)',
        'pegada-lg': '0 8px 30px rgba(0, 77, 28, 0.15)',
        'pegada-xl': '0 12px 40px rgba(0, 77, 28, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}

