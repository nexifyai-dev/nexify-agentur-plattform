# NeXify AI Fabrik – Kanonische Company-Config

Dies ist der **portable Export** der aktiven Paperclip-Fabrik-Konfiguration (Source-of-Truth).

- **Format**: Paperclip Agent-Company v1 (`.paperclip.yaml`)
- **Ordner**: `/app/fabrik/nexify-ai/`
- **Agents**: 6 (nexify-ai-ceo, nexify-ai-developer, nexify-analyst, nexify-architekt, nexify-ops, nexify-qa)
- **Skills**: 74 (davila7/claude-code-templates, paperclipai/paperclip, vercel-labs/skills)

## Deployment

Läuft aktiv auf VPS im Paperclip-Container (`paperclip-nexify`):
- Company-UUID: `150dc80b-d302-4d66-8102-142299652c2a`
- Runtime-Path: `/var/lib/docker/volumes/paperclip-data/_data/instances/default/companies/150dc80b-…/`
- Endpunkt: `https://ai-team.nexifyai.cloud`

## Restore-Verfahren

Bei Verlust der Runtime-Config:
```bash
scp -r /app/fabrik/nexify-ai root@72.62.152.47:/root/nexify-ai-company/
ssh root@72.62.152.47 "docker cp /root/nexify-ai-company paperclip-nexify:/tmp/ && \
  docker exec paperclip-nexify paperclip company import /tmp/nexify-ai-company"
```

## Änderungen

Änderungen an Agent-Instructions oder Skills IMMER hier zuerst — dann per Paperclip WebUI übernehmen ODER via `paperclip company import`.
