#!/usr/bin/env python3
"""AutoSEO-Pipeline (NeXify, 2026-08-09, nach AutoSEO-Muster getautoseo.com):
1 Artikel/Tag -> /wissen (wissen-articles.ts) -> Commit+Push -> Vercel-Deploy.
DeepSeek via 9Router (ds/deepseek-v4-flash, Think-Max), JSON-Mode.
State: /opt/nexifyai/autoseo/state.json | Log: /var/log/nexifyai/autoseo.log"""
import json, os, re, subprocess, sys, datetime

REPO = "/root/nexify-agentur-plattform"
REGISTRY = f"{REPO}/apps/website/lib/content/wissen-articles.ts"
STATE_FILE = "/opt/nexifyai/autoseo/state.json"
LOG_FILE = "/var/log/nexifyai/autoseo.log"
ROUTER = "http://127.0.0.1:20128/v1/chat/completions"
MODEL = "ds/deepseek-v4-flash"

def log(msg):
    line = f"[{datetime.datetime.now():%Y-%m-%d %H:%M:%S}] {msg}"
    print(line)
    try:
        with open(LOG_FILE, "a") as f:
            f.write(line + "\n")
    except OSError:
        pass

def get_key():
    for p in ("/root/.hermes/.env", "/etc/nexifyai/secrets.env"):
        try:
            for l in open(p):
                if l.startswith("CUSTOM_API_KEY="):
                    return l.strip().split("=", 1)[1]
        except OSError:
            pass
    return os.environ.get("CUSTOM_API_KEY", "")

THEMEN = [
    ("geo-llm-seo-2026", "GEO & LLM-SEO 2026: So werden Sie von ChatGPT empfohlen", "Generative Engine Optimization: Ranking in ChatGPT, Perplexity & KI-Suche – konkret umsetzbar.", "/leistungen", "SEO"),
    ("ki-chatbot-kosten-mittelstand", "Was kostet ein KI-Chatbot für den Mittelstand 2026?", "Chatbot-Kosten für KMU: Baukasten, Agentur, individuell – mit Förderung (go-digital 50 %) und laufenden LLM-Kosten.", "/leistungen/ki-begleiter", "Preise"),
    ("ki-automatisierung-vertrieb", "KI-Automatisierung im Vertrieb: 7 Prozesse mit sofortigem ROI", "Vertriebs-Automation mit KI: Lead-Qualifizierung, Angebote, Follow-ups – messbar ab Tag eins.", "/leistungen/automatisierung", "Automatisierung"),
    ("whatsapp-marketing-2026", "WhatsApp-Marketing 2026: Regeln, Kosten, Alternativen für KMU", "WhatsApp für Business: was erlaubt ist (UWG/DSGVO), was es kostet und wann die Business-Cloud-API Pflicht wird.", "/leistungen", "Marketing"),
    ("ai-agenten-kmu-einstieg", "AI-Agenten im Mittelstand: Einführung ohne Chaos", "Agenten mit Rollen, Freigaben und Protokollen – der sichere Einstieg für KMU.", "/leistungen/ai-agenten", "Agenten"),
    ("website-kosten-2026-kmu", "Website-Kosten 2026: Was KMU realistisch einplanen müssen", "Website-Preise 2026: Agentur, Freelancer, Baukasten – mit Wartungskosten und Fördermitteln.", "/preise", "Preise"),
    ("ki-steuerbuero-2026", "KI im Steuerbüro: Automatisierung statt Überstunden", "Belegerfassung, E-Mail-Triage, Bescheidprüfung: wo KI im Steuerbüro wirklich spart.", "/branchen/steuerberater", "Branchen"),
    ("automation-roi-rechnung", "Automation-ROI: So rechnen Sie richtig", "Die ehrliche ROI-Formel für Automatisierungsprojekte – inklusive versteckter Kosten.", "/preise", "Preise"),
    ("chatgpt-unternehmen-grenzen", "ChatGPT für Unternehmen: Grenzen & Alternativen", "Datenschutz, Halluzinationen, Integration: warum ChatGPT allein selten reicht.", "/leistungen/ki-plattform", "KI-Plattform"),
    ("web-app-kosten-2026", "Web-App-Kosten 2026: Von 5.000 bis 100.000 € – was dahintersteckt", "Web-Apps kosten, was sie lösen: Kostenfaktoren, Lieferzeiten und Festpreis-Fallen.", "/leistungen/web-apps", "Preise"),
    ("geo-llm-seo-2026", "GEO & LLM-SEO 2026: So werden Sie von ChatGPT empfohlen", "Generative Engine Optimization: Ranking in ChatGPT, Perplexity & KI-Suche – konkret umsetzbar.", "/leistungen", "SEO"),
]

