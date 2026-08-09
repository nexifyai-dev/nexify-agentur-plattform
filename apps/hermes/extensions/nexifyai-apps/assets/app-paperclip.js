/**
 * NeXify AI Paperclip — External App Tab (Platzhalter)
 * Paperclip-Dienst existiert nicht mehr (entfernt 18.07.2026).
 * Button bleibt als Platzhalter — Ziel zeigt auf noch nicht aktiven Port 3100.
 * Re-Setup mit Pascal klären (Task t_b83d8323).
 * CI: design_guidelines.json Dark/Luxury (#0A0A0A, #C8FF00, Outfit/Manrope)
 */
(function() {
  'use strict';

  const APP_ID = 'nexifyai-app-paperclip';
  const DEFAULT_URL = 'http://127.0.0.1:3100/';
  const LABEL = 'Paperclip';
  const ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>';

  function getUrl() {
    try { localStorage.removeItem(APP_ID + '-url'); } catch (e) {}
    return DEFAULT_URL;
  }

  function createPanel() {
    const panel = document.createElement('div');
    panel.className = 'nexifyai-app-panel';
    panel.id = APP_ID + '-panel';
    panel.innerHTML = `<iframe src="${getUrl()}" title="${LABEL}" loading="lazy"></iframe>`;
    document.body.appendChild(panel);
    return panel;
  }

  function createRailButton() {
    const btn = document.createElement('button');
    btn.className = 'rail-btn nav-tab has-tooltip nexifyai-app-rail';
    btn.id = APP_ID + '-btn';
    btn.title = 'Paperclip — Skills-Factory (Platzhalter, Dienst inaktiv)';
    btn.innerHTML = ICON;
    btn.addEventListener('click', function() {
      window.NeXifyAIAppPaperclip.toggle();
    });
    return btn;
  }

  function inject() {
    const sidebar = document.querySelector('.sidebar, nav, [role="navigation"], .rail');
    if (sidebar) sidebar.appendChild(createRailButton());
    createPanel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

  window.NeXifyAIAppPaperclip = {
    name: LABEL,
    open: function() {
      document.getElementById(APP_ID + '-panel').classList.add('active');
      document.getElementById(APP_ID + '-btn').classList.add('active');
    },
    close: function() {
      document.getElementById(APP_ID + '-panel').classList.remove('active');
      document.getElementById(APP_ID + '-btn').classList.remove('active');
    },
    toggle: function() {
      const p = document.getElementById(APP_ID + '-panel');
      if (p && p.classList.contains('active')) this.close();
      else this.open();
    }
  };
})();
