#!/bin/bash
# =============================================================================
# NeXify AI OS — Dauerhafte Produktion Master
# ID: NX-PROD-001 | Version: 1.0.0 | Stand: 2026-06-23
# Zweck: Orchestrierung aller produktionskritischen Automatisierungen
# Norm: ISO 20000 / ITIL / ISO 27001
# =============================================================================

set -uo pipefail

# --- Konfiguration ---
WORKSPACE="/workspace/nexify"
PROD_DIR="${WORKSPACE}/09_dispatcher/automation/production"
LOG_DIR="${WORKSPACE}/logs/production"
EVIDENCE_DIR="${WORKSPACE}/10_evidence/reflektor"
LOCK_DIR="${WORKSPACE}/.locks"
STATE_FILE="${PROD_DIR}/.production-state.json"

# Farbcodes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# --- Logging ---
log_info()    { echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') $*"; }
log_success() { echo -e "${GREEN}[OK]${NC} $(date '+%Y-%m-%d %H:%M:%S') $*"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC} $(date '+%Y-%m-%d %H:%M:%S') $*"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') $*"; }

# --- Initialisierung ---
init_production() {
    mkdir -p "${LOG_DIR}" "${LOCK_DIR}" "${PROD_DIR}"
    
    if [[ ! -f "${STATE_FILE}" ]]; then
        cat > "${STATE_FILE}" << 'EOF'
{
  "version": "1.0.0",
  "initialized": "2026-06-23T00:00:00Z",
  "mode": "production",
  "status": "active",
  "components": {
    "monitoring": "active",
    "backup": "active",
    "security": "active",
    "updates": "active",
    "maintenance": "active"
  },
  "last_health_check": null,
  "last_backup": null,
  "last_security_scan": null,
  "last_update_check": null,
  "consecutive_failures": 0,
  "alert_cooldown": 300
}
EOF
        log_success "Production State initialisiert"
    fi
}

# --- Lock Management ---
acquire_lock() {
    local lock_name="$1"
    local lock_file="${LOCK_DIR}/${lock_name}.lock"
    
    if [[ -f "${lock_file}" ]]; then
        local lock_pid
        lock_pid=$(cat "${lock_file}")
        if kill -0 "${lock_pid}" 2>/dev/null; then
            log_warn "Lock ${lock_name} aktiv (PID: ${lock_pid})"
            return 1
        fi
    fi
    echo $$ > "${lock_file}"
    return 0
}

release_lock() {
    local lock_name="$1"
    rm -f "${LOCK_DIR}/${lock_name}.lock"
}

