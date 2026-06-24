# Task 2: mongo:7 Image Update — Evidence Report
**Date:** 2026-06-22
**Agent:** Security Agent (Hermes)

---

## Summary
Aktualisierung des mongo:7 Docker-Images von Version 7.0.35 auf 7.0.37.

## Betroffene Container
| Container | Port | Network | Status |
|---|---|---|---|
| nexify-mongodb | 127.0.0.1:27018:27017 | bridge | ✅ Running |
| vsk-mongodb | 127.0.0.1:27017:27017 | vorratsgesellschaften-sofort-kaufen-landingpage_default | ✅ Running |

## Image VORHER
- **Image ID:** 948b635bc126
- **MongoDB Version:** 7.0.35
- **Size:** 1.19GB (297MB compressed)

## Image NACHHER
- **Image ID:** 8ecb514b00bd
- **MongoDB Version:** 7.0.37
- **Digest:** sha256:8ecb514b00bdcc0bde67ef4e6c330385377a9dc68e24ee94e28c07c891647348
- **Created:** 2026-06-12T19:10:17Z

## Trivy-Scan NACHHER (HIGH + CRITICAL)
- **CRITICAL:** 1
- **HIGH:** 79
- **TOTAL:** 80

### Verbleibende CRITICAL CVEs
| CVE | Component | Fixed In | Beschreibung |
|---|---|---|---|
| CVE-2025-68121 | Go stdlib (gosu) | 1.24.13, 1.25.7 | Incorrect TLS certificate validation during session resumption |

### Verbleibende HIGH CVEs (Auswahl)
- Go stdlib: ~14 CVEs in gosu binary (net/url, crypto/x509, net, HTTP/2)
- OS-Packages: ~65 CVEs in Oracle Linux 8 base packages

## Backup
- **nexify-mongodb:** `/root/backups/mongo-20260622/nexify-mongodb-backup.archive.gz`
- **vsk-mongodb:** `/root/backups/mongo-20260622/vsk-mongodb-backup.archive.gz`

## Datenintegrität
- **nexify-mongodb:** Databases: admin, config, local, nexifyai ✅
- **vsk-mongodb:** Databases: admin, config, local, nexifyai, vorratsgesellschaften ✅
- **Ping-Test:** Beide Container antworten mit `{ ok: 1 }` ✅

## Anmerkungen
- Die verbleibenden 80 CVEs (HIGH+CRITICAL) stammen aus:
  1. **gosu Go binary** — eingebettete Go stdlib mit bekannten Lücken. Wird durch MongoDB-Image-Update nicht behoben, da gosu von MongoDB upstream gepflegt wird.
  2. **Oracle Linux 8 Basis-Packages** — vom Upstream-Image abhängig. Keine manuellen Patches möglich ohne Custom-Image.
- Ein Custom-Image mit aktualisiertem gosu und gepatchten OS-Packages wäre der nächste Schritt zur weiteren CVE-Reduktion.
