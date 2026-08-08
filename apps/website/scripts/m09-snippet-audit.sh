#!/usr/bin/env bash
# FILE: /root/nexify-agentur-plattform/apps/website/scripts/m09-snippet-audit.ts
# NIR: 08.08.2026 15:15
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: M-09 Audit — Title-Muster + Description-CTA + UTM-Pflicht in Website-Sourcen
# WHY: Prüfverfahren des Kanban-Tasks t_d3a3f169 (Stichprobe, Negativfall-Test, Link-Check)
# DEPENDS: apps/website (grep über app/ components/ lib/)
# DOCS-REF: docs/plans/FREWERT-MARKETING-MASSNAHMENKATALOG-2026-08-08.md M-09

echo "== TITEL-OHNE-BRAND (negativ: Titel ohne '| NeXify AI' oder 'NeXify AI')"
grep -rn 'title:' app components lib --include='*.tsx' --include='*.ts' \
  | grep -v node_modules \
  | grep -v 'ogTitle\|appleWebApp\|template' \
  | grep -vi 'neXify\|query\|undefined\|title: {' \
  | head -30

echo
echo "== TITEL-MUSTER GRATIS (soll: '[Kernleistung] [Ort] » Gratis …')"
grep -rn '» Gratis' app lib components --include='*.tsx' --include='*.ts' | grep -v node_modules

echo
echo "== UTM-DEFIZIT: CTA-Links zu /kontakt, /rueckruf, /audit, /preise OHNE utm_"
grep -rn 'href="/\(kontakt\|rueckruf\|audit\|preise\|checkliste\)"' app components --include='*.tsx' \
  | grep -v node_modules | grep -v 'utm' | head -40

echo
echo "== UTM-MEDIUM-FEHLT (utm_ ohne utm_medium)"
grep -rno 'utm_source=[a-z_-]*' app components lib --include='*.tsx' --include='*.ts' | grep -v node_modules | head -40
