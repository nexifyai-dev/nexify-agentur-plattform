# FILE: /deploy/network/CURSOR_EGRESS_ALLOWLIST.md
# NIR: 25.07.2026 02:15
# UPDATED: 25.07.2026 02:15
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Canonical Cursor egress domain allowlist for NeXify firewalls / proxies.
# WHY: Settings→Network list + enterprise docs must stay aligned for agent connectivity.
# BEST-PRACTICE: Prefer `*.cursor.sh` wildcards; granular list only if firewall forbids wildcards.
# PITFALL: V-NET-01: SSL inspection on Cursor domains breaks Agent streaming — exclude them.
# DEPENDS: Host firewall / SWG; Cursor Cloud Agent network settings (separate)
# DOCS-REF: https://cursor.com/docs/enterprise/network-configuration
# SESSION: bc-d485860d-ad48-4c90-9109-ca221d3b9368

# Cursor Egress Allowlist — NeXify

Machine-readable twin: [`CURSOR_EGRESS_ALLOWLIST.json`](./CURSOR_EGRESS_ALLOWLIST.json)

## 1. Settings → Network (Required domains)

Operator paste (2026-07-25) — exact UI list:

```
api2.cursor.sh
api3.cursor.sh
api4.cursor.sh
*.api5.cursor.sh
*.authentication.cursor.sh
authenticator.cursor.sh
marketplace.cursorapi.com
cursor-cdn.com
downloads.cursor.com
```

## 2. Preferred firewall patterns (enterprise docs)

```
*.cursor.sh
*.cursor-cdn.com
*.cursorapi.com
*.cursorvm.com
*.*.cursorvm.com
```

## 3. SSL inspection / SWG

Disable MITM for Cursor domains (or ensure HTTP/2 + SSE passthrough without buffering):

- `.cursor.sh`
- `cursor-cdn.com`
- `marketplace.cursorapi.com`
- `authenticate.cursor.sh` / `authenticator.cursor.sh`
- `*.cursorvm.com` / `*.*.cursorvm.com`

## 4. Where this applies at NeXify

| Surface | Action |
|---------|--------|
| Developer desktops / Cursor IDE | Corporate firewall allowlist §1 or §2 |
| VPS `srv1243952` outbound (if Cursor CLI/agent runs there) | ufw/nftables / Hostinger firewall → §2 |
| Cursor **Cloud Agent** network mode | Separate: allow NeXify targets (`ai-router.nexifyai.cloud`, `github.com`, …). Cursor backends are already on Cursor infra |
| Proxy (Zscaler etc.) | No response buffering; test with `deploy/network/verify-cursor-egress.sh` |

## 5. Verify

```bash
bash deploy/network/verify-cursor-egress.sh
```

## 6. Scope boundary

This file is **Cursor → Internet egress** domains.  
It is **not** the NeXify service allowlist (9router, AgentMemory, GitHub, Hostinger).
