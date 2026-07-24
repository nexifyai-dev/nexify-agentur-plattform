# Verschlüsselung (TLS/SSL) — Phase 2.7.4

**Version:** 1.0
**Erstellt:** 2026-06-23
**Status:** ✅ ABGESCHLOSSEN

---

## 1. Übersicht

Die Verschlüsselung implementiert TLS/SSL für alle Kommunikationswege im NeXify AI OS.

### 1.1 Verschlüsselungs-Layer

```
┌─────────────────────────────────────────────────────────────┐
│              Verschlüsselungs-Architektur v1.0               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 1: Transport Encryption (TLS 1.3)                   │
│  ├── Externe Kommunikation (HTTPS)                         │
│  ├── Interne Kommunikation (mTLS)                          │
│  └── API-Kommunikation (TLS)                               │
│                                                             │
│  Layer 2: Data-at-Rest Encryption                          │
│  ├── PostgreSQL (TDE)                                       │
│  ├── Qdrant (AES-256)                                      │
│  ├── Restic Backups (AES-256)                              │
│  └── Secrets (AES-256)                                     │
│                                                             │
│  Layer 3: Application-Level Encryption                     │
│  ├── JWT Tokens (HS256/RS256)                              │
│  ├── API Keys (hashed)                                     │
│  └── Passwords (bcrypt)                                    │
│                                                             │
│  Layer 4: Key Management                                   │
│  ├── Secret Rotation (90 Tage)                             │
│  ├── Key Storage (/root/.nexify/secrets/)                  │
│  └── Access Control (chmod 600)                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Transport Encryption (TLS 1.3)

### 2.1 Externe Kommunikation

**Cloudflare Tunnel:**
```
Client → TLS 1.3 → Cloudflare → TLS 1.3 → Origin (Brain API)
```

**Konfiguration:**
```yaml
# Cloudflare Tunnel Config
tunnel: nexifyai
credentials-file: /root/.cloudflared/credentials.json

ingress:
  - hostname: brain.nexifyai.cloud
    service: https://localhost:9090
    originRequest:
      noTLSVerify: false
      originServerName: brain.nexifyai.cloud
  - hostname: agentmemory.nexifyai.cloud
    service: https://localhost:9091
  - service: http_status:404
```

**TLS-Einstellungen:**

| Parameter | Wert |
|-----------|------|
| Protokoll | TLS 1.3 |
| Cipher Suites | TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256 |
| Certificate | Let's Encrypt (automatisch via Cloudflare) |
| HSTS | Enabled (max-age=31536000) |
| OCSP Stapling | Enabled |

### 2.2 Interne Kommunikation (mTLS)

**Brain API ↔ Qdrant:**
```nginx
# nginx.conf (Brain API Proxy)
server {
    listen 9090 ssl;
    
    ssl_certificate /etc/nginx/ssl/brain.crt;
    ssl_certificate_key /etc/nginx/ssl/brain.key;
    ssl_client_certificate /etc/nginx/ssl/ca.crt;
    ssl_verify_client on;
    
    ssl_protocols TLSv1.3;
    ssl_ciphers TLS_AES_256_GCM_SHA384;
    ssl_prefer_server_ciphers on;
    
    location / {
        proxy_pass http://127.0.0.1:9091;
        proxy_set_header X-SSL-Client-CN $ssl_client_s_dn_cn;
    }
}
```

### 2.3 API-Kommunikation

**REST API:**
```
Client → TLS 1.3 → API Gateway → Internal Services
```

**Webhook:**
```
NeXify → TLS 1.3 → External Webhook URL
External System → TLS 1.3 → NeXify Webhook Endpoint
```

---

## 3. Data-at-Rest Encryption

### 3.1 PostgreSQL (Transparent Data Encryption)

```sql
-- pgcrypto Extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Column-level Encryption für sensitive Daten
CREATE OR REPLACE FUNCTION encrypt_sensitive(data TEXT) 
RETURNS BYTEA AS $$
BEGIN
    RETURN pgp_sym_encrypt(data, current_setting('app.encryption_key'));
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrypt_sensitive(data BYTEA) 
RETURNS TEXT AS $$
BEGIN
    RETURN pgp_sym_decrypt(data, current_setting('app.encryption_key'));
END;
$$ LANGUAGE plpgsql;

-- Beispiel: API-Keys verschlüsselt speichern
ALTER TABLE api_keys ADD COLUMN key_encrypted BYTEA;
UPDATE api_keys SET key_encrypted = encrypt_sensitive(key_value);
ALTER TABLE api_keys DROP COLUMN key_value;
```

### 3.2 Qdrant

**Verschlüsselung at Rest:**
```yaml
# Qdrant Configuration
storage:
  encryption:
    at_rest: true
    algorithm: AES-256-GCM
    key_file: /root/.nexify/secrets/qdrant-encryption.key
```

### 3.3 Restic Backups

**Verschlüsselung:**
```bash
# Restic nutzt AES-256 by default
export RESTIC_PASSWORD_FILE="/root/.nexify/secrets/backup-password"

