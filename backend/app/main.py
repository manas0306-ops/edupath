import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os

from backend.app.config import settings
from backend.app.database import init_db
from backend.app.api.health import router as health_router

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)
logger = logging.getLogger("edupath")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing EduPath Database...")
    await init_db()
    logger.info("EduPath Database successfully initialized.")
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

# Global friendly error handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error processing {request.method} {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An unexpected error occurred while processing your request. Please try again or check the server logs.",
            "error_type": type(exc).__name__
        }
    )

# Include Core Routers
app.include_router(health_router, prefix="/api")

@app.get("/")
async def root():
    return {
        "message": "Welcome to EduPath AI API",
        "documentation": "/docs",
        "health": "/api/health"
    }
