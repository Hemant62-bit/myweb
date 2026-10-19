import uuid
from datetime import datetime, timezone
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


def _uuid() -> str:
    return str(uuid.uuid4())


def _now() -> datetime:
    return datetime.now(timezone.utc)


LeadStatus = Literal["New", "Contacted", "Won", "Lost"]


class LoginRequest(BaseModel):
    username: str
    password: str


class AdminOut(BaseModel):
    username: str
    name: str = "Administrator"
    must_change_password: bool = False


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8, max_length=128)


class MessageOut(BaseModel):
    message: str


class LeadCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    phone: str = Field(min_length=7, max_length=20)
    email: str | None = Field(default=None, max_length=120)
    service: str = Field(min_length=2, max_length=80)
    city: str | None = Field(default=None, max_length=80)
    budget: str | None = Field(default=None, max_length=60)
    message: str = Field(default="", max_length=2000)

    @field_validator("phone")
    @classmethod
    def _digits(cls, v: str) -> str:
        if len("".join(ch for ch in v if ch.isdigit())) < 7:
            raise ValueError("phone must contain at least 7 digits")
        return v.strip()


class Lead(BaseModel):
    id: str = Field(default_factory=_uuid)
    name: str
    phone: str
    email: str | None = None
    service: str
    city: str | None = None
    budget: str | None = None
    message: str = ""
    status: LeadStatus = "New"
    created_at: datetime = Field(default_factory=_now)


class LeadStatusUpdate(BaseModel):
    status: LeadStatus


class LeadStats(BaseModel):
    total: int
    today: int
    by_status: dict[str, int]
    daily: list[dict[str, Any]]


class ContentItem(BaseModel):
    model_config = ConfigDict(extra="allow")
    id: str = Field(default_factory=_uuid)
    slug: str | None = None
    title: str | None = None
    order: int = 0
    active: bool = True


class SiteSettings(BaseModel):
    model_config = ConfigDict(extra="allow")
    brand: str = "HPL"
    tagline: str = "Digital Solution & Automation"
    phone: str = "9074520224"
    whatsapp: str = "919074520224"
    email: str = "hpl.digi1@gmail.com"
    address: str = "Dewas, Madhya Pradesh"
    facebook: str = ""
    instagram: str = ""
    linkedin: str = ""
    youtube: str = ""


class UploadOut(BaseModel):
    url: str
    filename: str
