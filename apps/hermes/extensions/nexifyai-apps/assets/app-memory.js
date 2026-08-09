/**
 * NeXify AI Brain — External App Tab
 * Binds agentmemory Viewer als Tab in der Workstation
 */
(function() {
  'use strict';

  const APP_ID = 'nexifyai-app-memory';
  const DEFAULT_URL = 'https://agentmemory.nexifyai.cloud/';
  const LABEL = 'Brain';
  const ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>';

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
    btn.title = 'agentmemory — Brain';
    btn.innerHTML = ICON;
    btn.addEventListener('click', function() {
      window.NeXifyAIAppMemory.toggle();
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

  window.NeXifyAIAppMemory = {
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