def next_thema(state):
    used = state.get("used", [])
    for t in THEMEN:
        if t[0] not in used:
            return t
    return None

def call_ds(prompt):
    key = get_key()
    if not key:
        raise RuntimeError("CUSTOM_API_KEY fehlt")
    body = json.dumps({
        "model": MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "reasoning_effort": "max",
        "response_format": {"type": "json_object"},
        "max_tokens": 8000,
    })
    r = subprocess.run(["curl", "-s", "--max-time", "600", ROUTER,
                        "-H", f"Authorization: Bearer {key}",
                        "-H", "Content-Type: application/json", "-d", body],
                       capture_output=True, text=True)
    raw = r.stdout
    idx = raw.find("{")
    if idx < 0:
        raise RuntimeError(f"Kein JSON: {raw[:200]}")
    d, _ = json.JSONDecoder().raw_decode(raw[idx:])
    content = d["choices"][0]["message"].get("content", "")
    return json.loads(content)

PROMPT = """Du bist SEO-Content-Autor für die deutsche B2B-KI-Agentur NeXify AI (www.nexifyai.cloud, Venlo/NL, Zielgruppe DACH-KMU). Schreibe einen Experten-Artikel nach dem Muster der besten SEO-Agenturen: 1.500+ Wörter, Fachkenntnis, Quellen, Anti-Robot-Qualität ("If you wouldn't share it on LinkedIn, it's not good enough").

Thema: {title}
Zielseite (interner CTA): {ziel}

FORMAT (ausschließlich JSON, keine Markdown-Umrandung):
{{
 "slug": "{slug}",
 "title": "{title}",
 "tag": "{tag}",
 "readTime": "8 Min.",
 "description": "Max. 160 Zeichen, Meta-Beschreibung mit Keyword.",
 "excerpt": "Max. 200 Zeichen, Teaser.",
 "body": ["6-9 Absätze à 150-250 Wörter als separate Strings. Absatz 1: Antwort-zuerst auf die Kernfrage. Danach: Marktdaten mit konkreten Zahlen und Quellen in Klammern (z.B. 'laut Marktbenchmark DACH-KI 2026'). Mindestens 3 interne Links als [Label](/pfad): [Leistungen](/leistungen), [Preise](/preise), [Kontakt](/kontakt?utm_source=wissen&utm_medium=artikel&utm_campaign={slug}) und die Zielseite {ziel}. Absatz 1-2: 449-Euro-Tagessatz von NeXify AI nennen."],
 "faqs": [{{"q": "Frage 1?", "a": "Antwort 1"}}, {{"q": "Frage 2?", "a": "Antwort 2"}}, {{"q": "Frage 3?", "a": "Antwort 3"}}],
 "sections": [{{"h2": "Frage als H2-Überschrift?", "answer": "Antwort-zuerst, 1-2 Sätze"}}, {{"h2": "Zweite Frage?", "answer": "Antwort"}}, {{"h2": "Dritte Frage?", "answer": "Antwort"}}]
}}
Regeln: KEINE erfundenen Zahlen ohne Quelle. KEINE medizinischen/legalen Zusicherungen (YMYL-vorsichtig). Deutsch, sachlich, kein Buzzword-Geschwafel. Kein Wettbewerber-Bashing. Max. 1 Erwähnung von ChatGPT-Konkurrenten pro Absatz."""

