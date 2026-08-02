# FILE: docs/gtm/NEUKUNDEN-BEGEISTERUNG.md
# NIR: 02.08.2026 11:20
# SESSION: neukunden-begeisterung-7dd5

## P0-Prinzip

**Neukunden sind das Wichtigste und müssen stets begeistert werden.**

Jeder Agent-Task: *Hilft das Neukunden zu gewinnen oder zu begeistern?* Sonst depriorisieren.

## Rollen-Trennung (Koordination)

| Agent / Scope | Verantwortung |
|---------------|---------------|
| **Zero-Cost Leads** (Cursor agent `bc2da7d5`, Branch `cursor/zero-cost-leads-mailing-7dd5`) | Öffentliche Lead-Discovery, Queue, compliant Outbound-Mailing, Playbook |
| **Neukunden-Begeisterung** (dieser Track) | Post-Contact / Post-Booking Delight, Speed-Promise, Portal-Onboarding, Confirmation-Mails |

Kein doppeltes Scraping. Outbound-Templates sollen auf `/rueckruf`, `/kontakt`, `/danke?variant=…` verlinken.

## Journey — wie Delight sichtbar wird

```
First Touch          Delight Surface              Expectation
─────────────        ─────────────────            ────────────
/kontakt submit  →   DelightSuccess inline        Ziel ≤ 1 Werktag + Follow-up Pascal
/rueckruf book   →   booking-success panel        Termin + Kalender/Mail + WhatsApp
Chat Angebot     →   offer-success + /danke       Angebot unterwegs + persönlich
Lead-Magnet*     →   /danke?variant=lead_magnet   Checkliste folgt (ehrlicher Stub)
/konto leer      →   Premium Empty State          Guided next steps
E-Mail confirm   →   ONBOARDING templates         Links zu Rückruf / Portal
```

\* `/checkliste` kann parallel in Acquisition-PR landen — Delight-Komponenten sind wiederverwendbar.

## Human-gated

- Testimonial-Permission: Issue **#211**
- Video Case Study: Issue **#231**

## Hard Stops

Keine Fake-Reviews/Kennzahlen, keine Paid Ads, kein Hermes-Cutover, keine Secrets in Git.
