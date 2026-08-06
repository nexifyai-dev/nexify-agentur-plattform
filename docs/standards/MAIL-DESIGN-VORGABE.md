# MAIL-DESIGN-VORGABE — v1.0 (2026-08-06, Pascal-Direktive)

> **Verbindlich für ALLE E-Mails von NeXify AI** — Resend UND Hostinger-SMTP,
> Angebote, Kundenportal-Einladungen, Follow-ups, Erstkontakt-/Kampagnen-Mails,
> Unsubscribe-Seite. Kein anderes Design ist erlaubt.

## Referenz-HTML (exakt)

Das folgende HTML ist das **einzige erlaubte Mail-Design** (Kiosk-Angebot als
Beispiel). Es stammt aus der Angebotsgenerierung (Resend) und wurde von Pascal
am 2026-08-06 als Vorgabe freigegeben — **nur das Logo wurde durch das
systemweite CI-Logo ersetzt** (LogoMark-PNG + Wortmarke, Lime X #C8FF00,
„AI" #9E9E9E fw300; vorher Georgia-Textlogo mit silbernem X).

```html
<!doctype html><html><body style="margin:0;padding:0;background:#0a0a0a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 12px;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#111114;border:1px solid #26262b;border-radius:16px;overflow:hidden;">
<tr><td style="padding:32px 32px 20px;border-bottom:1px solid #26262b;">
  <div style="display:flex;align-items:center;gap:12px;"><img src="https://www.nexifyai.cloud/logo-mark.png" alt="NeXify" width="34" height="34" style="display:block;width:34px;height:34px;border:0;border-radius:8px;"><div style="font-family:Outfit,Arial,sans-serif;font-size:24px;color:#ffffff;letter-spacing:1px;">Ne<span style="color:#C8FF00;font-weight:700;">X</span>ify <span style="color:#9E9E9E;font-weight:300;">AI</span></div></div>
  <div style="font-family:Manrope,Arial,sans-serif;font-size:11px;color:#71717a;letter-spacing:3px;text-transform:uppercase;padding-top:6px;">Unverbindliches Angebot</div>
</td></tr>
<!-- INHALT: Sections als <tr><td>… (Title, Intro, Summary, Leistungstabelle, Empfehlung, Annahmen, Nächste Schritte, CTA, Legal) -->
<tr><td style="padding:20px 32px;border-top:1px solid #26262b;font-family:Manrope,Arial,sans-serif;color:#52525b;font-size:11px;line-height:1.7;">
NeXify AI by NeXify – chat it. Automate it. · Pascal Courbois<br/>Graaf van Loonstraat 1E · 5921 JA Venlo · NL · KvK 90483944 · BTW NL865786276B01<br/>mail@nexifyai.cloud · +31 6 133 188 56
</td></tr>
</table></td></tr></table></body></html>
```

## Design-Tokens

| Token | Wert |
|---|---|
| Seiten-BG | `#0a0a0a` (Outer Padding 32px 12px) |
| Karte | `#111114`, Border `#26262b`, Radius `16px`, max-width `600px` |
| Logo | `https://www.nexifyai.cloud/logo-mark.png` 34×34, Wortmarke Outfit 24px |
| Logo-X | `#C8FF00`, `font-weight:700` |
| Logo-AI | `#9E9E9E`, `font-weight:300` |
| Label-Zeile | Manrope 11px, `#71717a`, letter-spacing 3px, uppercase, padding-top 6px |
| Schrift | Manrope/Outfit mit Arial-Fallback (NIE Georgia fürs Logo) |
| CTA | Pill `#C8FF00`-BG, Text `#0A0A0A`, fw700 |
| Footer | Manrope 11px `#52525b`, border-top `#26262b`, Impressum (Pflicht) |
| Dark-Mode-Meta | `<meta name="color-scheme" content="light dark">` + `supported-color-schemes` |

## Pflichten

1. **Einziges Logo**: LogoMark-PNG + Wortmarke wie oben. Kein Georgia-Textlogo,
   kein `#c0c0c8`-X, kein `NeXifyAI`-Textspan als Marke.
2. **Impressum-Footer immer** (KvK, BTW, Adresse, Kontakt).
3. **HTML + Plain-Text (multipart/alternative)** bei jedem Versand — Resend
   `text:`-Parameter, SMTP `MIMEMultipart("alternative")`. Verhindert Spam-Filter.
4. **Dark-Mode-Meta** in `<head>`.
5. **List-Unsubscribe**-Header bei SMTP (Hostinger), `X-Mailer` gesetzt.
6. **Implementierung**: EINE kanonische `mail_shell(label, body_html)`-Funktion
   pro Codebasis — Backend `backend/server.py`, Outreach `scripts/outreach/templates_de.py`,
   Leads `scripts/leads/templates_ai_begleiter.py`. Neue Mail-Flows IMMER über
   die Shell, nie eigene Layouts bauen.

## Implementierungs-Stand (2026-08-06, E2E 72/72 PASS)

| Pfad | Datei | Status |
|---|---|---|
| Angebots-Mail | `offer_email_html()` backend/server.py | ✅ Shell |
| Kundenportal-Invite | `ci_email()` backend/server.py | ✅ Shell |
| Follow-up | `followup_email_html()` backend/server.py | ✅ Shell |
| Kampagne (Erstkontakt) | `/campaign/send` backend/server.py | ✅ Shell (war hell!) |
| Outreach DE | `build_html_body()` scripts/outreach/templates_de.py | ✅ Shell |
| Leads AI-Begleiter | `build_html_body()` scripts/leads/templates_ai_begleiter.py | ✅ Shell |
| GTM-Kampagne | `build_html_body()` scripts/gtm/competitor_angle_templates_de.py | ✅ Shell |
| Kontakt-Bestätigung | Website-Anfrage-Endpoint backend/server.py (ci_email) | ✅ Shell |
| Unsubscribe-Seite | apps/website/app/api/outreach/unsubscribe/route.ts | ✅ CI-Logo |
| Resend-Versand | `send_email()` — `text:`-Parameter | ✅ |
| SMTP-Fallback | `_smtp_send()` — multipart + List-Unsubscribe | ✅ |

E2E: `/tmp/e2e_mail_design.py` (AST-basierter Test, 85 Checks: Design-Tokens,
Logo-Marker, keine Georgia/c0c0c8/hellen-Wrapper, Plain-Text-Erzeugung).
