/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";
import scrollbarHide from 'tailwind-scrollbar-hide';

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    './public/index.html',
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens:{
        'xl': '1440px',
      },
      gap:{
        '24px' : '24px',
      },
      padding:{
        '104px':'104px',
        '120px':'120px',
        '32px':'32px',
        '16px':'16px',
        '24px':'24px',
        '160px':'160px',
        '12px':'12px',
      },
      fontWeight:{
        '600':'600',
        '500':'500',
      },
      letterSpacing:{
        '-1.2px': '-1.2px'
      },
      fontSize:{
        '18px' : '18px',
        '32px' : '32px',
        '88px' : '88px',
        '72px' : '72px',
        '24px' : '24px',
        '16px' : '16px',
        '14px' : '14px',
        '40px' : '40px',
      },
       backgroundImage: {
        'custom-gradient': 'linear-gradient(95deg, #FFF -26.26%, #656E8B 90.64%)',
      },
      opacity:{
        '20%' : '20%'
      },
      width:{
        '604px' : '604px',
        '394.6px' : '394.6px',
        '720px' : '720px',
        '266.6px' : '266.6px',
        '500px' : '500px',
        '492px' : '492px',
      },
      height:{
          '186px': '186px',
          '352px': '352px',
          '626px': '626px',
          '58px': '58px',
          '472px': '472px',
          '520px': '520px',
          '312px': '312px',
      },
      lineHeight:{
        '125%' : '125%',
        '120%' : '120%',
        '100%' : '100%',
      },
      fontFamily:{
        'rethinkSans' : ["Rethink Sans", "serif"],
        jakartaSans : ["Plus Jakarta Sans", "serif"],
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      margin:{
        '80px' : '80px',
        '120px' : '120px',
        '128px' : '128px',
        '24px' : '24px',
        '40px' : '40px',
      },
      borderRadius:{
        '24px' : '24px',
        '72px' : '72px',
        '40px' : '40px',
      },
      

      colors:{
        background: "var(--background)",
        foreground: "var(--foreground)",
        heroSubHead : '#DEE1E7',
        customGrey : '#9199B0',
        customBgGray : 'rgba(101, 110, 139, 0.30)',
        customGreyCard : '#21242D',
        customGreyFont : '#C1C5D2',
        customButtonBg : '#15171E',
        customCardBg : '#1E212A',
        customBorder : '#656E8B',
        customBackground : '#0F1015'
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        spotlight: "spotlight 1s ease .75s 1 forwards",
        'border-rotate': 'border-rotate 3s linear infinite',
      },
     
      keyframes: {
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
       
        },
           spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        'border-rotate': {
          '0%': { backgroundPosition: '0% center' },
          '50%': { backgroundPosition: '100% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [
    scrollbarHide
  ],
} satisfies Config;