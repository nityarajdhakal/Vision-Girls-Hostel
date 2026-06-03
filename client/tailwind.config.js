export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        rosegold: '#C9977A',
        cream: '#FDF6F0',
        plum: '#4A1942',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Nunito', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 50px rgba(74,25,66,0.12)',
      },
    },
  },
  plugins: [],
};
