/**
 * NeXify AI Wissen — External App Tab
 * Binds LightRAG als Tab in der Workstation
 */
(function() {
  'use strict';

  const APP_ID = 'nexifyai-app-wissen';
  const DEFAULT_URL = 'https://rag.nexifyai.cloud/lightrag/webui/';
  const LABEL = 'Wissen';
  const ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>';

  function getUrl() {
    // Erlaubt: relative Proxy-Pfade ODER NeXify-Domains (rag./agentmemory./ai-router.)
    // Verworfene: Loopback (127.0.0.1/localhost) + tote admin.nexifyai.cloud.
    const candidates = [];
    try {
      if (window.HermesExtensionSettings && window.HermesExtensionSettings.settingsForExtension) {
        const s = window.HermesExtensionSettings.settingsForExtension(APP_ID);
        if (s && s.supported) candidates.push(s.get('url'));
      }
    } catch (e) {}
    try { candidates.push(localStorage.getItem(APP_ID + '-url')); } catch (e) {}
    for (const c of candidates) {
      if (typeof c !== 'string' || !c) continue;
      if (c.startsWith('/') && !c.startsWith('//')) return c;
      if (/^https:\/\/[a-z0-9.-]*nexifyai\.cloud\//i.test(c) && !/admin\./.test(c)) return c;
    }
    return DEFAULT_URL;
  }

  function createPanel() {
    const panel = document.createElement('div');
    panel.className = 'nexifyai-app-panel';
    panel.id = APP_ID + '-panel';
    panel.innerHTML = `
      <div class="nexifyai-app-header">
        <button class="nexifyai-app-back" onclick="window.NeXifyAIAppWissen.close()">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Workstation
        </button>
      </div>
      <iframe src="${getUrl()}" title="${LABEL}" loading="lazy"></iframe>
    `;
    document.body.appendChild(panel);
    return panel;
  }

  function createRailButton() {
    const btn = document.createElement('button');
    btn.className = 'nexifyai-rail-btn';
    btn.id = APP_ID + '-btn';
    btn.title = 'LightRAG — Wissensbasis';
    btn.innerHTML = ICON + '<span class="label">' + LABEL + '</span>';
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