# --- Health Check Suite ---
run_health_checks() {
    log_info "=== Health Check Suite gestartet ==="
    local checks_passed=0
    local checks_failed=0
    local health_report=""
    
    # 1. Disk Usage
    local disk_usage
    disk_usage=$(df -h /workspace 2>/dev/null | awk 'NR==2{print $5}' | tr -d '%')
    if [[ -n "${disk_usage}" ]] && [[ "${disk_usage}" -lt 85 ]]; then
        log_success "Disk Usage: ${disk_usage}% (< 85%)"
        ((checks_passed++))
        health_report+="disk:ok(${disk_usage}%),"
    else
        log_warn "Disk Usage: ${disk_usage}% (>= 85%)"
        ((checks_failed++))
        health_report+="disk:warn(${disk_usage}%),"
    fi
    
    # 2. Memory Usage
    local mem_usage
    mem_usage=$(free 2>/dev/null | awk '/Mem:/{if($2>0) printf "%.0f", $3/$2*100; else print 0}')
    if [[ -z "${mem_usage}" ]]; then
        log_info "Memory Usage: Nicht verfügbar (Container/cgroups)"
        ((checks_passed++))
        health_report+="mem:n/a,"
    elif [[ "${mem_usage}" -lt 90 ]]; then
        log_success "Memory Usage: ${mem_usage}% (< 90%)"
        ((checks_passed++))
        health_report+="mem:ok(${mem_usage}%),"
    else
        log_warn "Memory Usage: ${mem_usage}% (>= 90%)"
        ((checks_failed++))
        health_report+="mem:warn(${mem_usage}%),"
    fi
    
    # 3. Workspace Integrity
    local required_dirs=("00_master" "03_regelwerke" "09_dispatcher" "10_evidence" "30_operating_data")
    local ws_ok=true
    for dir in "${required_dirs[@]}"; do
        if [[ ! -d "${WORKSPACE}/${dir}" ]]; then
            log_error "Fehlendes Verzeichnis: ${dir}"
            ws_ok=false
        fi
    done
    if ${ws_ok}; then
        log_success "Workspace Integrity: OK"
        ((checks_passed++))
        health_report+="workspace:ok,"
    else
        ((checks_failed++))
        health_report+="workspace:fail,"
    fi
    
    # 4. Brain API
    if curl -sf --max-time 5 "http://127.0.0.1:9090/health" > /dev/null 2>&1; then
        log_success "Brain API (:9090): Erreichbar"
        ((checks_passed++))
        health_report+="brain:ok,"
    else
        log_warn "Brain API (:9090): Nicht erreichbar"
        ((checks_failed++))
        health_report+="brain:unreachable,"
    fi
    
    # 5. Qdrant
    if curl -sf --max-time 5 "http://127.0.0.1:6333/healthz" > /dev/null 2>&1; then
        log_success "Qdrant (:6333): Erreichbar"
        ((checks_passed++))
        health_report+="qdrant:ok,"
    else
        log_warn "Qdrant (:6333): Nicht erreichbar"
        ((checks_failed++))
        health_report+="qdrant:unreachable,"
    fi
    
    # 6. Docker (falls verfügbar)
    if command -v docker &>/dev/null; then
        local containers_running
        containers_running=$(docker ps -q 2>/dev/null | wc -l)
        log_info "Docker Container laufend: ${containers_running}"
        health_report+="docker:${containers_running}running,"
        ((checks_passed++))
    else
        log_info "Docker: Nicht installiert (Workspace-Modus)"
        health_report+="docker:n/a,"
    fi
    
    # 7. Cron/Konfigurationen
    local cron_configs=0
    [[ -f "${WORKSPACE}/09_dispatcher/automation/nexify-cron-extended.conf" ]] && ((cron_configs++))
    [[ -f "${WORKSPACE}/09_dispatcher/automation/nexify-cron.conf" ]] && ((cron_configs++))
    log_success "Cron-Konfigurationen: ${cron_configs} vorhanden"
    ((checks_passed++))
    health_report+="cron:${cron_configs},"
    
    # 8. Evidence Directory
    local evidence_count
    evidence_count=$(find "${WORKSPACE}/10_evidence" -type f 2>/dev/null | wc -l)
    log_success "Evidence Dateien: ${evidence_count}"
    ((checks_passed++))
    health_report+="evidence:${evidence_count}"
    
    # Ergebnis
    local total=$((checks_passed + checks_failed))
    log_info "=== Health Check Ergebnis: ${checks_passed}/${total} bestanden ==="
    
    # State aktualisieren
    update_state "last_health_check" "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    
    if [[ ${checks_failed} -gt 0 ]]; then
        local current_failures
        current_failures=$(get_state "consecutive_failures" || echo "0")
        update_state "consecutive_failures" "$((current_failures + 1))"
        return 1
    else
        update_state "consecutive_failures" "0"
        return 0
    fi
}

# --- Backup Suite ---
run_backup() {
    log_info "=== Backup Suite gestartet ==="
    
    local backup_dir="${WORKSPACE}/backups/$(date +%Y-%m-%d)"
    mkdir -p "${backup_dir}"
    
    # 1. Workspace Snapshot
    log_info "Workspace Snapshot..."
    tar czf "${backup_dir}/nexify-workspace-$(date +%H%M%S).tar.gz" \
        --exclude='*.tar.gz' \
        --exclude='backups' \
        --exclude='.git' \
        -C "${WORKSPACE}" . 2>/dev/null && \
        log_success "Workspace Snapshot erstellt" || \
        log_warn "Workspace Snapshot fehlgeschlagen (kein tar?)"
    
    # 2. Evidence Backup
    log_info "Evidence Backup..."
    if [[ -d "${WORKSPACE}/10_evidence" ]]; then
        cp -r "${WORKSPACE}/10_evidence" "${backup_dir}/evidence-$(date +%H%M%S)" 2>/dev/null
        log_success "Evidence Backup erstellt"
    fi
    
    # 3. Konfigurationen sichern
    log_info "Konfigurationen sichern..."
    local configs=(
        "${WORKSPACE}/09_dispatcher/automation/nexify-cron-extended.conf"
        "${WORKSPACE}/09_dispatcher/automation/nexify-cron.conf"
        "${WORKSPACE}/09_dispatcher/automation/bolt/bolt-config.json"
        "${WORKSPACE}/03_regelwerke"
    )
    for cfg in "${configs[@]}"; do
        [[ -e "${cfg}" ]] && cp -r "${cfg}" "${backup_dir}/" 2>/dev/null
    done
    log_success "Konfigurationen gesichert"
    
    # 4. Backup Rotation (7 Tage)
    log_info "Backup Rotation (>7 Tage löschen)..."
    find "${WORKSPACE}/backups" -type d -mtime +7 -exec rm -rf {} + 2>/dev/null || true
    log_success "Alte Backups bereinigt"
    
    update_state "last_backup" "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    log_info "=== Backup Suite abgeschlossen ==="
}

