"""JWT + password helpers and the admin-session dependency (httpOnly cookie based)."""
import os
from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from fastapi import HTTPException, Request
from passlib.context import CryptContext

from lib.db import db

SESSION_COOKIE = "hpl_session"
JWT_ALGO = "HS256"
SESSION_DAYS = 7
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def _secret() -> str:
    return os.environ.get("JWT_SECRET", "hpl-dev-secret-change-me")


def hash_password(raw: str) -> str:
    return pwd_context.hash(raw)


def verify_password(raw: str, hashed: str) -> bool:
    try:
        return pwd_context.verify(raw, hashed)
    except Exception:
        return False


def create_token(username: str) -> str:
    now = datetime.now(timezone.utc)
    payload: dict[str, Any] = {"sub": username, "exp": now + timedelta(days=SESSION_DAYS), "iat": now}
    return jwt.encode(payload, _secret(), algorithm=JWT_ALGO)


def decode_token(token: str) -> str | None:
    try:
        sub = jwt.decode(token, _secret(), algorithms=[JWT_ALGO]).get("sub")
        return sub if isinstance(sub, str) else None
    except Exception:
        return None


async def current_admin(request: Request) -> dict[str, Any]:
    token = request.cookies.get(SESSION_COOKIE)
    username = decode_token(token) if token else None
    if not username:
        raise HTTPException(status_code=401, detail="Not authenticated")
    admin = await db.admins.find_one({"username": username})
    if not admin:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return admin
