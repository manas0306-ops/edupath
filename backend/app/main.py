import os
import sys
import logging

# Automatically ensure project root is always in sys.path regardless of execution working directory
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "../.."))
BACKEND_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
for p in [PROJECT_ROOT, BACKEND_ROOT]:
    if p not in sys.path:
        sys.path.insert(0, p)

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse, Response
from fastapi.staticfiles import StaticFiles


from backend.app.config import settings
from backend.app.database import init_db
from backend.app.services.demo_seed import seed_demo_data_if_needed
from backend.app.database import AsyncSessionLocal

# Routers
from backend.app.api.health import router as health_router
from backend.app.api.auth import router as auth_router
from backend.app.api.profile import router as profile_router
from backend.app.api.documents import router as documents_router
from backend.app.api.skills import router as skills_router
from backend.app.api.roadmap import router as roadmap_router
from backend.app.api.practice import router as practice_router
from backend.app.api.chat import router as chat_router
from backend.app.api.reports import router as reports_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)
logger = logging.getLogger("edupath")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing EduPath Database...")
    await init_db()
    # Pre-seed demo learner Alex Rivera for instant out-of-the-box demonstration
    async with AsyncSessionLocal() as session:
        try:
            await seed_demo_data_if_needed(session)
            logger.info("Demo user 'Alex Rivera' verified/seeded successfully.")
        except Exception as e:
            logger.warning(f"Demo seeding skipped or already initialized: {e}")
    yield
    logger.info("Shutting down EduPath API...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="EduPath — AI-Powered Personalized Learning & Skill Gap Agent",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error processing {request.method} {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An unexpected error occurred while processing your request. Please try again.",
            "error_type": type(exc).__name__
        }
    )

# Include all API routers
app.include_router(health_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(profile_router, prefix="/api")
app.include_router(documents_router, prefix="/api")
app.include_router(skills_router, prefix="/api")
app.include_router(roadmap_router, prefix="/api")
app.include_router(practice_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(reports_router, prefix="/api")

# Locate frontend dist if built
DIST_DIRS = [
    os.path.abspath(os.path.join(PROJECT_ROOT, "frontend", "dist")),
    os.path.abspath(os.path.join(CURRENT_DIR, "../../frontend/dist")),
    os.path.abspath("frontend/dist")
]
DIST_DIR = next((d for d in DIST_DIRS if os.path.exists(d) and os.path.exists(os.path.join(d, "index.html"))), None)

if DIST_DIR and os.path.exists(os.path.join(DIST_DIR, "assets")):
    app.mount("/assets", StaticFiles(directory=os.path.join(DIST_DIR, "assets")), name="static_assets")

@app.get("/favicon.ico")
async def favicon():
    if DIST_DIR:
        fav_path = os.path.join(DIST_DIR, "favicon.ico")
        if os.path.exists(fav_path):
            return FileResponse(fav_path)
    return Response(content="", media_type="image/x-icon")

@app.get("/")
async def root(request: Request):
    accept = request.headers.get("accept", "")
    if "text/html" in accept and DIST_DIR:
        index_file = os.path.join(DIST_DIR, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
    return {
        "message": "Welcome to EduPath AI API",
        "documentation": "/docs",
        "health": "/api/health"
    }

if DIST_DIR:
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str, request: Request):
        if full_path.startswith("api") or full_path in ["docs", "redoc", "openapi.json"]:
            return JSONResponse(status_code=404, content={"detail": "Not Found"})
        file_path = os.path.join(DIST_DIR, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        index_file = os.path.join(DIST_DIR, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return JSONResponse(status_code=404, content={"detail": "Not Found"})

