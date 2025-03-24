/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: 'var(--color-paper)',
        'paper-light': 'var(--color-paper-light)',
        ink: 'var(--color-ink)',
        accent: 'var(--color-accent)',
        'accent-light': 'var(--color-accent-light)',
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
        info: 'var(--color-info)'
      },
      fontFamily: {
        serif: ['Playfair Display', 'Old Standard TT', 'serif'],
        body: ['Old Standard TT', 'Georgia', 'serif']
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--color-ink)',
            '--tw-prose-headings': 'var(--color-ink)',
            '--tw-prose-links': 'var(--color-accent)',
            '--tw-prose-bold': 'var(--color-ink)',
            '--tw-prose-code': 'var(--color-ink)',
            '--tw-prose-quotes': 'var(--color-ink)',
            maxWidth: 'none'
          }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}