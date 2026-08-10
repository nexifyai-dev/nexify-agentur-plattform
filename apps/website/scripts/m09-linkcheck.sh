#!/usr/bin/env bash
# FILE: /root/nexify-agentur-plattform/apps/website/scripts/m09-linkcheck.sh
# NIR: 08.08.2026 15:20
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: M-09 Link-Check — validiert alle Header-/Footer-/Sitemap-Ziellinks gegen die Live-Site
# WHY: Prüfverfahren t_d3a3f169 Ziffer 4 (0 tote Links in Header/Footer) + §14.9
# DEPENDS: Live-Site www.nexifyai.cloud (Host-VPS, Port 8880)
# DOCS-REF: docs/plans/FREWERT-MARKETING-MASSNAHMENKATALOG-2026-08-08.md M-09

BASE="https://www.nexifyai.cloud"
DEAD=0
check() {
  code=$(curl -s -o /dev/null -w "%{http_code}" -m 15 "$BASE$1")
  if [ "$code" = "200" ] || [ "$code" = "307" ] || [ "$code" = "308" ]; then
    echo "OK   $code $1"
  else
    echo "TOT  $code $1"
    DEAD=$((DEAD+1))
  fi
}

for p in \
  / /leistungen /preise /prozess /vergleich /referenzen /wissen /ueber-mich \
  /kontakt /rueckruf /faq /ki-roi-rechner /chatbot-kosten-rechner /plattform \
  /venlo /impressum /datenschutz /agb /avv /widerruf /cookie-richtlinie \
  /ki-hinweise /audit /checkliste /ebook /alternativen /partner /botschafter \
  /sprechstunde /erfahrungen /branchen /stadt/ki-agentur-berlin \
  /stadt/ki-agentur-hamburg \
  /stadt/ki-agentur-muenchen /stadt/ki-agentur-koeln /stadt/ki-agentur-frankfurt-am-main \
  /stadt/ki-agentur-duesseldorf /stadt/ki-agentur-stuttgart /stadt/ki-agentur-leipzig \
  /stadt/ki-agentur-dortmund /stadt/ki-agentur-hannover \
  /leistungen/websites /leistungen/automatisierung /leistungen/ai-agenten \
  /leistungen/ki-begleiter /leistungen/audit /leistungen/beratung \
  /branchen/handwerk /branchen/steuerberater /branchen/ecommerce \
  /branchen/immobilien /branchen/agenturen /branchen/kanzleien \
  /branchen/logistik /branchen/pflege /branchen/gastronomie \
  /branchen/produktion /vergleich/chatgpt /vergleich/freelance \
  /wissen/ai-automatisierung-kmu /wissen/ki-automatisierung-kmu-7-gewinne \
  /wissen/whatsapp-marketing-handwerk /wissen/ai-agenten-einfuehrung \
  /wissen/chatbot-dsgvo /wissen/website-kosten-2026 \
  /wissen/was-kostet-web-app-2026 /wissen/ki-steuerbuero \
  /wissen/automation-roi /wissen/chatgpt-unternehmen-grenzen \
  /wissen/geo-llm-seo-2026 /wissen/ki-chatbot-kosten-mittelstand \
  /wissen/ki-automatisierung-vertrieb \
  ; do
  check "$p"
done

echo "TOTE LINKS: $DEAD"
exit 0
