import os
import json
import uuid
import asyncio
import logging
from datetime import datetime, timezone, timedelta

import jwt
import bcrypt
from fastapi import APIRouter, HTTPException, Request, Response, Depends
from pydantic import BaseModel, EmailStr

logger = logging.getLogger("nexify.portal")
router = APIRouter()

_DB = None
_SEND_EMAIL = None
_CI_EMAIL = None
FRONTEND_URL = ""
JWT_ALGORITHM = "HS256"
LOGIN_ATTEMPTS: dict[str, list] = {}


def init(db_getter, send_email, ci_email, frontend_url: str):
    global _DB, _SEND_EMAIL, _CI_EMAIL, FRONTEND_URL
    _DB = db_getter
    _SEND_EMAIL = send_email
    _CI_EMAIL = ci_email
    FRONTEND_URL = frontend_url


def secret() -> str:
    return os.environ["JWT_SECRET"]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def make_token(payload: dict, hours: int) -> str:
    return jwt.encode({**payload, "exp": datetime.now(timezone.utc) + timedelta(hours=hours)}, secret(), algorithm=JWT_ALGORITHM)


def create_invite_token(email: str, offer_id: str) -> str:
    return make_token({"type": "invite", "email": email, "offer_id": offer_id}, hours=24 * 14)


def set_auth_cookies(response: Response, user_id: str, email: str, role: str):
    access = make_token({"type": "access", "sub": user_id, "email": email, "role": role}, hours=12)
    refresh = make_token({"type": "refresh", "sub": user_id}, hours=24 * 7)
    response.set_cookie("access_token", access, httponly=True, secure=True, samesite="lax", max_age=43200, path="/")
    response.set_cookie("refresh_token", refresh, httponly=True, secure=True, samesite="lax", max_age=604800, path="/")


def user_dict(row) -> dict:
    return {
        "id": str(row["id"]), "email": row["email"], "name": row["name"], "company": row["company"],
        "phone": row["phone"], "language": row["language"], "role": row["role"],
    }


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, secret(), algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid token type")
    pool = await _DB()
    if not pool:
        raise HTTPException(status_code=503, detail="Database unavailable")
    async with pool.acquire() as con:
        row = await con.fetchrow("select * from nexify_users where id = $1", uuid.UUID(payload["sub"]))
    if not row:
        raise HTTPException(status_code=401, detail="User not found")
    return user_dict(row)


async def get_admin(user: dict = Depends(get_current_user)) -> dict:
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return user


class RegisterIn(BaseModel):
    email: EmailStr
    password: str
    name: str
    company: str | None = None
    phone: str | None = None
    language: str = "de"
    invite_token: str | None = None


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class ProfileIn(BaseModel):
    name: str
    company: str | None = None
    phone: str | None = None
    language: str = "de"


class DecisionIn(BaseModel):
    decision: str
    note: str | None = None


class MessageIn(BaseModel):
    body: str


class OfferRequestNewIn(BaseModel):
    description: str


class AdminEmailIn(BaseModel):
    to: EmailStr
    subject: str
    body: str
    language: str = "de"


@router.post("/api/auth/register")
async def register(body: RegisterIn, response: Response):
    email = body.email.lower().strip()
    if len(body.password) < 8:
        raise HTTPException(status_code=400, detail="Passwort muss mindestens 8 Zeichen haben.")
    pool = await _DB()
    async with pool.acquire() as con:
        existing = await con.fetchrow("select id from nexify_users where email = $1", email)
        if existing:
            raise HTTPException(status_code=409, detail="Für diese E-Mail existiert bereits ein Konto. Bitte einloggen.")
        uid = uuid.uuid4()
        await con.execute(
            "insert into nexify_users (id,email,password_hash,name,company,phone,language,role) values ($1,$2,$3,$4,$5,$6,$7,'customer')",
            uid, email, hash_password(body.password), body.name, body.company, body.phone, body.language,
        )
        row = await con.fetchrow("select * from nexify_users where id = $1", uid)
    set_auth_cookies(response, str(uid), email, "customer")
    return user_dict(row)


@router.post("/api/auth/login")
async def login(body: LoginIn, request: Request, response: Response):
    email = body.email.lower().strip()
    key = f"{request.client.host if request.client else 'x'}:{email}"
    now = datetime.now(timezone.utc)
    attempts = [t for t in LOGIN_ATTEMPTS.get(key, []) if (now - t).total_seconds() < 900]
    if len(attempts) >= 5:
        raise HTTPException(status_code=429, detail="Zu viele Fehlversuche. Bitte in 15 Minuten erneut versuchen.")
    pool = await _DB()
    async with pool.acquire() as con:
        row = await con.fetchrow("select * from nexify_users where email = $1", email)
    if not row or not verify_password(body.password, row["password_hash"]):
        attempts.append(now)
        LOGIN_ATTEMPTS[key] = attempts
        raise HTTPException(status_code=401, detail="E-Mail oder Passwort ist falsch.")
    LOGIN_ATTEMPTS.pop(key, None)
    set_auth_cookies(response, str(row["id"]), email, row["role"])
    return user_dict(row)


