"""Admin auth: cookie session login/logout, /me, forced password change."""
import os
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Response

from lib.auth import SESSION_COOKIE, SESSION_DAYS, create_token, current_admin, hash_password, verify_password
from lib.db import db
from models.schemas import AdminOut, ChangePasswordRequest, LoginRequest, MessageOut

router = APIRouter(prefix="/auth", tags=["auth"])


def _cookie_opts() -> dict[str, Any]:
    return {
        "httponly": True,
        "secure": os.environ.get("COOKIE_SECURE", "false").lower() == "true",
        "samesite": os.environ.get("COOKIE_SAMESITE", "lax"),
        "path": "/",
    }


async def ensure_default_admin() -> None:
    username = os.environ.get("ADMIN_USERNAME", "admin")
    password = os.environ.get("ADMIN_PASSWORD", "HplAdmin@2024")
    if await db.admins.find_one({"username": username}):
        return
    await db.admins.insert_one({
        "username": username, "name": "HPL Administrator",
        "password_hash": hash_password(password), "must_change_password": True,
    })


def _out(admin: dict[str, Any]) -> AdminOut:
    return AdminOut(username=admin["username"], name=admin.get("name", "Administrator"),
                    must_change_password=bool(admin.get("must_change_password", False)))


@router.post("/login", response_model=AdminOut)
async def login(payload: LoginRequest, response: Response):
    admin = await db.admins.find_one({"username": payload.username.strip()})
    if not admin or not verify_password(payload.password, admin.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    response.set_cookie(SESSION_COOKIE, create_token(admin["username"]),
                        max_age=SESSION_DAYS * 24 * 3600, **_cookie_opts())
    return _out(admin)


@router.post("/logout", response_model=MessageOut)
async def logout(response: Response):
    o = _cookie_opts()
    response.delete_cookie(SESSION_COOKIE, path="/", secure=o["secure"], samesite=o["samesite"])
    return MessageOut(message="Signed out")


@router.get("/me", response_model=AdminOut)
async def me(admin: dict[str, Any] = Depends(current_admin)):
    return _out(admin)


@router.post("/change-password", response_model=AdminOut)
async def change_password(payload: ChangePasswordRequest, admin: dict[str, Any] = Depends(current_admin)):
    if not verify_password(payload.current_password, admin.get("password_hash", "")):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if payload.current_password == payload.new_password:
        raise HTTPException(status_code=400, detail="New password must be different")
    await db.admins.update_one({"username": admin["username"]},
        {"$set": {"password_hash": hash_password(payload.new_password), "must_change_password": False}})
    updated = await db.admins.find_one({"username": admin["username"]})
    return _out(updated or admin)
