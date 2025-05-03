import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          background: 'hsl(var(--primary-background))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        tertiary: 'hsl(var(--tertiary))',
        success: {
          DEFAULT: 'hsla(var(--success))',
          foreground: 'hsla(var(--success-foreground))',
        },
        destructive: {
          DEFAULT: 'hsla(var(--destructive))',
          foreground: 'hsla(var(--destructive-foreground))',
        },
        info: {
          DEFAULT: 'hsla(var(--info))',
          foreground: 'hsla(var(--info-foreground))',
        },
        input: 'hsl(var(--input))',
        pager: {
          DEFAULT: 'hsla(var(--pager))',
          foreground: 'hsla(var(--pager-foreground))',
          background: 'hsla(var(--pager-background))',
        },
        muted: 'hsl(var(--muted))',
        ring: 'hsl(var(--ring))',
        input_invert: 'hsl(var(--input-invert))',
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        primary: ['var(--font-primary)', ...fontFamily.sans],
        display: ['var(--font-display)', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};

export default config;
