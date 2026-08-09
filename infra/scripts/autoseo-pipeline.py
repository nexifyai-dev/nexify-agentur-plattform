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
    ("ki-beratung-kosten-2026", "KI-Beratung Kosten 2026: Was Berater wirklich verlangen", "Marktpreise für KI-Beratung und Strategie in DACH – mit Förderung und Tagessatz-Vergleich.", "/preise", "Preise"),
    ("ki-agentur-was-kostet", "KI-Agentur: Was kostet ein KI-Projekt wirklich?", "Projektkosten für KI-Agenturen 2026: Chatbots, Automatisierung, Agenten – transparent kalkuliert.", "/preise", "Preise"),
    ("chatbot-oder-mensch", "Chatbot oder Mensch? Wo KI im Support wirklich spart", "KI-Chatbots vs. menschlichen Support: Kosten, Qualität, hybride Modelle für KMU.", "/leistungen/ki-begleiter", "Automatisierung"),
    ("lead-qualifizierung-ki", "Lead-Qualifizierung mit KI: Mehr Termine in weniger Zeit", "Automatische Lead-Bewertung und Erstkontakt – konkret für Handwerk, Kanzleien und Agenturen.", "/leistungen", "Vertrieb"),
    ("e-mail-automatisierung-kmu", "E-Mail-Automatisierung für KMU: 5 Workflows mit ROI", "Drip-Kampagnen, Follow-ups und Willkommens-Serien – DSGVO-konform und messbar.", "/leistungen", "Automatisierung"),
    ("rechnungswesen-automatisierung", "Buchhaltung automatisieren: Belege, Rechnungen, Abgleich", "Automatisierte Buchhaltung für kleine Unternehmen: was heute schon Standard ist.", "/leistungen", "Automatisierung"),
    ("terminbuchung-ki", "Terminbuchung automatisieren: Kalender, Erinnerungen, No-Shows", "Online-Terminbuchung mit KI-Erinnerungen – weniger No-Shows, mehr Umsatz.", "/leistungen", "Automatisierung"),
    ("kundenservice-ki-2026", "Kundenservice mit KI: Kosten, Tools, Einstieg", "KI im Kundenservice: Ticket-Triage, FAQ-Bots, Mitarbeiter-Assistenz – mit Preisen.", "/leistungen/ki-begleiter", "Branchen"),
    ("ki-fuer-handwerker", "KI für Handwerker: Angebote, Termine, Nachfassen", "Praktische KI-Einsätze im Handwerk: Angebotserstellung, Auftrags-Tracking, Bewertungen.", "/branchen/handwerk", "Branchen"),
    ("ki-fuer-kanzleien", "KI für Kanzleien und Steuerbüros: konkret umsetzbar", "Steuerkanzlei-Automation: Belegerfassung, E-Mail-Triage, Fristen – DSGVO-sicher.", "/branchen/steuerberater", "Branchen"),
    ("ki-fuer-agenturen", "KI für Werbeagenturen: Mehr Output, gleiches Team", "KI-Workflows für Agenturen: Content, Reporting, Projektmanagement.", "/branchen", "Branchen"),
    ("ki-fuer-e-commerce", "KI im E-Commerce: Shop, Support, Retouren", "KI-Anwendungen für Onlineshops: Produkttexte, Preise, Support-Automation.", "/leistungen/webshops", "Branchen"),
    ("ki-fuer-immobilien", "KI für Immobilienmakler: Exposés, Leads, Besichtigungen", "Immobilien-KI: automatische Exposés, Lead-Pflege, Besichtigungs-Koordination.", "/branchen", "Branchen"),
    ("ki-fuer-gastronomie", "KI in der Gastronomie: Reservierungen, Bewertungen, Einkauf", "Gastro-KI: Reservierungs-Bot, Bewertungs-Management, Bestellprognosen.", "/branchen", "Branchen"),
    ("ki-fuer-medizinpraxen", "KI für Arztpraxen: Termine, Dokumentation, Patientenkommunikation", "Praxen-Automation: Termin-Erinnerungen, Dokumentation, Entlassbriefe – compliant.", "/branchen", "Branchen"),
    ("ki-fuer-logistik", "KI in Logistik und Versand: Sendungen, Prognosen, Dokumente", "Logistik-KI: Versanddokumente, Lieferprognosen, Lageroptimierung.", "/branchen", "Branchen"),
    ("ki-fuer-vereine", "KI für Vereine und Verbände: Mitglieder, Events, Spenden", "Vereins-KI: Mitgliederkommunikation, Event-Anmeldungen, Spenden-Dankes automatisiert.", "/branchen", "Branchen"),
    ("dsgvo-ki-chatbot", "DSGVO und KI-Chatbots: Was 2026 erlaubt ist", "Datenschutzkonforme KI-Bots: Auftragsverarbeitung, Drittland, Hinweispflichten.", "/datenschutz", "Recht"),
    ("ki-sicherheit-unternehmen", "KI-Sicherheit für Unternehmen: 10 konkrete Maßnahmen", "Prompt-Injection, Datenlecks, Berechtigungen: KI sicher betreiben.", "/leistungen", "Sicherheit"),
    ("prompt-engineering-basics", "Prompt-Engineering: 12 Muster für bessere KI-Ergebnisse", "Praktische Prompt-Muster für den Arbeitsalltag – mit Beispielen für Vertrieb und Support.", "/leistungen", "KI-Plattform"),
    ("rag-wissensbasis-aufbau", "RAG-Wissensbasis aufbauen: Von PDFs zu Antworten", "Retrieval-Augmented Generation: Daten aufbereiten, Chunks, Embeddings – Leitfaden.", "/leistungen/ki-begleiter", "KI-Plattform"),
    ("ki-mitarbeiter-einarbeiten", "KI für Mitarbeiter: Einarbeitung, Schulung, Akzeptanz", "KI-Rollout im Team: Schulung, Playbooks, Akzeptanz – ohne Überforderung.", "/leistungen", "Organisation"),
    ("ki-foerderung-2026", "KI-Förderung 2026: go-digital, BAFA, KfW – Überblick", "Förderprogramme für KI-Projekte in DACH: Voraussetzungen, Antrag, Kombination.", "/preise", "Preise"),
    ("ki-prozessanalyse", "Prozessanalyse mit KI: Wo sich Automatisierung lohnt", "Prozessaudit: Kandidaten für Automatisierung finden und priorisieren.", "/audit", "Prozess"),
    ("chatgpt-business-alternativen", "ChatGPT Business-Alternativen 2026: Vergleich für KMU", "ChatGPT vs. spezialisierte KI-Plattformen: Datenschutz, Integration, Kosten.", "/leistungen/ki-plattform", "KI-Plattform"),
    ("web-app-ki-integration", "Web-App mit KI: Integration von LLMs Schritt für Schritt", "KI-Funktionen in Web-Apps: Architektur, Kosten, Latenz, Qualität.", "/leistungen/web-apps", "Web-Apps"),
    ("onlineshop-ki-2026", "Onlineshop mit KI 2026: Trends, Tools, Kosten", "KI im Shop: Personalisierung, Suche, Retouren-Prognose – was sich rechnet.", "/leistungen/webshops", "Branchen"),
    ("ki-tagessatz-vergleich", "Tagessatz oder Festpreis? KI-Projekte richtig kalkulieren", "Preismodelle für KI-Projekte: Tagessatz, Festpreis, Sprint – Vor- und Nachteile.", "/preise", "Preise"),
    ("kmu-digitalisierung-2026", "KMU-Digitalisierung 2026: Die 10 wichtigsten Schritte", "Digitalisierungs-Roadmap für kleine Unternehmen: von der Website bis zu KI-Agenten.", "/leistungen", "Organisation"),
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
        "max_tokens": 12000,
    })
    last = None
    for attempt in range(3):
        r = subprocess.run(["curl", "-s", "--max-time", "600", ROUTER,
                            "-H", f"Authorization: Bearer {key}",
                            "-H", "Content-Type: application/json", "-d", body],
                           capture_output=True, text=True)
        raw = r.stdout
        idx = raw.find("{")
        if idx < 0:
            last = RuntimeError(f"Kein JSON: {raw[:150]}")
            continue
        try:
            d, _ = json.JSONDecoder().raw_decode(raw[idx:])
            content = d["choices"][0]["message"].get("content", "").strip()
        except Exception as e:
            last = RuntimeError(f"Response-Parse: {e}")
            continue
        if not content:
            last = RuntimeError("Leerer Content (JSON-Mode) — Retry")
            continue
        try:
            return json.loads(content)
        except Exception as e:
            last = RuntimeError(f"Content kein JSON ({len(content)} Zeichen): {e}")
            continue
    raise last