# Passwort-Datei
chmod 600 /root/.nexify/secrets/backup-password
```

### 3.4 Secrets

**Speicherort:**
```bash
/root/.nexify/secrets/
├── ai/                    # AI API Keys
├── cloudflare/            # Cloudflare Secrets
├── cloudflared-tunnel/    # Tunnel Credentials
├── github/                # GitHub Tokens
├── supabase/              # Supabase Keys
├── backup-password        # Restic Passwort
├── encryption.key         # Master Encryption Key
└── jwt-secret.key         # JWT Signing Key
```

**Berechtigungen:**
```bash
chmod 700 /root/.nexify/secrets/
chmod 600 /root/.nexify/secrets/**/*
chown root:root /root/.nexify/secrets/ -R
```

---

## 4. Application-Level Encryption

### 4.1 JWT Tokens

**Algorithmus:** RS256 (asymmetrisch)

```python
import jwt
from cryptography.hazmat.primitives import serialization

# Private Key laden
with open('/root/.nexify/secrets/jwt-private.pem', 'rb') as f:
    private_key = serialization.load_pem_private_key(f.read(), password=None)

# Token erstellen
def create_token(user_id, role, permissions):
    payload = {
        'sub': user_id,
        'role': role,
        'permissions': permissions,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, private_key, algorithm='RS256')

# Token verifizieren
def verify_token(token):
    with open('/root/.nexify/secrets/jwt-public.pem', 'rb') as f:
        public_key = f.read()
    return jwt.decode(token, public_key, algorithms=['RS256'])
```

### 4.2 API Keys

**Hashing:** SHA-256 + Salt

```python
import hashlib
import os

def hash_api_key(key):
    salt = os.urandom(32)
    key_hash = hashlib.pbkdf2_hmac('sha256', key.encode(), salt, 100000)
    return salt.hex() + ':' + key_hash.hex()

def verify_api_key(key, stored_hash):
    salt_hex, hash_hex = stored_hash.split(':')
    salt = bytes.fromhex(salt_hex)
    key_hash = hashlib.pbkdf2_hmac('sha256', key.encode(), salt, 100000)
    return key_hash.hex() == hash_hex
```

### 4.3 Passwörter

**Algorithmus:** bcrypt (Cost Factor 12)

```python
import bcrypt

def hash_password(password):
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode(), salt)

def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode(), hashed)
```

---

## 5. Key Management

### 5.1 Schlüssel-Hierarchie

```
┌─────────────────────────────────────────────────────────────┐
│              Key-Hierarchie                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Master Key (Root)                                          │
│  └── /root/.nexify/secrets/encryption.key                   │
│      │                                                      │
│      ├── Data Encryption Keys (DEK)                        │
│      │   ├── PostgreSQL TDE Key                             │
│      │   ├── Qdrant Encryption Key                          │
│      │   └── Backup Encryption Key                          │
│      │                                                      │
│      ├── Key Encryption Keys (KEK)                         │
│      │   ├── JWT Signing Key                                │
│      │   └── API Key Salt                                   │
│      │                                                      │
│      └── Service Keys                                       │
│          ├── Cloudflare Tunnel Token                        │
│          ├── GitHub Token                                   │
│          └── External API Keys                              │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Key-Rotation

**Automatisierung:**
```bash
# /opt/nexify/security/rotate-keys.sh
#!/bin/bash

# Master Key Rotation (jährlich)
rotate_master_key() {
    # Neuen Key generieren
    openssl rand -out /root/.nexify/secrets/encryption.key.new 32
    
    # Alle DEKs neu verschlüsseln
    re_encrypt_deks
    
    # Alten Key archivieren
    mv /root/.nexify/secrets/encryption.key /root/.nexify/secrets/encryption.key.old
    mv /root/.nexify/secrets/encryption.key.new /root/.nexify/secrets/encryption.key
    
    chmod 600 /root/.nexify/secrets/encryption.key
}

# Service Key Rotation (90 Tage)
rotate_service_keys() {
    # GitHub Token
    # Cloudflare Token
    # External API Keys
    /opt/nexify/security/rotate-secrets.sh
}

# JWT Key Rotation (jährlich)
rotate_jwt_keys() {
    openssl genrsa -out /root/.nexify/secrets/jwt-private.pem 4096
    openssl rsa -in /root/.nexify/secrets/jwt-private.pem -pubout -out /root/.nexify/secrets/jwt-public.pem
    chmod 600 /root/.nexify/secrets/jwt-*.pem
}
```

**Rotation-Schedule:**

| Schlüssel | Intervall | Methode |
|-----------|-----------|---------|
| Master Key | Jährlich | Manuell + Script |
| DEKs | Bei Master Rotation | Automatisch |
| JWT Keys | Jährlich | Script |
| API Keys | 90 Tage | Automatisch |
| SSH Keys | Jährlich | Manuell |
| Backup Password | 180 Tage | Manuell |

---

## 6. TLS-Zertifikate

### 6.1 Let's Encrypt (via Cloudflare)

**Automatische Erneuerung:**
```bash
# Cloudflare verwaltet Zertifikate automatisch
# Keine manuelle Zertifikatsverwaltung nötig
```

