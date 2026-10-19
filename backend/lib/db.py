"""Shared Mongo handle — import `client`/`db` from here."""
import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING, DESCENDING, IndexModel

load_dotenv(Path(__file__).parent.parent / ".env")

client = AsyncIOMotorClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]
logger = logging.getLogger(__name__)

INDEXES: dict[str, list[IndexModel]] = {
    "admins": [IndexModel([("username", ASCENDING)], name="username", unique=True)],
    "leads": [
        IndexModel([("id", ASCENDING)], name="id", unique=True),
        IndexModel([("created_at", DESCENDING)], name="created_desc"),
        IndexModel([("status", ASCENDING), ("created_at", DESCENDING)], name="status_created"),
        IndexModel([("service", ASCENDING)], name="service"),
    ],
    "settings": [IndexModel([("id", ASCENDING)], name="id", unique=True)],
}
for _name in ("services", "apps", "testimonials", "portfolio", "faqs", "banners"):
    INDEXES[_name] = [
        IndexModel([("id", ASCENDING)], name="id", unique=True),
        IndexModel([("slug", ASCENDING)], name="slug"),
        IndexModel([("active", ASCENDING), ("order", ASCENDING)], name="active_order"),
    ]


async def ensure_indexes() -> None:
    for collection, models in INDEXES.items():
        for model in models:
            try:
                await db[collection].create_indexes([model])
            except Exception as exc:
                logger.error("ensure_indexes(%s.%s): %s", collection, model.document["name"], exc)
