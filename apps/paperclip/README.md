# Paperclip

**Paperclip** ist die interne Dokumentenverarbeitungs- und Dateimanagement-Komponente der NeXify-Plattform.

## Zweck

Paperclip übernimmt:
- Strukturierte Verarbeitung eingehender Dokumente (PDFs, Verträge, Angebote)
- Extraktion und Indexierung von Inhalten für LightRAG / Wissensgraph
- Anbindung an den Hermes-Backend für automatisierte Dokumenten-Workflows
- Bereitstellung von Dokument-APIs für das Kundenportal (`/konto`)

## Status

> **Planned — noch nicht implementiert.**  
> Die Komponente ist architektonisch geplant und in der Hermes-Infrastruktur referenziert.  
> Implementierung startet sobald die Kernflüsse (Vitrine + Backend) stabil laufen.

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
