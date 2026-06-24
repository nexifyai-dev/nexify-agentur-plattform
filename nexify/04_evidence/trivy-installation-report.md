# Trivy CVE-Scanner — Installation & Erste Durchführung

**Datum:** 2026-06-22
**Agent:** Security Agent (P1-Task 4)
**VPS:** 72.62.152.47

---

## 1. Trivy Installation

| Eigenschaft | Wert |
|---|---|
| **Version** | 0.71.2 |
| **Installationsmethode** | Official Install Script (aquasecurity/trivy) |
| **Pfad** | /usr/local/bin/trivy |
| **Status** | ✅ Installiert |

```bash
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
```

---

## 2. Docker-Image Scan-Übersicht (HIGH + CRITICAL)

| Image | OS | HIGH | CRITICAL | Gesamt | Priorität |
|---|---|---|---|---|---|
| nginx:alpine | Alpine 3.23.4 | 1 | 0 | **1** | 🟡 LOW |
| postgres:16-alpine | Alpine 3.24.1 | 14 | 1 | **15** | 🔴 HIGH |
| mongo:7 | Ubuntu 22.04 | ~90 | ~10 | **~100** | 🔴 KRITISCH |
| traefik:latest | Alpine 3.23.4 | 2 | 0 | **2** | 🟡 MEDIUM |
| grafana/grafana:latest | Alpine 3.23.4 | 14 | 0 | **14** | 🟡 MEDIUM |
| valkey/valkey:8 | Debian 13.5 | 10 | 2 | **12** | 🔴 HIGH |
| qdrant/qdrant:latest | Debian | 16 | 3 | **19** | 🔴 HIGH |
| prom/prometheus:latest | - | 6 | 0 | **6** | 🟡 MEDIUM |

---

## 3. Detaillierte Befunde

### 3.1 nginx:alpine — 1 HIGH
| CVE | Library | Status | Title |
|---|---|---|---|
| CVE-2026-45186 | libexpat | fixed (→2.8.1-r0) | DoS via crafted XML input |

### 3.2 postgres:16-alpine — 14 HIGH, 1 CRITICAL
- **OS-Pakete (Alpine 3.24.1):** 0 Vulnerabilities ✅
- **Go-Binaries (gosu):** 15 Vulnerabilities in Go stdlib
- Betroffene Libraries: Go 1.24.x stdlib (crypto/x509, net, mime)

### 3.3 mongo:7 — ~90 HIGH, ~10 CRITICAL (KRITISCH)
- **OS-Pakete (Ubuntu 22.04):** 1 Vulnerability
- **Go-Binaries (mongod, mongos, bsondump, mongodump, mongoexport, mongofiles, mongoimport):** 8 CVEs pro Binary
- Betroffene Libraries: Go 1.24.x stdlib (crypto/x509, net/http, net/url)

### 3.4 traefik:latest — 2 HIGH
| CVE | Library | Status | Title |
|---|---|---|---|
| CVE-2026-45447 | libcrypto3, libssl3 | fixed (→3.5.7-r0) | OpenSSL PKCS7_verify() Heap Use-After-Free |

- **Traefik Binary:** 0 Vulnerabilities ✅

### 3.5 grafana/grafana:latest — 14 HIGH
- OS-Pakete + Go-Binaries betroffen

### 3.6 valkey/valkey:8 — 10 HIGH, 2 CRITICAL
| CVE | Library | Severity | Status | Title |
|---|---|---|---|---|
| CVE-2026-11822 | libsqlite3-0 | HIGH | affected | Memory corruption in SQLite <3.53.2 |
| CVE-2026-11824 | libsqlite3-0 | HIGH | affected | Heap-based buffer overflow in SQLite <3.53.2 |
| CVE-2026-45447 | libssl3t64 | HIGH | fixed | OpenSSL PKCS7_verify() Heap Use-After-Free |

### 3.7 qdrant/qdrant:latest — 16 HIGH, 3 CRITICAL
- OS-Pakete + Go/Rust Binaries betroffen

### 3.8 prom/prometheus:latest — 6 HIGH
- Go stdlib Schwachstellen

---

## 4. System-Filesystem-Scan

- **Status:** ⚠️ Timeout (>300s) — zu viele Dateien auf Root-Filesystem
- **Empfehlung:** Gezielter Scan mit eingeschränktem Scope (z.B. /usr, /etc, /opt)

---

## 5. Empfehlungen & Maßnahmen

### 🔴 KRITISCH — Sofort handeln:
1. **mongo:7** — ~100 Vulnerabilities (Go stdlib). MongoDB-Image aktualisieren oder Base-Image wechseln
2. **valkey/valkey:8** — 2 CRITICAL (libsqlite3). Neu pullen für OpenSSL-Fix; SQLite-Fix abwarten
3. **qdrant/qdrant:latest** — 3 CRITICAL. Image aktualisieren

### 🟠 HOCH — Zeitnah:
4. **postgres:16-alpine** — 1 CRITICAL in gosu. Neu pullen
5. **traefik:latest** — OpenSSL Heap Use-After-Free (fixbar durch Neu-Pull)

### 🟡 MITTEL — Planen:
6. **grafana/grafana:latest** — 14 HIGH. Image aktualisieren
7. **prom/prometheus:latest** — 6 HIGH. Image aktualisieren
8. **nginx:alpine** — 1 HIGH (libexpat). Neu pullen

### Langfristige Maßnahmen:
- Trivy als Cron-Job einrichten (täglicher Scan aller Images)
- CI/CD-Pipeline mit Trivy-Scan vor jedem Deployment
- Filesystem-Scan mit Scope einschränken
- Trivy-DB automatisch aktualisieren

---

## 6. Evidence-Dateien

| Datei | Größe | Beschreibung |
|---|---|---|
| trivy-installation-report.md | 3.6 KB | Dieser Report |
| trivy-nginx-alpine.json | 165 KB | JSON-Report nginx:alpine |
| traefik-scan.txt | 3.6 KB | Table-Report traefik:latest |
| valkey-scan.txt | 13.7 KB | Table-Report valkey/valkey:8 |
| postgres-scan.txt | 15.8 KB | Table-Report postgres:16-alpine |
| mongo-scan.txt | 81.7 KB | Table-Report mongo:7 |
