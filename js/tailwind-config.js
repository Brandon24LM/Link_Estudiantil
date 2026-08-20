/* Configuración de Tailwind con los tokens del UI Kit.
   Se carga después del CDN de Tailwind en todas las páginas. */
if (window.tailwind) {
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary: '#0064e0',
          'primary-dark': '#0050b3',
          'primary-soft': '#e6f0ff',
          secondary: '#0ba06a',
          'secondary-dark': '#088055',
          muted: '#5f6470',
          selected: '#a5d8ff',
          error: '#ff383c',
          'card-bg': '#dddddd',
          borderc: '#e0e0e0',
          surface: '#f8f9fa',
          dark: '#101319'
        },
        fontFamily: { sans: ['Inter', 'Arial', 'sans-serif'] },
        borderRadius: { sm: '6px', md: '12px', lg: '20px', pill: '999px' },
        boxShadow: {
          card: '0 4px 12px rgb(0 0 0 / 8%)',
          'card-hover': '0 8px 24px rgb(0 0 0 / 12%)',
          float: '0 16px 40px rgb(0 0 0 / 14%)'
        }
      }
    }
  };
}
