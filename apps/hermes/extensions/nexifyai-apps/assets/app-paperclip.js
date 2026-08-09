/**
 * NeXify AI Paperclip — External App Tab
 * Paperclip Factory: API aktiv auf :3100 (/api/health ok, /api/skills),
 * Web-UI existiert nicht (API-only Factory). Tab zeigt CI-gestyltes
 * Info-Panel statt 404-Iframe.
 * CI: design_guidelines.json Dark/Luxury (#0A0A0A, #C8FF00, Outfit/Manrope)
 */
(function() {
  'use strict';

  const APP_ID = 'nexifyai-app-paperclip';
  const LABEL = 'Paperclip';
  const ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>';

  function createPanel() {
    const panel = document.createElement('div');
    panel.className = 'nexifyai-app-panel';
    panel.id = APP_ID + '-panel';
    panel.innerHTML = `
      <div class="nexifyai-app-info" style="padding:40px 32px;font-family:Manrope,system-ui,sans-serif;color:#A1A1AA;line-height:1.6">
        <h2 style="font-family:Outfit,sans-serif;font-weight:600;font-size:20px;color:#FFF;margin:0 0 12px">NeXify AI Paperclip Factory</h2>
        <p style="margin:0 0 8px">Skill-Factory-API aktiv (Port 3100).</p>
        <p style="margin:0 0 20px">Endpunkte: <code style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:2px 8px;color:#C8FF00">/api/health</code> · <code style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:2px 8px;color:#C8FF00">/api/skills</code></p>
        <p style="margin:0;font-size:13px">Web-Oberfläche folgt — API-Nutzung direkt oder &uuml;ber Agenten.</p>
      </div>`;
    document.body.appendChild(panel);
    return panel;
  }

  function createRailButton() {
    const btn = document.createElement('button');
    btn.className = 'rail-btn nav-tab has-tooltip nexifyai-app-rail';
    btn.id = APP_ID + '-btn';
    btn.title = 'Paperclip — Skills-Factory (API aktiv)';
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
      document.querySelectorAll('.nexifyai-app-panel').forEach(function(p){p.classList.remove('active');});
      document.querySelectorAll('.nexifyai-app-rail').forEach(function(b){b.classList.remove('active');});
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