def main():
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    state = {}
    try:
        state = json.load(open(STATE_FILE))
    except OSError:
        pass
    thema = next_thema(state)
    if not thema:
        # Zyklus zurücksetzen
        state["used"] = []
        thema = THEMEN[0]
    slug, title, desc, ziel, tag = thema
    log(f"Start: {slug}")
    try:
        art = call_ds(PROMPT.format(slug=slug, title=title, ziel=ziel, tag=tag))
    except Exception as e:
        log(f"FEHLER DeepSeek: {e}")
        sys.exit(1)
    # Slug-Konflikt-Check
    reg = open(REGISTRY, encoding="utf-8").read()
    if f'slug: "{slug}"' in reg:
        log(f"Slug existiert bereits: {slug} — Abbruch")
        sys.exit(2)
    frag = f"""  {{
    slug: "{art['slug']}",
    tag: "{art.get('tag', tag)}",
    readTime: "{art.get('readTime', '8 Min.')}",
    title: "{art['title']}",
    description:
      "{art['description']}",
    excerpt:
      "{art['excerpt']}",
    datePublished: "{datetime.date.today():%Y-%m-%d}",
    dateModified: "{datetime.date.today():%Y-%m-%d}",
    body: [
"""
    for p in art["body"]:
        frag += f"      {json.dumps(p, ensure_ascii=False)},\n"
    frag += "    ],\n"
    if art.get("faqs"):
        frag += "    faqs: [\n"
        for f_ in art["faqs"]:
            frag += f"      {{ q: {json.dumps(f_['q'], ensure_ascii=False)}, a: {json.dumps(f_['a'], ensure_ascii=False)} }},\n"
        frag += "    ],\n"
    if art.get("sections"):
        frag += "    sections: [\n"
        for s_ in art["sections"]:
            frag += f"      {{ h2: {json.dumps(s_['h2'], ensure_ascii=False)}, answer: {json.dumps(s_['answer'], ensure_ascii=False)} }},\n"
        frag += "    ],\n"
    frag += "  },\n"
    # Insert vor schliessendem ];
    idx = reg.rfind("];")
    if idx < 0:
        log("Registry-Ende nicht gefunden")
        sys.exit(3)
    new_reg = reg[:idx] + frag + reg[idx:]
    open(REGISTRY, "w", encoding="utf-8").write(new_reg)
    # State
    state.setdefault("used", []).append(slug)
    json.dump(state, open(STATE_FILE, "w"))
    log(f"Artikel eingefuegt: {slug} ({len(art['body'])} Absaetze)")
    # Commit + Push (sync-gitlab -> main)
    r = subprocess.run(["git", "-C", REPO, "checkout", "sync-gitlab"], capture_output=True, text=True)
    r = subprocess.run(["git", "-C", REPO, "add", "apps/website/lib/content/wissen-articles.ts"], capture_output=True, text=True)
    r = subprocess.run(["git", "-C", REPO, "commit", "-m", f"AutoSEO: /wissen Artikel {slug} ({datetime.date.today()})"], capture_output=True, text=True)
    if "nothing to commit" in r.stdout + r.stderr:
        log("Commit leer (unexpected)")
    r = subprocess.run(["git", "-C", REPO, "push", "origin", "sync-gitlab:main"], capture_output=True, text=True)
    ok = r.returncode == 0
    log(f"Push: {'OK' if ok else 'FEHLER: ' + r.stderr[-200:]}")
    # Telegram
    try:
        env = {}
        for l in open("/etc/nexifyai/hermes.env"):
            if l.startswith("TELEGRAM_BOT_TOKEN=") or l.startswith("TELEGRAM_HOME_CHANNEL="):
                k, v = l.strip().split("=", 1)
                env[k] = v
        msg = f"📝 AutoSEO: Artikel live gestellt — {art['title']}\nhttps://www.nexifyai.cloud/wissen/{art['slug']}"
        subprocess.run(["curl", "-s", "--max-time", "20", "-F", f"chat_id={env.get('TELEGRAM_HOME_CHANNEL','')}",
                        "--form-string", f"text={msg}",
                        f"https://api.telegram.org/bot{env.get('TELEGRAM_BOT_TOKEN','')}/sendMessage"],
                       capture_output=True)
    except OSError:
        pass
    log("Fertig")

if __name__ == "__main__":
    main()
