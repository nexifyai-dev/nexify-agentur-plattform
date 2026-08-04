# FILE: /docs/gtm/REFERRAL-PROGRAMM-WARM-INTRO_V1.md
# NIR: 04.08.2026 09:41
# UPDATED: 04.08.2026 09:41
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Referral-Programm — Warm-Intro-only, kein Paid SaaS, kein Cold-Outreach (#256)
# WHY: Persönliche Empfehlungen = höchste Conversion bei null Werbekosten
# BEST-PRACTICE: Warm Intro bevorzugen; kein Abo-Druck; Hinweis-Share nur bei realisiertem Auftrag
# PITFALL: V-GTM-REF-01: Kein Cold Email (Abgrenzung #256); V-GTM-REF-02: Kein SaaS-Referral-Tool
# DEPENDS: PARTNER-WHITELABEL-INTRO-PLAYBOOK_V1.md (#206), Lead-Pipeline, /rueckruf
# DOCS-REF: docs/gtm/ONGOING-GAP-AND-ACQUISITION-RADAR.md (A15)
# SESSION: gtm-referral-linkedin-ihk-7dd5

# Referral-Programm — Warm Intro (NeXify AI)

**Scope:** Persönliche Empfehlung durch Netzwerk, Partner und Bestandskunden.  
**Kein Paid SaaS** (kein ReferralHero, kein Growsurf o. ä.).  
**Kein Cold Email** (Abgrenzung Issue #256).  
**Basis:** Tagessatz 449 € netto; service area DACH + NL.

---

## 1. Grundprinzip

Ein Referral ist eine namentliche Warm-Intro: „Ich kenne jemanden, den das interessiert — darf ich euch verbinden?" Erst nach dieser Erlaubnis erfolgt Kontakt.

| Typ | Wer gibt Empfehlung | Wer empfängt |
|-----|---------------------|-------------|
| Kunden-Referral | Zufriedener Bestandskunde | Sein Kontakt im Netzwerk |
| Partner-Referral | Steuerberater, SEO-Freelancer, Buchhalter, WordPress-Dev | Deren KMU-Kunden |
| Netzwerk-Referral | LinkedIn-/Xing-Kontakte | Kolleginnen/Kollegen |

---

## 2. Incentive-Modell (kein Abo, kein Gutschein-Chaos)

| Auftragswert (netto) | Referral-Dankeschön |
|----------------------|---------------------|
| < 1.000 € | Persönliche Danks-Nachricht; optional: ein kostenloser Beratungs-Call (30 min) |
| 1.000 – 4.999 € | 5 % des Nettoumsatzes als Gutschrift auf nächsten NeXify-Auftrag ODER Amazon-Gutschein |
| ≥ 5.000 € | 7 % Nettoumsatz, Gutschrift oder Überweisung nach Rechnungsstellung |

**Regel:** Dankeschön erst nach vollständiger erster Rechnung & Zahlung des empfohlenen Kunden.  
**Keine Auszahlung vorab**, keine Abo-Pflicht, keine Plattform-Registrierung.

---

## 3. Prozess Schritt für Schritt

```
[Kunde/Partner] → Warm-Intro via LinkedIn/E-Mail/WhatsApp
       ↓
[Pascal empfängt Intro] → Antwort binnen 24h
       ↓
[Erstgespräch /rueckruf] → Angebot → Auftrag
       ↓
[Rechnung bezahlt] → Dankeschön an Empfehlenden
       ↓
[Lead-Pipeline: status = referral-closed]
```

---

## 4. Skripte

### 4a. Anfrage an Bestandskunden (nach erfolgreichem Projekt)

> Betreff: Kurze Frage — kennen Sie jemanden?
>
> Guten Tag {{Vorname}},
>
> vielen Dank, dass das Projekt mit Ihnen so gut geklappt hat.
> Eine kurze Frage: Kennen Sie jemanden in Ihrem Umfeld — Geschäftspartner, befreundeter Unternehmer — der gerade eine Website, Automatisierung oder KI-Lösung sucht?
>
> Eine kurze Erwähnung oder Intro reicht völlig — kein Druck, kein Spam für Ihren Kontakt.
> Als Dankeschön erhalten Sie eine Gutschrift auf Ihren nächsten NeXify-Auftrag.
>
> Herzliche Grüße
> Pascal Courbois · NeXify AI · mail@nexifyai.cloud

### 4b. Partner-Intro-Template (an Steuerberater, SEOs etc.)

Siehe `drafts/partner-warm-intro.md` (aus #206 übernommen).

### 4c. Intro-Nachricht an empfohlenen Kontakt

> Guten Tag {{Empfänger}},
>
> {{Empfehlender}} hat mir Ihren Kontakt gegeben — mit dem Hinweis, dass Sie sich gerade mit [Thema] beschäftigen.
>
> Ich bin Pascal von NeXify AI: Website, Automatisierung und KI-Agenten für KMU — Tagessatz 449 € netto, ohne Vertragslaufzeit.
>
> Wenn 15 Minuten reichen für einen kurzen Überblick, freue ich mich:
> https://www.nexifyai.cloud/rueckruf
>
> Viele Grüße
> Pascal Courbois

---

## 5. Tracking

| Feld | Wert |
|------|------|
| Lead-Quelle | `referral-warm` |
| Status-Werte | `intro-sent` · `gespräch` · `angebot` · `closed-won` · `closed-lost` |
| Dankeschön-Status | `pending` · `ausgestellt` |
| Datei | Lead-Pipeline (intern) |

Kein externes Referral-Tool. Tracking erfolgt in der internen Lead-Pipeline (Spalte `referral_by`).

---

## 6. Abgrenzung

| Dieser Track | Nicht dieser Track |
|--------------|--------------------|
| Warm Intro (persönlich) | Cold Email (#256 — separates Playbook) |
| Kein Ad-Spend | Paid Referral Ads |
| Kein SaaS-Abo | Referral-Plattformen (ReferralHero etc.) |
| Partner-Referral | Partner-Whitelabel-SaaS (#206) |

---

## 7. Nächste Schritte (Human-Gate)

- [ ] Bestandskunden-Liste prüfen: wer hat bisher Projekt abgeschlossen? → erste Anfrage-Welle
- [ ] Partner-Liste (aus #206) → Referral-Hinweis in Intro-E-Mail ergänzen
- [ ] Tracking-Spalte `referral_by` in Lead-Pipeline anlegen
- [ ] Dankeschön-Prozess testen mit erstem Referral-Abschluss
