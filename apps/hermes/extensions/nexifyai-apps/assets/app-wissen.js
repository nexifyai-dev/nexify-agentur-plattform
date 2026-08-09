/**
 * NeXify AI Wissen — External App Tab
 * Binds LightRAG als Tab in der Workstation
 */
(function() {
  'use strict';

  const APP_ID = 'nexifyai-app-wissen';
  const DEFAULT_URL = 'https://rag.nexifyai.cloud/lightrag/webui/';
  const LABEL = 'Wissen';
  const ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>';

  function getUrl() {
    // Fest verdrahtete Ziel-Domain — Settings/localStorage IGNORIEREN.
    // (Alte gespeicherte URLs wie /lightrag/ oder http://127.0.0.1:3113
    // zeigten auf Proxy/Loopback und blockten das Einbetten.)
    try { localStorage.removeItem(APP_ID + '-url'); } catch (e) {}
    return DEFAULT_URL;
  }

  function createPanel() {
    const panel = document.createElement('div');
    panel.className = 'nexifyai-app-panel';
    panel.id = APP_ID + '-panel';
    panel.innerHTML = `
      <iframe src="${getUrl()}" title="${LABEL}" loading="lazy"></iframe>
    `;
    document.body.appendChild(panel);
    return panel;
  }

  function createRailButton() {
    const btn = document.createElement('button');
    btn.className = 'rail-btn nav-tab has-tooltip nexifyai-app-rail';
    btn.id = APP_ID + '-btn';
    btn.title = 'LightRAG — Wissensbasis';
    btn.innerHTML = ICON;
    btn.addEventListener('click', function() {
      window.NeXifyAIAppWissen.toggle();
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

  window.NeXifyAIAppWissen = {
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
      const panel = document.getElementById(APP_ID + '-panel');
      if (panel.classList.contains('active')) this.close(); else this.open();
    }
  };
})();