@router.post("/api/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"status": "ok"}


@router.get("/api/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user


@router.post("/api/auth/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, secret(), algorithms=[JWT_ALGORITHM])
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid token type")
    pool = await _DB()
    async with pool.acquire() as con:
        row = await con.fetchrow("select * from nexify_users where id = $1", uuid.UUID(payload["sub"]))
    if not row:
        raise HTTPException(status_code=401, detail="User not found")
    set_auth_cookies(response, str(row["id"]), row["email"], row["role"])
    return user_dict(row)


@router.get("/api/auth/invite/{token}")
async def invite_info(token: str):
    try:
        payload = jwt.decode(token, secret(), algorithms=[JWT_ALGORITHM])
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Einladungslink ungültig oder abgelaufen.")
    if payload.get("type") != "invite":
        raise HTTPException(status_code=400, detail="Ungültiger Token.")
    return {"email": payload["email"], "offer_id": payload.get("offer_id")}


@router.put("/api/auth/profile")
async def update_profile(body: ProfileIn, user: dict = Depends(get_current_user)):
    pool = await _DB()
    async with pool.acquire() as con:
        await con.execute(
            "update nexify_users set name=$1, company=$2, phone=$3, language=$4 where id=$5",
            body.name, body.company, body.phone, body.language, uuid.UUID(user["id"]),
        )
        row = await con.fetchrow("select * from nexify_users where id = $1", uuid.UUID(user["id"]))
    return user_dict(row)


def offer_dict(row) -> dict:
    return {
        "id": str(row["id"]), "name": row["name"], "email": row["email"], "company": row["company"],
        "language": row["language"], "offer": json.loads(row["offer_json"]) if row["offer_json"] else None,
        "price_total": float(row["price_total"]) if row["price_total"] is not None else None,
        "status": row["status"], "created_at": row["created_at"].isoformat(),
    }


@router.get("/api/portal/offers")
async def my_offers(user: dict = Depends(get_current_user)):
    pool = await _DB()
    async with pool.acquire() as con:
        rows = await con.fetch("select * from nexify_offers where lower(email) = $1 order by created_at desc", user["email"].lower())
    return [offer_dict(r) for r in rows]


@router.post("/api/portal/offers/{offer_id}/decision")
async def offer_decision(offer_id: str, body: DecisionIn, user: dict = Depends(get_current_user)):
    if body.decision not in ("accepted", "declined"):
        raise HTTPException(status_code=400, detail="decision must be accepted or declined")
    pool = await _DB()
    async with pool.acquire() as con:
        row = await con.fetchrow("select * from nexify_offers where id = $1 and lower(email) = $2", uuid.UUID(offer_id), user["email"].lower())
        if not row:
            raise HTTPException(status_code=404, detail="Angebot nicht gefunden.")
        await con.execute("update nexify_offers set status=$1 where id=$2", body.decision, uuid.UUID(offer_id))
        if body.note:
            await con.execute(
                "insert into nexify_offer_messages (id,offer_id,sender,body) values ($1,$2,'customer',$3)",
                uuid.uuid4(), uuid.UUID(offer_id), body.note,
            )
    label = "ANGENOMMEN ✔" if body.decision == "accepted" else "ABGELEHNT ✕"
    offer = json.loads(row["offer_json"]) if row["offer_json"] else {}
    asyncio.create_task(_SEND_EMAIL(
        os.environ.get("INTERNAL_NOTIFY_EMAIL"),
        f"Angebot {label}: {user['name']} ({user['email']})",
        _CI_EMAIL(
            f"Angebot {label}",
            f"<p><b>{user['name']}</b> ({user['email']}, {user['company'] or '-'}) hat das Angebot „{offer.get('title','')}“ <b>{label}</b>.</p><p>Notiz: {body.note or '—'}</p>",
            cta_label="Im CRM öffnen", cta_url=f"{FRONTEND_URL}/admin",
        ),
    ))
    return {"status": body.decision}


@router.get("/api/portal/offers/{offer_id}/messages")
async def offer_messages(offer_id: str, user: dict = Depends(get_current_user)):
    pool = await _DB()
    async with pool.acquire() as con:
        own = await con.fetchrow("select id from nexify_offers where id = $1 and lower(email) = $2", uuid.UUID(offer_id), user["email"].lower())
        if not own and user["role"] != "admin":
            raise HTTPException(status_code=404, detail="Angebot nicht gefunden.")
        rows = await con.fetch("select * from nexify_offer_messages where offer_id = $1 order by created_at asc", uuid.UUID(offer_id))
    return [{"id": str(r["id"]), "sender": r["sender"], "body": r["body"], "created_at": r["created_at"].isoformat()} for r in rows]


@router.post("/api/portal/offers/{offer_id}/messages")
async def post_offer_message(offer_id: str, body: MessageIn, user: dict = Depends(get_current_user)):
    pool = await _DB()
    async with pool.acquire() as con:
        row = await con.fetchrow("select * from nexify_offers where id = $1 and lower(email) = $2", uuid.UUID(offer_id), user["email"].lower())
        if not row:
            raise HTTPException(status_code=404, detail="Angebot nicht gefunden.")
        mid = uuid.uuid4()
        await con.execute("insert into nexify_offer_messages (id,offer_id,sender,body) values ($1,$2,'customer',$3)", mid, uuid.UUID(offer_id), body.body)
    offer = json.loads(row["offer_json"]) if row["offer_json"] else {}
    asyncio.create_task(_SEND_EMAIL(
        os.environ.get("INTERNAL_NOTIFY_EMAIL"),
        f"Neue Rückfrage zum Angebot von {user['name']}",
        _CI_EMAIL("Neue Rückfrage", f"<p><b>{user['name']}</b> ({user['email']}) fragt zum Angebot „{offer.get('title','')}“:</p><p style='border-left:2px solid #52525b;padding-left:12px;'>{body.body}</p>", cta_label="Im CRM antworten", cta_url=f"{FRONTEND_URL}/admin"),
    ))
    return {"status": "ok", "id": str(mid)}


@router.post("/api/portal/offers/request-new")
async def request_new_offer(body: OfferRequestNewIn, user: dict = Depends(get_current_user)):
    pool = await _DB()
    lead_id = uuid.uuid4()
    async with pool.acquire() as con:
        await con.execute(
            "insert into nexify_leads (id,name,email,company,phone,language,message,source) values ($1,$2,$3,$4,$5,$6,$7,'portal_request')",
            lead_id, user["name"], user["email"], user["company"], user["phone"], user["language"], body.description,
        )
    asyncio.create_task(_SEND_EMAIL(
        os.environ.get("INTERNAL_NOTIFY_EMAIL"),
        f"Neue Angebotsanfrage aus dem Kundenportal: {user['name']}",
        _CI_EMAIL("Neue Angebotsanfrage", f"<p><b>{user['name']}</b> ({user['email']}, {user['company'] or '-'}) bittet um ein neues Angebot:</p><p style='border-left:2px solid #52525b;padding-left:12px;'>{body.description}</p>", cta_label="Im CRM öffnen", cta_url=f"{FRONTEND_URL}/admin"),
    ))
    nl = user["language"] == "nl"
    return {"status": "ok", "message": "Aanvraag ontvangen – wij melden ons binnen één werkdag." if nl else "Anfrage erhalten – wir melden uns innerhalb eines Werktags."}


# ---------------- ADMIN / CRM ----------------

@router.get("/api/admin/stats")
async def admin_stats(_: dict = Depends(get_admin)):
    pool = await _DB()
    async with pool.acquire() as con:
        leads = await con.fetchval("select count(*) from nexify_leads")
        offers = await con.fetchval("select count(*) from nexify_offers")
        accepted = await con.fetchval("select count(*) from nexify_offers where status='accepted'")
        declined = await con.fetchval("select count(*) from nexify_offers where status='declined'")
        sessions = await con.fetchval("select count(*) from nexify_chat_sessions")
        users = await con.fetchval("select count(*) from nexify_users where role='customer'")
        pipeline = await con.fetchval("select coalesce(sum(price_total),0) from nexify_offers where status in ('sent','followed_up')")
        won = await con.fetchval("select coalesce(sum(price_total),0) from nexify_offers where status='accepted'")
    return {"leads": leads, "offers": offers, "accepted": accepted, "declined": declined, "chat_sessions": sessions, "customers": users, "pipeline_value": float(pipeline), "won_value": float(won)}


@router.get("/api/admin/leads")
async def admin_leads(_: dict = Depends(get_admin)):
    pool = await _DB()
    async with pool.acquire() as con:
        rows = await con.fetch("select * from nexify_leads order by created_at desc limit 200")
    return [{
        "id": str(r["id"]), "name": r["name"], "email": r["email"], "company": r["company"], "phone": r["phone"],
        "language": r["language"], "message": r["message"], "source": r["source"], "status": r["status"],
        "created_at": r["created_at"].isoformat(),
    } for r in rows]


@router.get("/api/admin/offers")
async def admin_offers(_: dict = Depends(get_admin)):
    pool = await _DB()
    async with pool.acquire() as con:
        rows = await con.fetch("select * from nexify_offers order by created_at desc limit 200")
    return [offer_dict(r) for r in rows]


@router.post("/api/admin/offers/{offer_id}/messages")
async def admin_offer_reply(offer_id: str, body: MessageIn, admin: dict = Depends(get_admin)):
    pool = await _DB()
    async with pool.acquire() as con:
        row = await con.fetchrow("select * from nexify_offers where id = $1", uuid.UUID(offer_id))
        if not row:
            raise HTTPException(status_code=404, detail="Angebot nicht gefunden.")
        mid = uuid.uuid4()
        await con.execute("insert into nexify_offer_messages (id,offer_id,sender,body) values ($1,$2,'admin',$3)", mid, uuid.UUID(offer_id), body.body)
    nl = row["language"] == "nl"
    offer = json.loads(row["offer_json"]) if row["offer_json"] else {}
    subject = f"Antwort zu Ihrem Angebot – {offer.get('title','NeXify AI')}" if not nl else f"Reactie op uw offerte – {offer.get('title','NeXify AI')}"
    greeting = f"Beste {row['name']}," if nl else f"Guten Tag {row['name']},"
    asyncio.create_task(_SEND_EMAIL(
        row["email"], subject,
        _CI_EMAIL(subject, f"<p>{greeting}</p><p style='border-left:2px solid #52525b;padding-left:12px;'>{body.body}</p><p>{'Met vriendelijke groet' if nl else 'Mit besten Grüßen'},<br/>Pascal Courbois · NeXify AI</p>", cta_label="Zum Kundenportal" if not nl else "Naar het klantportaal", cta_url=f"{FRONTEND_URL}/konto"),
    ))
    return {"status": "ok", "id": str(mid)}


@router.get("/api/admin/sessions")
async def admin_sessions(_: dict = Depends(get_admin)):
    pool = await _DB()
    async with pool.acquire() as con:
        rows = await con.fetch(
            """select s.id, s.language, s.created_at, count(m.id) as msg_count, max(m.created_at) as last_at
               from nexify_chat_sessions s left join nexify_chat_messages m on m.session_id = s.id
               group by s.id order by coalesce(max(m.created_at), s.created_at) desc limit 100"""
        )
    return [{
        "id": str(r["id"]), "language": r["language"], "created_at": r["created_at"].isoformat(),
        "msg_count": r["msg_count"], "last_at": r["last_at"].isoformat() if r["last_at"] else None,
    } for r in rows]


@router.get("/api/admin/sessions/{session_id}/messages")
async def admin_session_messages(session_id: str, _: dict = Depends(get_admin)):
    pool = await _DB()
    async with pool.acquire() as con:
        rows = await con.fetch("select * from nexify_chat_messages where session_id = $1 order by created_at asc", uuid.UUID(session_id))
    return [{"id": str(r["id"]), "role": r["role"], "content": r["content"], "created_at": r["created_at"].isoformat()} for r in rows]


@router.post("/api/admin/email")
async def admin_send_email(body: AdminEmailIn, admin: dict = Depends(get_admin)):
    html = _CI_EMAIL(body.subject, "".join(f"<p>{p}</p>" for p in body.body.split("\n") if p.strip()))
    email_id = await _SEND_EMAIL(body.to, body.subject, html)
    if not email_id:
        raise HTTPException(status_code=502, detail="E-Mail-Versand fehlgeschlagen.")
    return {"status": "sent", "email_id": email_id}


@router.post("/api/portal/offers/{offer_id}/pay")
async def pay_offer(offer_id: str, user: dict = Depends(get_current_user)):
    import httpx
    pool = await _DB()
    async with pool.acquire() as con:
        row = await con.fetchrow("select * from nexify_offers where id = $1 and lower(email) = $2", uuid.UUID(offer_id), user["email"].lower())
    if not row:
        raise HTTPException(status_code=404, detail="Angebot nicht gefunden.")
    if row["status"] != "accepted":
        raise HTTPException(status_code=400, detail="Bitte nehmen Sie das Angebot zuerst an.")
    if row["payment_status"] == "completed":
        return {"status": "completed"}
    if row["payment_checkout_url"] and row["payment_status"] in ("pending", "processing", "authorised"):
        return {"checkout_url": row["payment_checkout_url"], "order_id": row["payment_order_id"]}
    nl = row["language"] == "nl"
    offer = json.loads(row["offer_json"]) if row["offer_json"] else {}
    payload = {
        "amount": 99900,
        "currency": "EUR",
        "capture_mode": "automatic",
        "merchant_order_ext_ref": offer_id,
        "description": f"NeXify AI – {'Aanbetaling 1e werkdag' if nl else 'Anzahlung 1. Arbeitstag'}: {offer.get('title','')[:100]}",
        "redirect_url": f"{FRONTEND_URL}/konto?paid={offer_id}",
    }
    base = os.environ.get("REVOLUT_API_BASE", "https://merchant.revolut.com")
    headers = {"Authorization": f"Bearer {os.environ['REVOLUT_SECRET_KEY']}", "Content-Type": "application/json", "Revolut-Api-Version": "2024-09-01"}
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            resp = await client.post(f"{base}/api/orders", json=payload, headers=headers)
        except httpx.RequestError as e:
            raise HTTPException(status_code=502, detail=f"Revolut nicht erreichbar: {e}")
    if resp.status_code not in (200, 201):
        logger.error(f"revolut order failed: {resp.status_code} {resp.text[:300]}")
        raise HTTPException(status_code=502, detail="Zahlung konnte nicht initialisiert werden.")
    data = resp.json()
    async with pool.acquire() as con:
        await con.execute(
            "update nexify_offers set payment_order_id=$1, payment_checkout_url=$2, payment_status=$3, payment_amount=$4 where id=$5",
            data["id"], data.get("checkout_url"), data.get("state", "pending").lower(), 999, uuid.UUID(offer_id),
        )
    return {"checkout_url": data.get("checkout_url"), "order_id": data["id"]}


@router.get("/api/portal/offers/{offer_id}/payment-status")
async def payment_status(offer_id: str, user: dict = Depends(get_current_user)):
    import httpx
    pool = await _DB()
    async with pool.acquire() as con:
        row = await con.fetchrow("select * from nexify_offers where id = $1 and lower(email) = $2", uuid.UUID(offer_id), user["email"].lower())
    if not row or not row["payment_order_id"]:
        raise HTTPException(status_code=404, detail="Keine Zahlung vorhanden.")
    base = os.environ.get("REVOLUT_API_BASE", "https://merchant.revolut.com")
    headers = {"Authorization": f"Bearer {os.environ['REVOLUT_SECRET_KEY']}", "Revolut-Api-Version": "2024-09-01"}
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            resp = await client.get(f"{base}/api/orders/{row['payment_order_id']}", headers=headers)
        except httpx.RequestError as e:
            raise HTTPException(status_code=502, detail=f"Revolut nicht erreichbar: {e}")
    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail="Status konnte nicht geprüft werden.")
    state = resp.json().get("state", "pending").lower()
    async with pool.acquire() as con:
        await con.execute("update nexify_offers set payment_status=$1 where id=$2", state, uuid.UUID(offer_id))
    if state == "completed" and row["payment_status"] != "completed":
        offer = json.loads(row["offer_json"]) if row["offer_json"] else {}
        asyncio.create_task(_SEND_EMAIL(
            os.environ.get("INTERNAL_NOTIFY_EMAIL"),
            f"ZAHLUNG EINGEGANGEN: {user['name']} – € 999",
            _CI_EMAIL("Zahlung eingegangen", f"<p><b>{user['name']}</b> ({user['email']}) hat die Anzahlung (1. Arbeitstag, € 999) für „{offer.get('title','')}“ bezahlt.</p>", cta_label="Im CRM öffnen", cta_url=f"{FRONTEND_URL}/admin"),
        ))
    return {"status": state}


async def seed_admin(db_getter):
    email = os.environ.get("ADMIN_EMAIL", "").lower().strip()
    password = os.environ.get("ADMIN_PASSWORD", "")
    if not email or not password:
        return
    pool = await db_getter()
    if not pool:
        return
    async with pool.acquire() as con:
        row = await con.fetchrow("select * from nexify_users where email = $1", email)
        if row is None:
            await con.execute(
                "insert into nexify_users (id,email,password_hash,name,role,language) values ($1,$2,$3,'Pascal Courbois','admin','de')",
                uuid.uuid4(), email, hash_password(password),
            )
            logger.info("admin seeded")
        elif not verify_password(password, row["password_hash"]):
            await con.execute("update nexify_users set password_hash=$1, role='admin' where email=$2", hash_password(password), email)
            logger.info("admin password updated")
