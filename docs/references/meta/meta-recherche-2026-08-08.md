# Meta-Recherche 2026-08-08 (CEO-Lauf, Tageswissen)

## Kernfakten

1. **Meta Business Agent Platform** (developers.facebook.com/documentation/meta-business-agent/overview/): Offizieller Meta-AI-Agent für WhatsApp/Messenger/Ads — antwortet in Markenstimme, führt Aktionen aus (Bestellstatus, Buchung), Handoff an eigene App. **Option für NeXify:** als erste Antwort-Ebene oder Referenz-Architektur; unsere eigene Hermes-Pipeline bleibt die Kernlösung (volle Kontrolle, §0c-Persona). Evaluieren nach App-Review.
2. **Messenger-Changelog (2026):**
   - Sticker-Attachment-Handling: Webhook-Handler bis **30.08.2026** auf neuen Typ umstellen (gilt auch für Echoes + Conversations API) — Pitfall für meta-webhook-proxy.
   - Post/Reel-Share-Daten in Conversations API + Webhooks (seit 26.03.2026).
   - Message Tags werden 2026 deprecated (Migration für Chat-Agents nötig).
3. **WhatsApp-Tooling-Markt 2026:** Meta Business Agent, BotPenguin/Inceptimind/AiSensy als Anbieter (B2B-Referenz für Positionierung; Differenzierung = eigene KI-Agenten-Pipeline + 449€-Audit).

## Relevanz für NeXify

- Webhook-Proxy: Sticker-Payload-Typ ab 30.08.2026 beachten (Test + Handler).
- Angebots-Positionierung: „Meta Business Agent nutzen wir nicht als Blackbox — wir bauen Ihren Agenten in Ihrer Markenstimme auf Ihrer Infrastruktur" (USP gegen Meta-Standard).
- Quellen: developers.facebook.com (Messenger-Changelog, Meta Business Agent), releasebot.io/updates/meta, callsphere.ai (Message-Tags-Deprecation).