# --- Security Scan ---
run_security_scan() {
    log_info "=== Security Scan gestartet ==="
    local issues=0
    
    # 1. Secret Exposure Check
    log_info "Secret Exposure Check..."
    local secret_patterns=("password=" "api_key=" "secret=" "token=" "PRIVATE_KEY")
    for pattern in "${secret_patterns[@]}"; do
        local found
        found=$(grep -rl --include="*.md" --include="*.json" --include="*.yaml" --include="*.yml" \
            -i "${pattern}" "${WORKSPACE}" 2>/dev/null | grep -v "evidence" | grep -v "regelwerke" | head -5)
        if [[ -n "${found}" ]]; then
            log_warn "Potentiell exponierte Secrets: ${pattern}"
            ((issues++))
        fi
    done
    
    # 2. File Permissions
    log_info "File Permission Check..."
    local world_writable
    world_writable=$(find "${WORKSPACE}" -type f -perm -o+w 2>/dev/null | head -10)
    if [[ -n "${world_writable}" ]]; then
        log_warn "World-writable Dateien gefunden"
        ((issues++))
    fi
    
    # 3. Docker Security (falls verfügbar)
    if command -v docker &>/dev/null; then
        log_info "Docker Security Check..."
        local privileged
        privileged=$(docker ps --format '{{.Names}}' 2>/dev/null | while read -r name; do
            docker inspect "${name}" --format '{{.HostConfig.Privileged}}' 2>/dev/null | grep -q true && echo "${name}"
        done)
        if [[ -n "${privileged}" ]]; then
            log_warn "Privilegierte Container: ${privileged}"
            ((issues++))
        fi
    fi
    
    # 4. Firewall Status
    if command -v ufw &>/dev/null; then
        local fw_status
        fw_status=$(ufw status 2>/dev/null | head -1)
        log_info "Firewall: ${fw_status}"
    fi
    
    # 5. CrowdSec Status
    if command -v crowdsec &>/dev/null; then
        log_info "CrowdSec: Installiert"
    else
        log_info "CrowdSec: Nicht installiert (OSS-Empfehlung)"
    fi
    
    update_state "last_security_scan" "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    
    if [[ ${issues} -gt 0 ]]; then
        log_warn "=== Security Scan: ${issues} Probleme gefunden ==="
        return 1
    else
        log_success "=== Security Scan: Keine Probleme ==="
        return 0
    fi
}

# --- Update Check ---
run_update_check() {
    log_info "=== Update Check gestartet ==="
    
    # 1. System Updates
    if command -v apt &>/dev/null; then
        local updates_available
        updates_available=$(apt list --upgradable 2>/dev/null | grep -c "upgradable" || echo "0")
        log_info "Verfügbare System-Updates: ${updates_available}"
    fi
    
    # 2. Docker Images (falls verfügbar)
    if command -v docker &>/dev/null; then
        local outdated
        outdated=$(docker images --format "{{.Repository}}:{{.Tag}}" 2>/dev/null | head -10)
        log_info "Docker Images: $(echo "${outdated}" | wc -l) registriert"
    fi
    
    # 3. Git Repository Status
    if [[ -d "${WORKSPACE}/.git" ]]; then
        local behind
        behind=$(cd "${WORKSPACE}" && git log --oneline HEAD..@{u} 2>/dev/null | wc -l || echo "0")
        log_info "Git: ${behind} Commits hinter Remote"
    fi
    
    update_state "last_update_check" "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    log_info "=== Update Check abgeschlossen ==="
}

