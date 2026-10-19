"""Lead capture (public, rate limited) + admin lead management, stats and CSV export."""
import csv
import io
import time
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse

from lib.auth import current_admin
from lib.dates import today_iso
from lib.db import db
from models.schemas import Lead, LeadCreate, LeadStats, LeadStatusUpdate, MessageOut

router = APIRouter(tags=["leads"])
_WINDOW_SECONDS = 600
_MAX_PER_WINDOW = 5
_hits: dict[str, list[float]] = defaultdict(list)


def _rate_limit(request: Request) -> None:
    fwd = request.headers.get("x-forwarded-for", "").split(",")[0].strip()
    ip = fwd or (request.client.host if request.client else "unknown")
    now = time.time()
    recent = [t for t in _hits[ip] if now - t < _WINDOW_SECONDS]
    if len(recent) >= _MAX_PER_WINDOW:
        raise HTTPException(status_code=429, detail="Too many enquiries. Please try again shortly.")
    recent.append(now)
    _hits[ip] = recent


def _aware(value: Any) -> datetime:
    if isinstance(value, datetime):
        return value if value.tzinfo else value.replace(tzinfo=timezone.utc)
    return datetime.now(timezone.utc)


def _to_lead(doc: dict[str, Any]) -> Lead:
    doc.pop("_id", None)
    doc["created_at"] = _aware(doc.get("created_at"))
    return Lead(**doc)


@router.post("/leads", response_model=Lead)
async def create_lead(payload: LeadCreate, request: Request):
    _rate_limit(request)
    lead = Lead(**payload.model_dump())
    await db.leads.insert_one(lead.model_dump())
    return lead


@router.get("/admin/leads", response_model=list[Lead])
async def list_leads(status: str | None = None, service: str | None = None, q: str | None = None,
                     _admin: dict[str, Any] = Depends(current_admin)):
    query: dict[str, Any] = {}
    if status and status != "all":
        query["status"] = status
    if service and service != "all":
        query["service"] = service
    if q:
        query["$or"] = [{f: {"$regex": q, "$options": "i"}} for f in ("name", "phone", "email", "message")]
    docs = await db.leads.find(query).sort("created_at", -1).to_list(2000)
    return [_to_lead(d) for d in docs]


@router.patch("/admin/leads/{lead_id}", response_model=Lead)
async def update_lead_status(lead_id: str, payload: LeadStatusUpdate, _admin: dict[str, Any] = Depends(current_admin)):
    if (await db.leads.update_one({"id": lead_id}, {"$set": {"status": payload.status}})).matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return _to_lead(await db.leads.find_one({"id": lead_id}) or {})


@router.delete("/admin/leads/{lead_id}", response_model=MessageOut)
async def delete_lead(lead_id: str, _admin: dict[str, Any] = Depends(current_admin)):
    if (await db.leads.delete_one({"id": lead_id})).deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return MessageOut(message="Lead deleted")


@router.get("/admin/leads-stats", response_model=LeadStats)
async def lead_stats(_admin: dict[str, Any] = Depends(current_admin)):
    docs = await db.leads.find().to_list(5000)
    today = today_iso()
    by_status: dict[str, int] = {"New": 0, "Contacted": 0, "Won": 0, "Lost": 0}
    per_day: dict[str, int] = {}
    today_count = 0
    for doc in docs:
        st = str(doc.get("status", "New"))
        by_status[st] = by_status.get(st, 0) + 1
        day = _aware(doc.get("created_at")).date().isoformat()
        per_day[day] = per_day.get(day, 0) + 1
        if day == today:
            today_count += 1
    start = datetime.now(timezone.utc).date() - timedelta(days=13)
    daily = [{"date": (start + timedelta(days=i)).isoformat(),
              "count": per_day.get((start + timedelta(days=i)).isoformat(), 0)} for i in range(14)]
    return LeadStats(total=len(docs), today=today_count, by_status=by_status, daily=daily)


@router.get("/admin/leads-export")
async def export_leads(_admin: dict[str, Any] = Depends(current_admin)):
    docs = await db.leads.find().sort("created_at", -1).to_list(5000)
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["Name", "Phone", "Email", "Service", "City", "Budget", "Status", "Message", "Created"])
    for doc in docs:
        l = _to_lead(doc)
        writer.writerow([l.name, l.phone, l.email or "", l.service, l.city or "", l.budget or "", l.status,
                         l.message.replace("\n", " "), l.created_at.isoformat()])
    return StreamingResponse(iter([buffer.getvalue()]), media_type="text/csv",
                             headers={"Content-Disposition": "attachment; filename=hpl-leads.csv"})
