# Task 2: nexify-webui Image Rebuild — Security Patch Report

**Date:** 2026-06-22  
**Status:** ✅ COMPLETED  
**Action:** Image rebuilt with Debian security patches + chromadb upgrade

---

## Summary

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| CRITICAL CVEs | 32 | 30 | **-2 fixed** |
| Base OS | Debian 12.14 | Debian 12.14 | Same (upgraded packages) |
| chromadb | 1.5.2 | 1.5.9 | Upgraded (CVE tracked by Trivy) |
| libgnutls30 | 3.7.9-2+deb12u6 | 3.7.9-2+deb12u7 | ✅ Fixed |
| openssl | 3.0.20-1~deb12u1 | 3.0.20-1~deb12u2 | ✅ Upgraded |
| libssl3 | 3.0.20-1~deb12u1 | 3.0.20-1~deb12u2 | ✅ Upgraded |
| libkrb5 | 1.20.1-2+deb12u4 | 1.20.1-2+deb12u5 | ✅ Upgraded |
| libgcrypt20 | 1.10.1-3 | 1.10.1-3+deb12u1 | ✅ Upgraded |

## CVEs Fixed (2)

1. **CVE-2026-33845** — libgnutls30: Denial of Service via DTLS zero-length fragment
2. **CVE-2026-42010** — libgnutls30: Authentication Bypass via NUL Character in Username

## Additional Packages Upgraded (not CRITICAL but improved security)

- openssl/libssl3/libssl-dev → deb12u2
- libgssapi-krb5-2/libk5crypto3/libkrb5-3/libkrb5support0 → deb12u5
- libgcrypt20 → deb12u1

## Remaining 30 CRITICAL CVEs — No Fix in Debian 12

All remaining CVEs have **no available fix** in Debian 12 (bookworm) repositories:

| Package | CVE Count | Status |
|---------|-----------|--------|
| libaom3 | 1 | affected |
| Mesa (libgbm1, libgl1-mesa-dri, libglapi-mesa, libglx-mesa0) | 4 | affected |
| MariaDB (libmariadb-dev, libmariadb3, mariadb-common) | 9 | affected |
| libmbedcrypto7 | 3 | affected |
| Perl (perl, perl-base, libperl5.36, perl-modules-5.36) | 10 | affected |
| libsqlite3-0 | 1 | affected |
| linux-libc-dev | 1 | affected |
| zlib1g, zlib1g-dev | 2 | will_not_fix |
| chromadb | 1 | affected |

## Deployment Details

- **Image:** nexify-webui-nexify-webui:latest (rebuilt from Dockerfile.nexify-webui)
- **Image ID:** sha256:d478c49dfd6456f5436ba45dd4568a00c3182e815746d0c5234649c9c6992712
- **Container:** nexify-webui (recreated via docker-compose)
- **Port:** 3080→8080
- **Health:** ✅ Healthy (HTTP 200 on /health)
- **Volumes preserved:** nexify-webui_nexify-webui-data (no data loss)
- **Backup:** nexify-webui-nexify-webui:backup-20260622

## Evidence Files

- `/workspace/nexify/10_evidence/security/nexify-webui-rebuild-report.md` (this file)
- `/workspace/nexify/10_evidence/security/nexify-webui-Dockerfile-patched.txt`
- `/workspace/nexify/10_evidence/security/nexify-webui-container-status.txt`
- `/workspace/nexify/10_evidence/security/nexify-webui-container-logs.txt`
- `/workspace/nexify/10_evidence/security/trivy-nexify-webui-patched.json`
- `/workspace/nexify/10_evidence/security/trivy-nexify-webui-patched-final.json`
- `/workspace/nexify/10_evidence/security/trivy-nexify-webui-patched.txt`

## Recommended Next Steps

1. **Monitor Debian security tracker** for bookworm patches for remaining 30 CVEs
2. **Consider upgrading base image** when open-webui moves to Debian 13 (trixie)
3. **chromadb CVE-2026-45829**: Monitor upstream fix; 1.5.9 is latest but still flagged
4. **MariaDB CVEs**: Only relevant if MariaDB client is actually used (webui uses SQLite)
5. **zlib CVE-2023-45853**: Marked "will_not_fix" by Debian — only affects zip operations
6. **Schedule periodic rebuilds** to pick up new security patches automatically
