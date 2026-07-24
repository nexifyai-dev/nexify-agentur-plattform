# Trivy CVE-Scanner Installation Report

**Datum:** 2026-06-22  
**VPS:** 72.62.152.47  
**Agent:** Security Agent (NeXify AI OS)

---

## 1. Installation

| Komponente | Status |
|------------|--------|
| Trivy Version | **v0.71.2** ✅ |
| Vulnerability DB Version | 2 |
| DB Updated | 2026-06-22 14:25:04 UTC |
| Installationsmethode | .deb Binary-Download (GitHub Releases) |
| OS | Ubuntu (resolute) |

### Install-Befehl (für Nachstellung)
```bash
TRIVY_VERSION=$(curl -s https://api.github.com/repos/aquasecurity/trivy/releases/latest | grep tag_name | cut -d'"' -f4)
wget "https://github.com/aquasecurity/trivy/releases/download/${TRIVY_VERSION}/trivy_${TRIVY_VERSION#v}_Linux-64bit.deb" -O /tmp/trivy.deb
dpkg -i /tmp/trivy.deb
```

---

## 2. Scan-Ergebnisse

### 2.1 Image: `hermes-webui-nexify-hermes-webui:latest`

| Metrik | Wert |
|--------|------|
| Basis-OS | Debian 13.5 |
| Image-Größe | 565 MB (155 MB compressed) |
| **Gesamt-Schwachstellen (CRITICAL+HIGH)** | **43** |
| CRITICAL | 8 |
| HIGH | 35 |

#### Kritische CVEs (CRITICAL)

| CVE | Betroffene Pakete | Beschreibung |
|-----|-------------------|--------------|
| **CVE-2026-42496** | perl, perl-base, perl-modules-5.40, libperl5.40 | Path traversal via crafted symlinks in Archive::Tar |
| **CVE-2026-8376** | perl, perl-base, perl-modules-5.40 | Heap buffer overflow in Perl (compiling) |

#### Wichtige HIGH CVEs

| CVE | Betroffene Pakete | Beschreibung |
|-----|-------------------|--------------|
| CVE-2026-5773 | curl, libcurl3t64-gnutls, libcurl4t64 | Wrong file transfer due to incorrect SMB connection reuse |
| CVE-2026-6276 | curl, libcurl3t64-gnutls, libcurl4t64 | Cookie leak when reusing connections |
| CVE-2026-24882 | dirmngr, gnupg, gpg, gpg-agent, gpgconf, gpgsm | Stack-based buffer overflow in tpm2daemon (RCE) |
| CVE-2025-59375 | libexpat1 | Large dynamic memory allocation in Expat |
| CVE-2026-25210 | libexpat1 | Integer overflow - information disclosure |
| CVE-2026-45186 | libexpat1 | DoS via crafted XML input |
| CVE-2025-69720 | libncursesw6, libtinfo6, ncurses-base, ncurses-bin | Buffer overflow in ncurses (RCE) |
| CVE-2026-11824 | libsqlite3-0 | Heap-based buffer overflow in SQLite |
| CVE-2026-7598 | libssh2-1t64 | Integer overflow via large username/password |
| CVE-2026-42497 | perl, perl-base, perl-modules-5.40 | Arbitrary file modification via hardlinks |
| CVE-2026-48962 | perl, perl-base, perl-modules-5.40 | Arbitrary code execution via IO-Compress |
| CVE-2026-9538 | perl, perl-base, perl-modules-5.40 | Memory exhaustion in Archive::Tar |

---

### 2.2 Image: `nexify-webui-nexify-webui:latest`

| Metrik | Wert |
|--------|------|
| Basis-OS | Debian 12.14 |
| Image-Größe | 6.72 GB (1.71 GB compressed) |
| **Gesamt-Schwachstellen (CRITICAL+HIGH)** | **293** ⚠️ |

> **WARNUNG:** Dieses Image hat massive Sicherheitsprobleme und sollte dringend aktualisiert werden.

---

## 3. Risiko-Bewertung

### Sofort-Maßnahmen erforderlich (P0)

1. **`nexify-webui:latest` Image neu bauen** — 293 CVEs, altes Debian 12.14 Basis-Image
2. **Perl-Pakete aktualisieren** — Multiple CRITICAL CVEs (Path Traversal, Heap Overflow, RCE)
3. **curl aktualisieren** — SMB-Transfer-Bug + Cookie-Leak

### Prioritäre Updates (P1)

4. **libexpat1** aktualisieren — 3 HIGH CVEs (XML-Parser)
5. **ncurses** aktualisieren — Buffer Overflow (RCE)
6. **libsqlite3** aktualisieren — Heap Overflow
7. **libssh2** aktualisieren — Integer Overflow

### Empfohlene Maßnahmen

- Regelmäßige Trivy-Scans in CI/CD-Pipeline integrieren
- Base-Images auf aktuellere Versionen upgraden
- Unnötige Pakete (perl, gnupg) aus Production-Images entfernen

---

## 4. Evidence-Dateien

| Datei | Beschreibung |
|-------|--------------|
| `trivy_scan_hermes-webui_20260622.json` | JSON-Report (maschinenlesbar) |
| `trivy_scan_hermes-webui_20260622.txt` | Tabellen-Report (menschlesbar) |
| `trivy_scan_nexify-webui_20260622.txt` | Tabellen-Report nexify-webui |
| `TRIVY_INSTALLATION_REPORT_20260622.md` | Dieser Bericht |

---

## 5. Trivy-Commands für zukünftige Scans

```bash
# Image-Scan (nur CRITICAL + HIGH)
trivy image --severity CRITICAL,HIGH <image-name>

# JSON-Output (für Automatisierung)
trivy image --format json <image-name>

# Filesystem-Scan
trivy fs /path/to/project

# Kubernetes-Scan
trivy k8s --report summary cluster
```

---

**Status:** ✅ Trivy installiert und produktionsbereit  
**Nächster Schritt:** CI/CD-Integration und automatische Scans
