import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',

        card: 'rgb(var(--card))',
        'card-foreground': 'rgb(var(--card-foreground))',

        border: 'rgb(var(--border))',
        muted: 'rgb(var(--muted))',
        'muted-foreground': 'rgb(var(--muted-foreground))',

        primary: 'rgb(var(--primary))',
        'primary-foreground': 'rgb(var(--primary-foreground))',

        success: 'rgb(var(--success))',
        warning: 'rgb(var(--warning))',
        danger: 'rgb(var(--danger))',
      },
    },
  },
  plugins: [],
};

export default config;
