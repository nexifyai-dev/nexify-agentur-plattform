"""NeXifyAI Paperclip Factory (:3100) — Skill-Quelle + Dokumenten-API (2026-08-09, Mandat Pascal).

Factory = Skill-Source für alle Agenten (P0): serviert Skills-Verzeichnisse + Health.
Policy-Update: OPENMCP-DECISION 2026-08-02 „revive only with mandate" — Mandat erteilt.
"""
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import os, json

app = FastAPI(title="NeXifyAI Paperclip Factory", version="1.1.0")

SKILL_DIRS = [
    "/root/nexify-agentur-plattform/apps/paperclip/skills",
    "/workspace/nexifyai/hermes/skills",
    "/home/hermeswebui/.hermes/skills",
]
SKILL_DIRS = [d for d in SKILL_DIRS if os.path.isdir(d)]

_UI = """<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>NeXify AI Paperclip Factory</title>
<style>
:root{--bg:#0A0A0A;--surface:rgba(255,255,255,0.03);--border:rgba(255,255,255,0.08);--accent:#C8FF00;--text:#FFF;--muted:#A1A1AA}
*{box-sizing:border-box;margin:0}
body{background:var(--bg);color:var(--text);font-family:Manrope,system-ui,sans-serif;min-height:100vh;padding:32px}
.wrap{max-width:880px;margin:0 auto}
.logo{display:flex;align-items:center;gap:12px;margin-bottom:24px}
.logo svg{width:34px;height:34px}
h1{font-family:Outfit,sans-serif;font-size:22px;font-weight:600}
h1 span{color:var(--accent)}
.sub{color:var(--muted);font-size:13px;margin:4px 0 24px}
.card{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:20px;margin-bottom:14px}
.card h2{font-family:Outfit,sans-serif;font-size:15px;font-weight:600;margin-bottom:12px;display:flex;justify-content:space-between}
.badge{color:var(--accent);font-size:12px;font-weight:600}
ul{list-style:none;padding:0}
li{padding:10px 12px;border:1px solid var(--border);border-radius:12px;margin-bottom:8px;display:flex;justify-content:space-between;gap:12px;font-size:13px}
li code{color:var(--accent);word-break:break-all}
.small{color:var(--muted);font-size:12px}
</style></head><body><div class="wrap">
<div class="logo"><svg viewBox="0 0 34 34" fill="none"><rect x="4" y="4" width="11" height="26" rx="3" fill="#d4d4d8"/><rect x="19" y="4" width="11" height="26" rx="3" fill="#fafafa"/><rect x="19" y="4" width="4" height="26" rx="2" fill="#71717a"/><circle cx="26" cy="9" r="3" fill="#C8FF00"/></svg>
<h1>Paperclip <span>Factory</span></h1></div>
<p class="sub">NeXify AI Skill-Source — serviert Skills-Verzeichnisse für alle Agenten.</p>
<div class="card"><h2>Status <span class="badge" id="health">…</span></h2><p class="small" id="dirs"></p></div>
<div class="card"><h2>Skills <span class="badge" id="count">…</span></h2><ul id="skills"></ul></div>
</div>
<script>
fetch('/api/health').then(r=>r.json()).then(d=>{document.getElementById('health').textContent='OK · '+d.service;document.getElementById('dirs').textContent='Skill-Verzeichnisse: '+d.skill_dirs;}).catch(()=>document.getElementById('health').textContent='OFFLINE');
fetch('/api/skills').then(r=>r.json()).then(d=>{document.getElementById('count').textContent=d.count;const ul=document.getElementById('skills');d.skills.forEach(s=>{const li=document.createElement('li');li.innerHTML='<code>'+s.name+'</code><span class="small">'+s.source+'</span>';ul.appendChild(li);});}).catch(()=>{});
</script></body></html>"""

@app.get("/", response_class=HTMLResponse)
def index():
    return _UI

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "paperclip-factory", "skill_dirs": len(SKILL_DIRS)}

@app.get("/api/skills")
def skills():
    out = []
    for d in SKILL_DIRS:
        for name in sorted(os.listdir(d)):
            p = os.path.join(d, name)
            if os.path.isdir(p) and os.path.exists(os.path.join(p, "SKILL.md")):
                out.append({"name": name, "source": d})
    return {"skills": out, "count": len(out)}

# Skill-Inhalte statisch servieren (je Skill-Dir)
for i, d in enumerate(SKILL_DIRS):
    app.mount(f"/skills/{i}", StaticFiles(directory=d, html=True), name=f"skills{i}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=3100)
