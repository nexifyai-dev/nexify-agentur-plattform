/**
 * Graphite Design System — Tailwind CSS Preset v1.0
 *
 * Canonical: /workspace/GRAPHITE_DESIGN_SYSTEM.md
 * Origin: Hermes WebUI Skin "Graphite"
 *
 * Usage:
 *   // tailwind.config.js
 *   module.exports = {
 *     presets: [require('./tw-graphite-preset')],
 *     content: ['./src/**/*.{js,jsx,ts,tsx}'],
 *   }
 *
 * CSS-Var References statt Hardcode → Theme-Switcher kompatibel.
 * Wird in :root[data-skin="graphite"] Umgebung betrieben.
 */

const graphitePreset = {
  darkMode: 'class', // Toggle via document.documentElement.classList.toggle('dark')

  theme: {
    extend: {
      // ── Colors ──────────────────────────────────────────────
      colors: {
        transparent: 'transparent',
        current: 'currentColor',

        graphite: {
          bg:               'var(--bg)',
          sidebar:          'var(--sidebar)',
          surface:          'var(--surface)',
          'surface-subtle': 'var(--surface-subtle)',
          'surface-hover':  'var(--surface-subtle-hover)',
          'main-bg':        'var(--main-bg)',
          'topbar-bg':      'var(--topbar-bg)',
          'input-bg':       'var(--input-bg)',
          'code-bg':        'var(--code-bg)',
        },

        border: {
          DEFAULT: 'var(--border)',
          2:       'var(--border2)',
          subtle:  'var(--border-subtle)',
          muted:   'var(--border-muted)',
        },

        text: {
          DEFAULT:    'var(--text)',
          strong:     'var(--strong)',
          muted:      'var(--muted)',
          em:         'var(--em)',
          code:       'var(--code-text)',
          pre:        'var(--pre-text)',
          'bubble':   'var(--user-bubble-text)',
          'bubble-ph':'var(--user-bubble-placeholder)',
        },

        accent: {
          DEFAULT:      'var(--accent)',
          hover:        'var(--accent-hover)',
          bg:           'var(--accent-bg)',
          'bg-strong':  'var(--accent-bg-strong)',
          text:         'var(--accent-text)',
        },

        semantic: {
          blue:     'var(--blue)',
          gold:     'var(--gold)',
          error:    'var(--error)',
          success:  'var(--success)',
          warning:  'var(--warning)',
          info:     'var(--info)',
        },

        // User bubble colors
        user: {
          bubble:         'var(--user-bubble-bg)',
          'bubble-border':'var(--user-bubble-border)',
          'bubble-text':  'var(--user-bubble-text)',
          'bubble-ph':    'var(--user-bubble-placeholder)',
          selection:      'var(--user-selection-bg)',
          'selection-text':'var(--user-selection-text)',
        },
      },

      // ── Border Radius ───────────────────────────────────────
      borderRadius: {
        sm:   'var(--radius-sm)',    // 4px
        md:   'var(--radius-md)',    // 8px
        card: 'var(--radius-card)',  // 8px
        lg:   'var(--radius-lg)',    // 12px
        pill: 'var(--radius-pill)',  // 999px
      },

      // ── Spacing (Paddings, Margins, Gaps) ───────────────────
      spacing: {
        1:   'var(--space-1)',   // 4px
        2:   'var(--space-2)',   // 8px
        3:   'var(--space-3)',   // 12px
        4:   'var(--space-4)',   // 16px
      },

      // ── Font Family ─────────────────────────────────────────
      fontFamily: {
        ui:   ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', '"SFMono-Regular"', '"SF Mono"', 'Menlo', 'Consolas',
               '"Liberation Mono"', 'monospace'],
      },

      // ── Font Sizes ──────────────────────────────────────────
      fontSize: {
        xs:    ['var(--font-size-xs)', { lineHeight: '1.5' }],  // 11px
        sm:    ['var(--font-size-sm)', { lineHeight: '1.5' }],  // 12px
        base:  ['var(--font-size-md)', { lineHeight: '1.6' }],  // 14px
      },

      // ── Box Shadow (from Graphite design system) ────────────
      boxShadow: {
        'e0':     'none',
        'e1':     '0 1px 2px rgba(0,0,0,0.04)',
        'e2':     '0 2px 8px rgba(0,0,0,0.06)',
        'e3':     '0 8px 24px rgba(0,0,0,0.08)',
        'e4':     '0 16px 48px rgba(0,0,0,0.10)',
        'card':   '0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)',
        'card-h': '0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
        'glass':  '0 4px 16px rgba(0,0,0,0.06)',
        'focus':  '0 0 0 2px var(--focus-ring)',
        'inset':  'inset 0 1px 2px rgba(0,0,0,0.04)',
      },

      // ── Focus Ring (Tailwind native) ────────────────────────
      ringColor: {
        graphite: 'var(--focus-ring)',
      },
      ringOffsetColor: {
        graphite: 'var(--bg)',
      },

      // ── Transition ──────────────────────────────────────────
      transitionDuration: {
        fast: '120ms',
        base: '200ms',
        slow: '320ms',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      // ── Z-Index Scale ───────────────────────────────────────
      zIndex: {
        base:     '1',
        dropdown: '40',
        sticky:   '50',
        overlay:  '60',
        modal:    '70',
        topbar:   '80',
        toast:    '90',
        tooltip:  '100',
      },
    },
  },

  // ── Plugins: Focus Ring Default ─────────────────────────────
  plugins: [],
};

module.exports = graphitePreset;
