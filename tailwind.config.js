/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.hbs'],
  theme: {
    extend: {},
    colors: {

      'maincolor': '#0980D3',
      'secondary': '#001A69',
      'tertiary': '#D9D9D9',
      'dirty-white': '#FFFBFB',
      'white': '#FFFFFF',
    },


    fontFamily: {
      'Inknut': ['Inknut Antiqua', 'serif'],
      'Inika': ['Inika', 'serif'],
    },
  },
  plugins: [],
}