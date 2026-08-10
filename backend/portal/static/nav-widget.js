/* FILE: /opt/nexifyai/portal/static/nav-widget.js
 * NIR: 16.07.2026
 * UPDATED: 16.07.2026
 * NAME: NeXifyAI Agent
 * TEAM: NeXifyAI Core
 * WHAT: Injiziert WebUI/Login/Logout-Buttons auf jeder internen Portal-Seite.
 * WHY: Konsistente Navigation über alle Lösungen (Pascal-Auftrag 16.07.2026) —
 *      alle Links target=_self (gleicher Tab), kein SSO-Umbau.
 * DEPENDS: nexifyai-tokens.css (--panel, --line, --white, --muted Variablen),
 *          access_token-Cookie (Domain .nexifyai.cloud, gesetzt von portal/auth/server.py)
 */
(function () {
  var WEBUI_URL = 'https://webui.nexifyai.cloud/';
  var WEBUI_LOGIN_URL = 'https://webui.nexifyai.cloud/login';
  var LOGOUT_URL = '/auth/logout?final=true';

  // Eingeloggt = access_token-Cookie vorhanden (gesetzt von portal/auth/server.py, Kap. 6.2 J)
  var loggedIn = document.cookie.indexOf('access_token=') !== -1;

  var bar = document.createElement('div');
  bar.id = 'nx-nav-widget';
  bar.innerHTML = loggedIn
    ? '<a href="' + WEBUI_URL + '" target="_self">&larr; WebUI</a>' +
      '<a href="' + LOGOUT_URL + '" target="_self">Logout</a>'
    : '<a href="' + WEBUI_LOGIN_URL + '" target="_self">Login</a>';

  var style = document.createElement('style');
  style.textContent =
    '#nx-nav-widget{position:fixed;top:12px;right:12px;z-index:9999;display:flex;gap:8px;font-family:"Manrope",system-ui,sans-serif}' +
    '#nx-nav-widget a{padding:6px 12px;border-radius:8px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);color:#fafafa;font-size:12px;font-weight:600;text-decoration:none;transition:background .2s}' +
    '#nx-nav-widget a:hover{background:rgba(255,255,255,.08)}';

  document.head.appendChild(style);
  document.body.appendChild(bar);
})();
