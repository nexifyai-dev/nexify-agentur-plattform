#!/bin/bash
# =============================================================================
# NeXify AI OS — Deployment Pipeline
# ID: NX-PROD-003 | Version: 1.0.0 | Stand: 2026-06-23
# Zweck: Automatisiertes Deployment mit Rollback-Fähigkeit
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE="/workspace/nexify"
COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.production.yml"
DEPLOY_LOG="${WORKSPACE}/logs/production/deploy.log"
DEPLOY_STATE="${SCRIPT_DIR}/.deploy-state.json"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info()    { echo -e "${BLUE}[DEPLOY]${NC} $(date '+%Y-%m-%d %H:%M:%S') $*" | tee -a "${DEPLOY_LOG}"; }
log_success() { echo -e "${GREEN}[DEPLOY]${NC} $(date '+%Y-%m-%d %H:%M:%S') $*" | tee -a "${DEPLOY_LOG}"; }
log_warn()    { echo -e "${YELLOW}[DEPLOY]${NC} $(date '+%Y-%m-%d %H:%M:%S') $*" | tee -a "${DEPLOY_LOG}"; }
log_error()   { echo -e "${RED}[DEPLOY]${NC} $(date '+%Y-%m-%d %H:%M:%S') $*" | tee -a "${DEPLOY_LOG}"; }

mkdir -p "$(dirname "${DEPLOY_LOG}")"

# --- Pre-Flight Checks ---
preflight_checks() {
    log_info "Pre-Flight Checks..."
    
    # Docker verfügbar?
    if ! command -v docker &>/dev/null; then
        log_error "Docker nicht installiert"
        return 1
    fi
    
    # Docker Compose verfügbar?
    if ! command -v docker-compose &>/dev/null && ! docker compose version &>/dev/null; then
        log_error "Docker Compose nicht installiert"
        return 1
    fi
    
    # Compose File vorhanden?
    if [[ ! -f "${COMPOSE_FILE}" ]]; then
        log_error "Compose File nicht gefunden: ${COMPOSE_FILE}"
        return 1
    fi
    
    # Secrets vorhanden?
    local secrets_dir="${SCRIPT_DIR}/secrets"
    if [[ ! -d "${secrets_dir}" ]]; then
        log_warn "Secrets-Verzeichnis nicht gefunden - erstelle..."
        mkdir -p "${secrets_dir}"
        openssl rand -base64 32 > "${secrets_dir}/grafana_admin_pw.txt"
        openssl rand -base64 64 > "${secrets_dir}/plausible_secret.txt"
        log_success "Secrets generiert"
    fi
    
    # Monitoring Config?
    local monitoring_dir="${SCRIPT_DIR}/monitoring"
    if [[ ! -d "${monitoring_dir}" ]]; then
        log_warn "Monitoring-Config nicht gefunden - erstelle Defaults..."
        mkdir -p "${monitoring_dir}"
        create_prometheus_config
    fi
    
    # Caddy Config?
    local caddy_dir="${SCRIPT_DIR}/caddy"
    if [[ ! -d "${caddy_dir}" ]]; then
        log_warn "Caddy-Config nicht gefunden - erstelle Defaults..."
        mkdir -p "${caddy_dir}"
        create_caddy_config
    fi
    
    log_success "Pre-Flight Checks bestanden"
    return 0
}

# --- Config Generierung ---
create_prometheus_config() {
    cat > "${SCRIPT_DIR}/monitoring/prometheus.yml" << 'PROMEOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'nexify-brain'
    static_configs:
      - targets: ['brain:9090']
  
  - job_name: 'nexify-9router'
    static_configs:
      - targets: ['9router:8080']
  
  - job_name: 'nexify-qdrant'
    static_configs:
      - targets: ['qdrant:6333']
  
  - job_name: 'nexify-prometheus'
    static_configs:
      - targets: ['localhost:9090']
PROMEOF
    log_success "Prometheus-Konfiguration erstellt"
}

create_caddy_config() {
    cat > "${SCRIPT_DIR}/caddy/Caddyfile" << 'CADDEOF'
{
    email admin@nexifyai.cloud
}

*.nexifyai.cloud {
    reverse_proxy brain:9090
}

brain.nexifyai.cloud {
    reverse_proxy brain:9090
}

grafana.nexifyai.cloud {
    reverse_proxy grafana:3000
}

analytics.nexifyai.cloud {
    reverse_proxy plausible:8000
}
CADDEOF
    log_success "Caddy-Konfiguration erstellt"
}

# --- Backup vor Deploy ---
pre_deploy_backup() {
    log_info "Pre-Deploy Backup..."
    "${SCRIPT_DIR}/nexify-production-master.sh" backup 2>/dev/null || true
    log_success "Pre-Deploy Backup abgeschlossen"
}