# --- Maintenance ---
run_maintenance() {
    log_info "=== Maintenance gestartet ==="
    
    # 1. Log Rotation
    log_info "Log Rotation..."
    find "${LOG_DIR}" -name "*.log" -mtime +30 -delete 2>/dev/null || true
    find /var/log -name "nexify-*.log" -mtime +7 -delete 2>/dev/null || true
    log_success "Logs rotiert"
    
    # 2. Temp Cleanup
    log_info "Temp Cleanup..."
    find /tmp -name "nexify-*" -mtime +1 -delete 2>/dev/null || true
    log_success "Temp bereinigt"
    
    # 3. Evidence Archivierung
    log_info "Evidence Archivierung (>90 Tage)..."
    local old_evidence
    old_evidence=$(find "${WORKSPACE}/10_evidence" -type f -mtime +90 2>/dev/null | wc -l)
    if [[ ${old_evidence} -gt 0 ]]; then
        log_info "Alte Evidence Dateien: ${old_evidence} (Archivierung empfohlen)"
    fi
    
    # 4. Docker Cleanup (falls verfügbar)
    if command -v docker &>/dev/null; then
        docker system prune -f --volumes 2>/dev/null || true
        log_success "Docker bereinigt"
    fi
    
    log_info "=== Maintenance abgeschlossen ==="
}

# --- State Management ---
update_state() {
    local key="$1"
    local value="$2"
    if [[ -f "${STATE_FILE}" ]] && command -v python3 &>/dev/null; then
        python3 -c "
import json
with open('${STATE_FILE}', 'r') as f:
    state = json.load(f)
state['${key}'] = '${value}'
with open('${STATE_FILE}', 'w') as f:
    json.dump(state, f, indent=2)
" 2>/dev/null
    fi
}

get_state() {
    local key="$1"
    if [[ -f "${STATE_FILE}" ]] && command -v python3 &>/dev/null; then
        python3 -c "
import json
with open('${STATE_FILE}', 'r') as f:
    state = json.load(f)
print(state.get('${key}', ''))
" 2>/dev/null
    fi
}

# --- Production Status ---
show_status() {
    echo ""
    echo "═══════════════════════════════════════════════════"
    echo "  NeXify AI OS — Production Status"
    echo "═══════════════════════════════════════════════════"
    echo ""
    
    if [[ -f "${STATE_FILE}" ]] && command -v python3 &>/dev/null; then
        python3 -c "
import json
with open('${STATE_FILE}', 'r') as f:
    state = json.load(f)
print(f'  Version:      {state.get(\"version\", \"n/a\")}')
print(f'  Mode:         {state.get(\"mode\", \"n/a\")}')
print(f'  Status:       {state.get(\"status\", \"n/a\")}')
print(f'  Last Health:  {state.get(\"last_health_check\", \"never\")}')
print(f'  Last Backup:  {state.get(\"last_backup\", \"never\")}')
print(f'  Last Security:{state.get(\"last_security_scan\", \"never\")}')
print(f'  Last Update:  {state.get(\"last_update_check\", \"never\")}')
print(f'  Failures:     {state.get(\"consecutive_failures\", 0)}')
print()
comps = state.get('components', {})
for k, v in comps.items():
    icon = '✅' if v == 'active' else '❌'
    print(f'  {icon} {k}: {v}')
" 2>/dev/null
    else
        echo "  Status: Nicht initialisiert"
    fi
    
    echo ""
    echo "═══════════════════════════════════════════════════"
}

# --- Hauptfunktion ---
main() {
    local action="${1:-help}"
    
    init_production
    
    case "${action}" in
        start)
            log_info "🚀 Dauerhafte Produktion wird gestartet..."
            run_health_checks
            run_backup
            run_security_scan
            run_update_check
            run_maintenance
            log_success "✅ Dauerhafte Produktion aktiv"
            show_status
            ;;
        health)
            run_health_checks
            ;;
        backup)
            run_backup
            ;;
        security)
            run_security_scan
            ;;
        update)
            run_update_check
            ;;
        maintenance)
            run_maintenance
            ;;
        status)
            show_status
            ;;
        full)
            log_info "Voller Produktionszyklus..."
            run_health_checks || true
            run_backup || true
            run_security_scan || true
            run_update_check || true
            run_maintenance || true
            show_status
            ;;
        help|*)
            echo "Verwendung: $0 {start|health|backup|security|update|maintenance|status|full}"
            echo ""
            echo "  start       - Dauerhafte Produktion initialisieren und starten"
            echo "  health      - Health-Checks ausführen"
            echo "  backup      - Backup erstellen"
            echo "  security    - Security Scan durchführen"
            echo "  update      - Update-Check durchführen"
            echo "  maintenance - Wartung durchführen"
            echo "  status      - Produktionsstatus anzeigen"
            echo "  full        - Vollständigen Zyklus ausführen"
            ;;
    esac
}

main "$@"
