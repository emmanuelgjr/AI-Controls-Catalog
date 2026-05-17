const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Variable', 'Inter', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono Variable', 'JetBrains Mono', ...defaultTheme.fontFamily.mono],
        display: ['Inter Variable', 'Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        ink: {
          50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1',
          400: '#94A3B8', 500: '#64748B', 600: '#475569', 700: '#334155',
          800: '#1E293B', 900: '#0F172A', 950: '#020617',
        },
        accent: {
          50: '#F0FDFA', 100: '#CCFBF1', 200: '#99F6E4', 300: '#5EEAD4',
          400: '#2DD4BF', 500: '#14B8A6', 600: '#0D9488', 700: '#0F766E',
          800: '#115E59', 900: '#134E4A', 950: '#042F2E',
        },
        ok: { DEFAULT: '#059669', 50: '#ECFDF5', 600: '#059669', 700: '#047857' },
        warn: { DEFAULT: '#D97706', 50: '#FFFBEB', 600: '#D97706', 700: '#B45309' },
        risk: { DEFAULT: '#DC2626', 50: '#FEF2F2', 600: '#DC2626', 700: '#B91C1C' },
        info: { DEFAULT: '#2563EB', 50: '#EFF6FF', 600: '#2563EB', 700: '#1D4ED8' },
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
      },
      spacing: { 18: '4.5rem', 22: '5.5rem', 88: '22rem', 128: '32rem' },
      borderRadius: {
        sm: '0.25rem', DEFAULT: '0.5rem', md: '0.5rem',
        lg: '0.75rem', xl: '1rem', '2xl': '1.5rem',
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgb(15 23 42 / 0.04)',
        card: '0 1px 3px 0 rgb(15 23 42 / 0.06), 0 1px 2px -1px rgb(15 23 42 / 0.04)',
        lift: '0 4px 6px -1px rgb(15 23 42 / 0.06), 0 2px 4px -2px rgb(15 23 42 / 0.04)',
        pop: '0 10px 15px -3px rgb(15 23 42 / 0.08), 0 4px 6px -4px rgb(15 23 42 / 0.04)',
      },
      maxWidth: { 'prose-wide': '72ch', content: '80rem', narrow: '40rem' },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.ink.700'),
            '--tw-prose-headings': theme('colors.ink.900'),
            '--tw-prose-lead': theme('colors.ink.700'),
            '--tw-prose-links': theme('colors.accent.700'),
            '--tw-prose-bold': theme('colors.ink.900'),
            '--tw-prose-counters': theme('colors.ink.500'),
            '--tw-prose-bullets': theme('colors.ink.300'),
            '--tw-prose-hr': theme('colors.ink.200'),
            '--tw-prose-quotes': theme('colors.ink.900'),
            '--tw-prose-quote-borders': theme('colors.accent.500'),
            '--tw-prose-code': theme('colors.ink.900'),
            '--tw-prose-pre-code': theme('colors.ink.100'),
            '--tw-prose-pre-bg': theme('colors.ink.900'),
            a: { textDecoration: 'none', borderBottom: `1px solid ${theme('colors.accent.300')}` },
            'a:hover': { borderBottomColor: theme('colors.accent.700') },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')({ strategy: 'class' })],
};
