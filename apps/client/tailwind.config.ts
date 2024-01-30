import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: { min: '275px', max: '639px' },
        ...defaultTheme.screens,
      },
      fontFamily: {
        nanum: ['Nanum Myeongjo', 'serif'],
        pretendard: ['Pretendard', 'serif'],
      },
      colors: {
        temp: {
          img: '#D9D9D9',
        },
        branding: {
          900: '#025034',
          800: '#247864',
          700: '#1FB286',
          600: '#16E25B',
          500: '#19FF67',
          400: '#59FF91',
          300: '#9BFFBD',
          200: '#DDEFD8',
          100: '#F1F8F0',
        },
        primary: {
          900: '#010101',
          800: '#3F3F3F',
          700: '#656565',
          600: '#7D7D7D',
          500: '#959595',
          400: '#B3B3B3',
          300: '#D9D9D9',
          200: '#F3F3F3',
          100: '#FFFFFF',
        },
        sub: {
          lightYellow: '#FFF7CE',
          lightGreen: '#BDD154',
          red: '#FF5252',
          indigo: '#464E5C',
          lightBlue: '#B9C0FA',
          pink: '#FC968A',
          blue: '#182464',
          lightPink: '#FED9C9',
          green: '#9AC8C8',
          yellow: '#FFCC35',
          deepRed: '#8E1818',
          brown: '#676144',
          babyPink: '#FDD5D3',
          turquoise: '#346F7F',
        },
        grayscale: {
          800: '#36321D',
          700: '#4E4C42',
          600: '#8B8879',
          500: '#C3C2B8',
          400: '#D3D1C7',
          300: '#E6E4DD',
          200: '#EDEAE2',
          100: '#F8F6F0',
        },
        danger: {
          900: '#7C1010',
          800: '#B12222',
          700: '#CC3636',
          600: '#FF5555',
          500: '#FF7A7A',
          400: '#FF9E9E',
          300: '#FFBABA',
          200: '#FFD0D0',
          100: '#FFE6E6',
        },
        success: {
          900: '#025034',
          800: '#118E70',
          700: '#1FB286',
          600: '#16E25B',
          500: '#19FF67',
          400: '#59FF91',
          300: '#9BFFBD',
          200: '#DDEFD8',
          100: '#EEF5EE',
        },
      },
    },
  },
  plugins: [],
};
export default config;
