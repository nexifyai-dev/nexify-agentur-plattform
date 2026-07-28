/**
 * NeXify Design System v2.0 — Tailwind CSS Preset
 *
 * Canonical SoT: /workspace/DESIGN_SYSTEM_V2.md
 * Register:      /workspace/nexify/04_register/DESIGN_SYSTEM_V2.md
 * Decision:      /opt/nexifyai/docs/decisions/DECISION-2026-07-25-DESIGN-SYSTEM-V2-SOT.md
 *
 * Usage:
 *   // tailwind.config.js
 *   module.exports = {
 *     presets: [require('./tw-nexify-preset')],
 *     content: ['./src/**/*.{js,jsx,ts,tsx}'],
 *   }
 *
 * CSS-var(--nx-*) references — ThemeProvider-compatible.
 * data-skin="nexify" + .dark on <html>
 */

const nexifyPreset = {
  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',

        nx: {
          bg: 'var(--nx-bg)',
          sidebar: 'var(--nx-sidebar)',
          surface: 'var(--nx-surface)',
          'surface-subtle': 'var(--nx-surface-subtle)',
          'surface-hover': 'var(--nx-surface-subtle-hover)',
          'main-bg': 'var(--nx-main-bg)',
          'topbar-bg': 'var(--nx-topbar-bg)',
          'input-bg': 'var(--nx-input-bg)',
          'code-bg': 'var(--nx-code-bg)',
        },

        border: {
          DEFAULT: 'var(--nx-border)',
          2: 'var(--nx-border-2)',
          subtle: 'var(--nx-border-subtle)',
          muted: 'var(--nx-border-muted)',
        },

        text: {
          DEFAULT: 'var(--nx-text)',
          strong: 'var(--nx-text-strong)',
          muted: 'var(--nx-text-muted)',
          em: 'var(--nx-text-em)',
          code: 'var(--nx-code-text)',
          pre: 'var(--nx-pre-text)',
        },

        primary: {
          DEFAULT: 'var(--nx-primary)',
          hover: 'var(--nx-primary-hover)',
          foreground: 'var(--nx-primary-foreground)',
          bg: 'var(--nx-primary-bg)',
          'bg-strong': 'var(--nx-primary-bg-strong)',
        },

        accent: {
          DEFAULT: 'var(--nx-accent)',
          hover: 'var(--nx-accent-hover)',
          foreground: 'var(--nx-accent-foreground)',
          bg: 'var(--nx-accent-bg)',
          'bg-strong': 'var(--nx-accent-bg-strong)',
          2: 'var(--nx-accent-2)',
          '2-hover': 'var(--nx-accent-2-hover)',
          '2-foreground': 'var(--nx-accent-2-foreground)',
          '2-bg': 'var(--nx-accent-2-bg)',
          '2-bg-strong': 'var(--nx-accent-2-bg-strong)',
        },

        semantic: {
          blue: 'var(--nx-blue)',
          gold: 'var(--nx-gold)',
          error: 'var(--nx-error)',
          success: 'var(--nx-success)',
          warning: 'var(--nx-warning)',
          info: 'var(--nx-info)',
        },
      },

      borderRadius: {
        sm: 'var(--nx-radius-sm)',
        md: 'var(--nx-radius-md)',
        card: 'var(--nx-radius-card)',
        lg: 'var(--nx-radius-lg)',
        pill: 'var(--nx-radius-pill)',
      },

      spacing: {
        1: 'var(--nx-space-1)',
        2: 'var(--nx-space-2)',
        3: 'var(--nx-space-3)',
        4: 'var(--nx-space-4)',
        5: 'var(--nx-space-5)',
        6: 'var(--nx-space-6)',
        8: 'var(--nx-space-8)',
      },

      fontFamily: {
        ui: ['Inter', 'DM Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        heading: ['Inter', 'Space Grotesk', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['ui-monospace', '"SFMono-Regular"', '"SF Mono"', 'Menlo', 'Consolas', '"Liberation Mono"', 'monospace'],
      },

      fontSize: {
        xs: ['var(--nx-font-size-xs)', { lineHeight: 'var(--nx-leading-normal)' }],
        sm: ['var(--nx-font-size-sm)', { lineHeight: 'var(--nx-leading-normal)' }],
        base: ['var(--nx-font-size-base)', { lineHeight: 'var(--nx-leading-normal)' }],
        lg: ['var(--nx-font-size-lg)', { lineHeight: 'var(--nx-leading-normal)' }],
        xl: ['var(--nx-font-size-xl)', { lineHeight: 'var(--nx-leading-tight)' }],
        '2xl': ['var(--nx-font-size-2xl)', { lineHeight: 'var(--nx-leading-tight)' }],
        '3xl': ['var(--nx-font-size-3xl)', { lineHeight: 'var(--nx-leading-tight)' }],
      },

      boxShadow: {
        'nx-0': 'var(--nx-depth-0-shadow)',
        'nx-1': 'var(--nx-depth-1-shadow)',
        'nx-2': 'var(--nx-depth-2-shadow)',
        'nx-3': 'var(--nx-depth-3-shadow)',
        'nx-4': 'var(--nx-depth-4-shadow)',
        'nx-1-dark': 'var(--nx-depth-1-shadow-dark)',
        'nx-2-dark': 'var(--nx-depth-2-shadow-dark)',
        'nx-3-dark': 'var(--nx-depth-3-shadow-dark)',
        'nx-4-dark': 'var(--nx-depth-4-shadow-dark)',
        'nx-hover': 'var(--nx-hover-lift-shadow)',
        'nx-hover-dark': 'var(--nx-hover-lift-shadow-dark)',
        'nx-active': 'var(--nx-active-press-shadow)',
        'nx-focus': 'var(--nx-focus-glow-ring)',
        'nx-focus-strong': 'var(--nx-focus-glow-strong)',
      },

      ringColor: {
        nexify: 'var(--nx-focus-ring)',
      },
      ringOffsetColor: {
        nexify: 'var(--nx-bg)',
      },

      transitionTimingFunction: {
        'nx-out': 'var(--nx-ease-out-cubic)',
        'nx-spring': 'var(--nx-ease-spring)',
        'nx-bounce': 'var(--nx-ease-bounce)',
        'nx-smooth': 'var(--nx-ease-smooth)',
      },
    },
  },

  plugins: [],
};

module.exports = nexifyPreset;
