/**
 * NeXify AI Automation — External App Tab
 * n8n Workflow-Editor: Iframe-Blockade durch n8n (X-Frame-Options: sameorigin,
 * Server-seitig hardcoded). Panel zeigt CI-gestyltes Info mit Öffnen-Link.
 * CI: design_guidelines.json Dark/Luxury (#0A0A0A, #C8FF00, Outfit/Manrope)
 */
(function() {
  'use strict';

  const APP_ID = 'nexifyai-app-automation';
  const DEFAULT_URL = 'https://n8n.nexifyai.cloud/';
  const LABEL = 'Automation';
  const ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>';

  function createPanel() {
    const panel = document.createElement('div');
    panel.className = 'nexifyai-app-panel';
    panel.id = APP_ID + '-panel';
    panel.innerHTML = `
      <div class="nexifyai-app-info" style="padding:40px 32px;font-family:Manrope,system-ui,sans-serif;color:#A1A1AA;line-height:1.6">
        <h2 style="font-family:Outfit,sans-serif;font-weight:600;font-size:20px;color:#FFF;margin:0 0 12px">NeXify AI Workflow Automation (n8n)</h2>
        <p style="margin:0 0 8px">n8n l&auml;uft (Port 5678, <a href="${DEFAULT_URL}" target="_blank" rel="noopener" style="color:#C8FF00">n8n.nexifyai.cloud</a>).</p>
        <p style="margin:0 0 20px">Der Editor blockt die Einbettung per X-Frame-Options — &ouml;ffnen im neuen Tab.</p>
        <a href="${DEFAULT_URL}" target="_blank" rel="noopener" style="display:inline-block;padding:10px 20px;border-radius:999px;background:linear-gradient(120deg,#C8FF00,#eaffb0 50%,#C8FF00);color:#0A0A0A;font-weight:700;text-decoration:none">n8n &ouml;ffnen &#8599;</a>
      </div>`;
    document.body.appendChild(panel);
    return panel;
  }

  function createRailButton() {
    const btn = document.createElement('button');
    btn.className = 'rail-btn nav-tab has-tooltip nexifyai-app-rail';
    btn.id = APP_ID + '-btn';
    btn.title = 'n8n — Workflow-Automation';
    btn.innerHTML = ICON;
    btn.addEventListener('click', function() {
      window.NeXifyAIAppAutomation.toggle();
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

  window.NeXifyAIAppAutomation = {
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