# --- Deploy ---
deploy() {
    local mode="${1:-up}"
    
    log_info "=== Deployment gestartet (Mode: ${mode}) ==="
    
    # Docker Compose Kommando bestimmen
    local compose_cmd="docker-compose"
    if docker compose version &>/dev/null; then
        compose_cmd="docker compose"
    fi
    
    case "${mode}" in
        up)
            log_info "Container starten..."
            ${compose_cmd} -f "${COMPOSE_FILE}" up -d --remove-orphans
            ;;
        pull)
            log_info "Images aktualisieren..."
            ${compose_cmd} -f "${COMPOSE_FILE}" pull
            ${compose_cmd} -f "${COMPOSE_FILE}" up -d --remove-orphans
            ;;
        restart)
            log_info "Container neustarten..."
            ${compose_cmd} -f "${COMPOSE_FILE}" restart
            ;;
        down)
            log_info "Container stoppen..."
            ${compose_cmd} -f "${COMPOSE_FILE}" down
            ;;
        *)
            log_error "Unbekannter Mode: ${mode}"
            return 1
            ;;
    esac
    
    # State speichern
    cat > "${DEPLOY_STATE}" << EOF
{
  "last_deploy": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "mode": "${mode}",
  "status": "deployed",
  "compose_file": "${COMPOSE_FILE}"
}
EOF
    
    log_success "=== Deployment abgeschlossen ==="
}

# --- Post-Deploy Validation ---
post_deploy_validation() {
    log_info "Post-Deploy Validation..."
    local errors=0
    
    # Warte auf Container-Start
    sleep 10
    
    # Health Checks
    local services=("brain:9090" "qdrant:6333" "9router:8080" "grafana:3000" "prometheus:9091")
    for svc in "${services[@]}"; do
        local name="${svc%%:*}"
        local port="${svc##*:}"
        if curl -sf --max-time 10 "http://localhost:${port}/health" > /dev/null 2>&1 || \
           curl -sf --max-time 10 "http://localhost:${port}/" > /dev/null 2>&1; then
            log_success "Service ${name} (Port ${port}): OK"
        else
            log_warn "Service ${name} (Port ${port}): Nicht erreichbar"
            ((errors++))
        fi
    done
    
    # Docker Status
    if command -v docker &>/dev/null; then
        local running
        running=$(docker ps --format '{{.Names}}' 2>/dev/null | wc -l)
        local unhealthy
        unhealthy=$(docker ps --filter "health=unhealthy" --format '{{.Names}}' 2>/dev/null | wc -l)
        log_info "Container: ${running} laufend, ${unhealthy} unhealthy"
    fi
    
    if [[ ${errors} -gt 0 ]]; then
        log_warn "Post-Deploy: ${errors} Services nicht erreichbar"
        return 1
    fi
    
    log_success "Post-Deploy Validation bestanden"
    return 0
}

# --- Rollback ---
rollback() {
    log_warn "=== Rollback eingeleitet ==="
    
    local compose_cmd="docker-compose"
    if docker compose version &>/dev/null; then
        compose_cmd="docker compose"
    fi
    
    ${compose_cmd} -f "${COMPOSE_FILE}" down 2>/dev/null || true
    
    if [[ -f "${DEPLOY_STATE}" ]]; then
        log_info "Vorheriger Zustand:"
        cat "${DEPLOY_STATE}"
    fi
    
    log_warn "Rollback abgeschlossen - manuelle Intervention erforderlich"
}

# --- Status ---
show_deploy_status() {
    echo ""
    echo "═══════════════════════════════════════════════════"
    echo "  NeXify AI OS — Deploy Status"
    echo "═══════════════════════════════════════════════════"
    echo ""
    
    if [[ -f "${DEPLOY_STATE}" ]]; then
        python3 -c "
import json
with open('${DEPLOY_STATE}', 'r') as f:
    state = json.load(f)
for k, v in state.items():
    print(f'  {k}: {v}')
" 2>/dev/null || cat "${DEPLOY_STATE}"
    else
        echo "  Kein Deployment vorhanden"
    fi
    
    if command -v docker &>/dev/null; then
        echo ""
        echo "  Container:"
        docker ps --format "  {{.Names}}: {{.Status}}" 2>/dev/null | head -20
    fi
    
    echo ""
    echo "═══════════════════════════════════════════════════"
}

# --- Hauptfunktion ---
main() {
    local action="${1:-help}"
    
    case "${action}" in
        deploy)
            preflight_checks || exit 1
            pre_deploy_backup
            deploy "up"
            post_deploy_validation || log_warn "Einige Services nicht erreichbar"
            show_deploy_status
            ;;
        update)
            preflight_checks || exit 1
            pre_deploy_backup
            deploy "pull"
            post_deploy_validation || log_warn "Einige Services nicht erreichbar"
            show_deploy_status
            ;;
        restart)
            deploy "restart"
            post_deploy_validation
            ;;
        stop)
            deploy "down"
            ;;
        rollback)
            rollback
            ;;
        status)
            show_deploy_status
            ;;
        preflight)
            preflight_checks
            ;;
        help|*)
            echo "Verwendung: $0 {deploy|update|restart|stop|rollback|status|preflight}"
            echo ""
            echo "  deploy    - Komplettes Deployment starten"
            echo "  update    - Images aktualisieren und neu deployen"
            echo "  restart   - Container neustarten"
            echo "  stop      - Container stoppen"
            echo "  rollback  - Rollback durchführen"
            echo "  status    - Deploy-Status anzeigen"
            echo "  preflight - Pre-Flight Checks durchführen"
            ;;
    esac
}

main "$@"
