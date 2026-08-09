/**
 * NeXify AI Router — External App Tab
 * Binds 9Router-Cockpit/System als Tab in der Workstation
 * CI: design_guidelines.json Dark/Luxury (#0A0A0A, #C8FF00, Outfit/Manrope)
 */
(function() {
  'use strict';

  const APP_ID = 'nexifyai-app-router';
  const DEFAULT_URL = 'https://ai-router.nexifyai.cloud/';
  const LABEL = 'Router';
  const ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/><line x1="10" y1="6" x2="18" y2="6"/><line x1="10" y1="18" x2="18" y2="18"/></svg>';

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
    btn.title = '9Router — AI-Router';
    btn.innerHTML = ICON;
    btn.addEventListener('click', function() {
      window.NeXifyAIAppRouter.toggle();
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

  window.NeXifyAIAppRouter = {
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
