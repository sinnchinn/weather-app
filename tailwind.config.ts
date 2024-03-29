import { url } from "inspector";
import type { Config } from "tailwindcss";
/** @type {import('tailwindcss').Config} */

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    'node_modules/flowbite-react/lib/esm/**/*.js'
  ],
  theme: {
    colors: {
      'mainBg': 'rgba(112, 112, 147, 0.7)',
      'darkBg': 'rgba(68, 68, 123, 0.8)'
    },
    extend: {
      backgroundImage: theme => ({
        'weather-bg': "url('/weatherbg.webp')",
      }),
    },
    fontFamily: {
      mainFont: ['mainFont']
    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
};
export default config;
