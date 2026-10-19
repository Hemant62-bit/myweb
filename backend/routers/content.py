"""Public reads + admin CRUD for every content collection, plus site settings and uploads."""
import uuid
from pathlib import Path
from typing import Any

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

from lib.auth import current_admin
from lib.db import db
from models.schemas import ContentItem, MessageOut, SiteSettings, UploadOut

router = APIRouter(tags=["content"])
COLLECTIONS = ("services", "apps", "testimonials", "portfolio", "faqs", "banners")
UPLOAD_DIR = Path(__file__).parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
ALLOWED_IMAGE_SUFFIX = {".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"}


def _collection(name: str):
    if name not in COLLECTIONS:
        raise HTTPException(status_code=404, detail="Unknown content collection")
    return db[name]


def _clean(doc: dict[str, Any]) -> dict[str, Any]:
    doc.pop("_id", None)
    return doc


@router.get("/content/{name}", response_model=list[ContentItem])
async def list_content(name: str, include_inactive: bool = False):
    query: dict[str, Any] = {} if include_inactive else {"active": True}
    docs = await _collection(name).find(query).sort("order", 1).to_list(500)
    return [ContentItem(**_clean(d)) for d in docs]


@router.get("/content/{name}/{slug}", response_model=ContentItem)
async def get_content(name: str, slug: str):
    coll = _collection(name)
    doc = await coll.find_one({"slug": slug}) or await coll.find_one({"id": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")
    return ContentItem(**_clean(doc))


@router.get("/settings", response_model=SiteSettings)
async def get_settings():
    doc = await db.settings.find_one({"id": "site"})
    return SiteSettings(**_clean(doc)) if doc else SiteSettings()


@router.post("/admin/content/{name}", response_model=ContentItem)
async def create_content(name: str, item: ContentItem, _admin: dict[str, Any] = Depends(current_admin)):
    payload = item.model_dump()
    await _collection(name).insert_one(dict(payload))
    return ContentItem(**payload)


@router.put("/admin/content/{name}/{item_id}", response_model=ContentItem)
async def update_content(name: str, item_id: str, item: ContentItem, _admin: dict[str, Any] = Depends(current_admin)):
    payload = item.model_dump()
    payload["id"] = item_id
    if (await _collection(name).update_one({"id": item_id}, {"$set": payload})).matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return ContentItem(**payload)


@router.delete("/admin/content/{name}/{item_id}", response_model=MessageOut)
async def delete_content(name: str, item_id: str, _admin: dict[str, Any] = Depends(current_admin)):
    if (await _collection(name).delete_one({"id": item_id})).deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return MessageOut(message="Deleted")


@router.put("/admin/settings", response_model=SiteSettings)
async def update_settings(payload: SiteSettings, _admin: dict[str, Any] = Depends(current_admin)):
    data = payload.model_dump()
    data["id"] = "site"
    await db.settings.update_one({"id": "site"}, {"$set": data}, upsert=True)
    return SiteSettings(**data)


@router.post("/admin/upload", response_model=UploadOut)
async def upload_image(file: UploadFile = File(...), _admin: dict[str, Any] = Depends(current_admin)):
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in ALLOWED_IMAGE_SUFFIX:
        raise HTTPException(status_code=400, detail="Only image files are allowed")
    data = await file.read()
    if len(data) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image must be under 5 MB")
    name = f"{uuid.uuid4()}{suffix}"
    (UPLOAD_DIR / name).write_bytes(data)
    return UploadOut(url=f"/api/uploads/{name}", filename=name)


@router.get("/uploads/{filename}")
async def serve_upload(filename: str):
    path = (UPLOAD_DIR / filename).resolve()
    if not str(path).startswith(str(UPLOAD_DIR.resolve())) or not path.is_file():
        raise HTTPException(status_code=404, detail="Not found")
    return FileResponse(path)
