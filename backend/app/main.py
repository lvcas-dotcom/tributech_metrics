from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.api import api_router

# -----------------------------------------------------------------------------
# App
# -----------------------------------------------------------------------------
app = FastAPI(
    title="Tributech • Metrics API",
    version="1.0.0",
    openapi_url="/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# -----------------------------------------------------------------------------
# CORS
# -----------------------------------------------------------------------------
# ALLOWED_ORIGINS no .env, ex:
# ALLOWED_ORIGINS=http://localhost:4200,http://127.0.0.1:4200
allowed_origins = [o.strip() for o in settings.ALLOWED_ORIGINS.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------------------------------------------------------
# Healthcheck
# -----------------------------------------------------------------------------
@app.get("/healthz", tags=["Infra"])
def healthz():
    return {"status": "ok"}


# -----------------------------------------------------------------------------
# Routers
# -----------------------------------------------------------------------------
# /metrics/by-task, /metrics/by-project, etc (Apontamentos)
# /metrics/catalog/projects, /metrics/catalog/users, /metrics/catalog/tasks (Catálogos)
app.include_router(api_router)
