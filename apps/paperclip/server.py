"""NeXifyAI Paperclip Factory (:3100) — Skill-Quelle + Dokumenten-API (2026-08-09, Mandat Pascal).

Factory = Skill-Source für alle Agenten (P0): serviert Skills-Verzeichnisse + Health.
Policy-Update: OPENMCP-DECISION 2026-08-02 „revive only with mandate" — Mandat erteilt.
"""
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os, json

app = FastAPI(title="NeXifyAI Paperclip Factory", version="1.0.0")

SKILL_DIRS = [
    "/root/nexify-agentur-plattform/apps/paperclip/skills",
    "/workspace/nexifyai/hermes/skills",
    "/home/hermeswebui/.hermes/skills",
]
SKILL_DIRS = [d for d in SKILL_DIRS if os.path.isdir(d)]

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