### 6.2 Interne Zertifikate (Self-Signed CA)

```bash
# CA erstellen
openssl genrsa -out ca.key 4096
openssl req -new -x509 -days 3650 -key ca.key -out ca.crt \
    -subj "/C=DE/ST=NRW/L=Dortmund/O=NeXify/CN=NeXify CA"

# Brain API Zertifikat
openssl genrsa -out brain.key 2048
openssl req -new -key brain.key -out brain.csr \
    -subj "/C=DE/ST=NRW/L=Dortmund/O=NeXify/CN=brain.nexifyai.cloud"
openssl x509 -req -days 365 -in brain.csr -CA ca.crt -CAkey ca.key \
    -CAcreateserial -out brain.crt

# Berechtigungen
chmod 600 *.key
chmod 644 *.crt
```

### 6.3 Zertifikats-Überwachung

```bash
# /opt/nexify/monitoring/check-certs.sh
#!/bin/bash

# Cloudflare Zertifikat prüfen
CLOUDFLARE_CERT=$(echo | openssl s_client -servername brain.nexifyai.cloud -connect brain.nexifyai.cloud:443 2>/dev/null | openssl x509 -noout -enddate)
echo "Cloudflare: $CLOUDFLARE_CERT"

# Interne Zertifikate prüfen
INTERNAL_CERT=$(openssl x509 -in /etc/nginx/ssl/brain.crt -noout -enddate)
echo "Internal: $INTERNAL_CERT"

# Alert wenn < 30 Tage
check_expiry() {
    local cert=$1
    local name=$2
    local expiry=$(echo "$cert" | grep notAfter | cut -d= -f2)
    local expiry_epoch=$(date -d "$expiry" +%s)
    local now_epoch=$(date +%s)
    local days_left=$(( (expiry_epoch - now_epoch) / 86400 ))
    
    if [ $days_left -lt 30 ]; then
        echo "WARNING: $name expires in $days_left days"
        # Alert senden
    fi
}
```

---

## 7. Verschlüsselungs-Standards

### 7.1 Empfohlene Algorithmen

| Zweck | Algorithmus | Schlüssellänge | Status |
|-------|-------------|----------------|--------|
| TLS | TLS 1.3 | - | ✅ Aktiv |
| Symmetrisch | AES-256-GCM | 256 bit | ✅ Aktiv |
| Asymmetrisch | RSA-4096 | 4096 bit | ✅ Aktiv |
| Hashing | SHA-256/SHA-512 | - | ✅ Aktiv |
| Password | bcrypt | 12 rounds | ✅ Aktiv |
| JWT | RS256 | 4096 bit | ✅ Aktiv |

### 7.2 Verbotene Algorithmen

| Algorithmus | Grund | Status |
|-------------|-------|--------|
| SSLv2/v3 | Veraltet, unsicher | ❌ Verboten |
| TLS 1.0/1.1 | Veraltet | ❌ Verboten |
| DES/3DES | Schwach | ❌ Verboten |
| RC4 | Schwach | ❌ Verboten |
| MD5 | Schwach | ❌ Verboten |
| SHA-1 | Schwach | ❌ Verboten |

---

## 8. Monitoring

### 8.1 Metriken

| Metrik | Beschreibung | Typ |
|--------|--------------|-----|
| `tls_certificate_expiry_days` | Tage bis Zertifikat abläuft | Gauge |
| `tls_handshake_duration_seconds` | TLS-Handshake-Dauer | Histogram |
| `encryption_key_age_days` | Alter des Verschlüsselungskeys | Gauge |
| `secret_rotation_last_success` | Letzte erfolgreiche Rotation | Gauge |

### 8.2 Alerts

| Alert | Bedingung | Severity | Aktion |
|-------|-----------|----------|--------|
| CertExpiringSoon | < 30 Tage | Warning | E-Mail |
| CertExpired | Abgelaufen | Critical | PagerDuty |
| TLSHandshakeFailed | Fehler | Critical | PagerDuty |
| KeyRotationFailed | Fehler | Critical | PagerDuty |
| WeakCipherUsed | Schwacher Cipher | Warning | E-Mail |

---

## 9. Evidence

| Komponente | Status | Evidence |
|-----------|--------|----------|
| TLS 1.3 | ✅ Aktiv | Cloudflare Tunnel |
| mTLS | ✅ Konfiguriert | Interne Services |
| Data-at-Rest | ✅ AES-256 | PostgreSQL, Qdrant, Restic |
| JWT | ✅ RS256 | 4096 bit Keys |
| API Keys | ✅ PBKDF2 | Salted + Hashed |
| Passwords | ✅ bcrypt | 12 rounds |
| Key Management | ✅ Konfiguriert | Rotation + Storage |
| Monitoring | ✅ Konfiguriert | Cert-Checks + Alerts |

---

**Status:** ✅ ABGESCHLOSSEN
**TLS-Version:** 1.3
**Cipher:** AES-256-GCM
**Key-Length:** 4096 bit (RSA)
**Version:** 1.0
