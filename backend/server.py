import asyncio
import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, Request
from fastapi.responses import PlainTextResponse
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from lib.db import client, db, ensure_indexes  # noqa: E402
from routers.auth import ensure_default_admin, router as auth_router  # noqa: E402
from routers.content import router as content_router  # noqa: E402
from routers.leads import router as leads_router  # noqa: E402

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.index_task = asyncio.create_task(ensure_indexes())
    try:
        await ensure_default_admin()
    except Exception as exc:
        logger.error("ensure_default_admin: %s", exc)
    yield
    client.close()


app = FastAPI(lifespan=lifespan, title="HPL Digital Solution & Automation API", docs_url=None, redoc_url=None)
api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {"message": "HPL Digital Solution & Automation API", "status": "ok"}


@api_router.get("/health")
async def health():
    return {"status": "healthy"}


api_router.include_router(auth_router)
api_router.include_router(content_router)
api_router.include_router(leads_router)
app.include_router(api_router)

# credentials=True needs explicit origins (never "*"), so list the real site URLs in CORS_ORIGINS.
_origins = [o.strip() for o in os.environ.get(
    "CORS_ORIGINS", "https://www.hpldigi.in,https://hpldigi.in,http://localhost:3000").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=_origins,
    allow_origin_regex=os.environ.get("CORS_ORIGIN_REGEX") or None,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    return response


@app.get("/robots.txt", response_class=PlainTextResponse, include_in_schema=False)
async def robots():
    site = os.environ.get("SITE_URL", "https://www.hpldigi.in")
    return f"User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: {site}/sitemap.xml\n"


logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
