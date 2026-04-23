"""
Авторизация и регистрация игроков КРМП.
Методы: POST /register, POST /login, GET /me, POST /logout
"""
import json
import os
import hashlib
import secrets
import psycopg2

SCHEMA = "t_p28465274_crm_site_black_orang"


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
    }


def ok(data: dict, status: int = 200):
    return {"statusCode": status, "headers": {**cors_headers(), "Content-Type": "application/json"}, "body": json.dumps(data, ensure_ascii=False)}


def err(msg: str, status: int = 400):
    return {"statusCode": status, "headers": {**cors_headers(), "Content-Type": "application/json"}, "body": json.dumps({"error": msg}, ensure_ascii=False)}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers(), "body": ""}

    method = event.get("httpMethod", "GET")
    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")
    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    token = (event.get("headers") or {}).get("X-Session-Token") or (event.get("headers") or {}).get("x-session-token")

    # --- REGISTER ---
    if action == "register" and method == "POST":
        username = (body.get("username") or "").strip()
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""
        nickname = (body.get("nickname") or username).strip()

        if not username or not email or not password:
            return err("Заполни все поля")
        if len(username) < 3 or len(username) > 32:
            return err("Никнейм от 3 до 32 символов")
        if len(password) < 6:
            return err("Пароль минимум 6 символов")
        if "@" not in email:
            return err("Неверный формат email")

        pw_hash = hash_password(password)
        session_token = secrets.token_hex(32)
        avatar_letter = username[0].upper()

        conn = get_conn()
        cur = conn.cursor()
        try:
            cur.execute(
                f"INSERT INTO {SCHEMA}.players (username, email, password_hash, nickname, avatar_letter, session_token) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id, username, nickname, faction, rank, money, bank, level, hours_played, warnings, created_at",
                (username, email, pw_hash, nickname, avatar_letter, session_token)
            )
            row = cur.fetchone()
            conn.commit()
        except psycopg2.errors.UniqueViolation:
            conn.rollback()
            return err("Игрок с таким ником или email уже существует")
        finally:
            cur.close()
            conn.close()

        player = {
            "id": row[0], "username": row[1], "nickname": row[2],
            "faction": row[3], "rank": row[4], "money": row[5],
            "bank": row[6], "level": row[7], "hours_played": row[8],
            "warnings": row[9], "avatar_letter": avatar_letter,
            "created_at": str(row[10])
        }
        return ok({"token": session_token, "player": player})

    # --- LOGIN ---
    if action == "login" and method == "POST":
        username = (body.get("username") or "").strip()
        password = body.get("password") or ""

        if not username or not password:
            return err("Введи никнейм и пароль")

        pw_hash = hash_password(password)
        session_token = secrets.token_hex(32)

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, username, nickname, faction, rank, money, bank, level, hours_played, warnings, avatar_letter, created_at FROM {SCHEMA}.players WHERE (username=%s OR email=%s) AND password_hash=%s",
            (username, username.lower(), pw_hash)
        )
        row = cur.fetchone()
        if not row:
            cur.close()
            conn.close()
            return err("Неверный никнейм или пароль", 401)

        cur.execute(f"UPDATE {SCHEMA}.players SET session_token=%s WHERE id=%s", (session_token, row[0]))
        conn.commit()
        cur.close()
        conn.close()

        player = {
            "id": row[0], "username": row[1], "nickname": row[2],
            "faction": row[3], "rank": row[4], "money": row[5],
            "bank": row[6], "level": row[7], "hours_played": row[8],
            "warnings": row[9], "avatar_letter": row[10],
            "created_at": str(row[11])
        }
        return ok({"token": session_token, "player": player})

    # --- ME ---
    if action == "me" and method == "GET":
        if not token:
            return err("Не авторизован", 401)

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, username, nickname, faction, rank, money, bank, level, hours_played, warnings, avatar_letter, created_at FROM {SCHEMA}.players WHERE session_token=%s",
            (token,)
        )
        row = cur.fetchone()
        cur.close()
        conn.close()

        if not row:
            return err("Сессия устарела", 401)

        player = {
            "id": row[0], "username": row[1], "nickname": row[2],
            "faction": row[3], "rank": row[4], "money": row[5],
            "bank": row[6], "level": row[7], "hours_played": row[8],
            "warnings": row[9], "avatar_letter": row[10],
            "created_at": str(row[11])
        }
        return ok({"player": player})

    # --- LOGOUT ---
    if action == "logout" and method == "POST":
        if token:
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(f"UPDATE {SCHEMA}.players SET session_token=NULL WHERE session_token=%s", (token,))
            conn.commit()
            cur.close()
            conn.close()
        return ok({"ok": True})

    return err("Не найдено", 404)