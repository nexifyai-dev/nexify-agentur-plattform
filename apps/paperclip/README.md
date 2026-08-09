# Paperclip

**Paperclip** ist die interne Dokumentenverarbeitungs- und Dateimanagement-Komponente der NeXify-Plattform.

## Zweck

Paperclip übernimmt:
- Strukturierte Verarbeitung eingehender Dokumente (PDFs, Verträge, Angebote)
- Extraktion und Indexierung von Inhalten für LightRAG / Wissensgraph
- Anbindung an den Hermes-Backend für automatisierte Dokumenten-Workflows
- Bereitstellung von Dokument-APIs für das Kundenportal (`/konto`)

## Status

> **LIVE seit 2026-08-09 (Pascal-Mandat):** Paperclip Factory auf `127.0.0.1:3100` (systemd `nexifyai-paperclip.service`). Serviert `GET /api/health`, `GET /api/skills` (Skill-Quelle P0) und Skills statisch unter `/skills/{n}`. Quellcode: `server.py` (FastAPI).

## Geplante Technologie

- **Runtime:** Python 3.11 (FastAPI) oder Node.js (abhängig von finaler Entscheidung)
- **Storage:** Supabase Storage / S3-kompatibel
- **Parsing:** `reportlab` (PDF-Generierung), `pdfminer` / `PyMuPDF` (PDF-Extraktion)
- **Integration:** LightRAG Indexierung, Hermes API

## Abhängigkeiten

| Abhängigkeit | Beschreibung |
|---|---|
| `backend/` | Hauptbackend — liefert Auftragskontext |
| `apps/hermes` | Wissenssystem — empfängt indexierte Dokument-Inhalte |
| LightRAG `:9621` | Wissengraph — speichert extrahierte Entitäten |

## Entwicklung starten

Sobald die Komponente implementiert ist:

```bash
# Installation
pip install -r requirements.txt

# Entwicklungsserver
uvicorn server:app --reload --port 8100
```

## Verwandte Dokumente

- [`docs/architecture/`](../../docs/architecture/) — Systemarchitektur
- [`apps/hermes/`](../hermes/) — Wissens- und Memory-System
- [`backend/`](../../backend/) — Haupt-API-Backend