PROMPT = """Du bist SEO-Content-Autor für die deutsche B2B-KI-Agentur NeXify AI (www.nexifyai.cloud, Venlo/NL, Zielgruppe DACH-KMU). Schreibe einen Experten-Artikel nach dem Muster der besten SEO-Agenturen: 1.500+ Wörter, Fachkenntnis, Quellen, Anti-Robot-Qualität ("If you wouldn't share it on LinkedIn, it's not good enough").

Thema: {title}
Zielseite (interner CTA): {ziel}

FORMAT (ausschließlich JSON, keine Markdown-Umrandung, keine Erklärungen — antworte NUR mit dem JSON-Objekt):
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
    social_share(art)
    log("Fertig")


def social_share(art):
    """Facebook + Instagram-Post (AutoSEO, Pascal 2026-08-09). Tokens aus hermes.env;
    fehlen sie, wird uebersprungen (Log). Token-Beschaffung: ZK §12a."""
    try:
        env = {}
        for l in open("/etc/nexifyai/hermes.env"):
            if "=" in l and not l.startswith("#"):
                k, v = l.strip().split("=", 1)
                env[k] = v
    except OSError:
        return
    page_token = env.get("META_PAGE_TOKEN", "")
    page_id = env.get("META_PAGE_ID", "")
    ig_id = env.get("IG_BUSINESS_ID", "")
    url = f"https://www.nexifyai.cloud/wissen/{art['slug']}"
    msg = f"Neu im Wissen-Blog: {art['title']}\n{url}"
    if page_token and page_id:
        r = subprocess.run(["curl", "-s", "--max-time", "30",
                            "-X", "POST",
                            f"https://graph.facebook.com/v22.0/{page_id}/feed",
                            "-d", f"message={msg}",
                            "-d", f"access_token={page_token}"],
                           capture_output=True, text=True)
        ok = "error" not in r.stdout
        log(f"FB-Post: {'OK' if ok else r.stdout[:120]}")
    else:
        log("Social-Skip: META_PAGE_TOKEN/META_PAGE_ID fehlen (ZK §12a Anleitung)")
    if page_token and ig_id:
        # IG: Bild als Media-Container, dann publish
        img = f"https://www.nexifyai.cloud/og-image.png"
        r = subprocess.run(["curl", "-s", "--max-time", "30",
                            "-X", "POST",
                            f"https://graph.facebook.com/v22.0/{ig_id}/media",
                            "-d", f"image_url={img}",
                            "-d", f"caption={msg}",
                            "-d", f"access_token={page_token}"],
                           capture_output=True, text=True)
        try:
            cid = json.loads(r.stdout).get("id", "")
            if cid:
                subprocess.run(["curl", "-s", "--max-time", "30", "-X", "POST",
                                f"https://graph.facebook.com/v22.0/{ig_id}/media_publish",
                                "-d", f"creation_id={cid}",
                                "-d", f"access_token={page_token}"], capture_output=True, text=True)
                log("IG-Post: OK")
        except Exception as e:
            log(f"IG-Post fehlgeschlagen: {e} | {r.stdout[:120]}")
    else:
        log("Social-Skip: IG_BUSINESS_ID fehlt")

if __name__ == "__main__":
    main()
