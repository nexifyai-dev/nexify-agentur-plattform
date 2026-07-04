# Test Credentials – NeXify AI

## Admin (CRM unter /admin)
- E-Mail: mail@nexifyai.cloud
- Passwort: ***REDACTED***
- Rolle: admin

## Test-Kunde (Portal unter /konto)
- E-Mail: support@nexify-automate.com
- Passwort: TestKunde2026!
- Rolle: customer (besitzt mind. 1 Angebot, Status accepted)

## Auth-Endpunkte
- POST /api/auth/register {email,password,name,company?,invite_token?}
- POST /api/auth/login {email,password}  → httpOnly-Cookies access_token/refresh_token
- POST /api/auth/logout, GET /api/auth/me, POST /api/auth/refresh, PUT /api/auth/profile
- GET /api/auth/invite/{token}

## Portal
- GET /api/portal/offers, POST /api/portal/offers/{id}/decision {decision:accepted|declined,note?}
- GET/POST /api/portal/offers/{id}/messages, POST /api/portal/offers/request-new {description}
- POST /api/portal/offers/{id}/pay (Revolut, PRODUKTIONS-KEY!), GET /api/portal/offers/{id}/payment-status

## Admin-CRM
- GET /api/admin/stats|leads|offers|sessions, GET /api/admin/sessions/{id}/messages
- POST /api/admin/offers/{id}/messages {body} (Antwort + E-Mail an Kunden)
- POST /api/admin/email {to,subject,body}

## Hinweise
- E-Mails NUR an support@nexify-automate.com senden (Resend, Domain nexifyai.cloud)
- Revolut ist PRODUKTIV – Checkout-Links erzeugen echte Zahlungsseiten, NICHT bezahlen!
