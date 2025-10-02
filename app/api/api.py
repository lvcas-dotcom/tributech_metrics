from fastapi import APIRouter
from app.api.routes import metrics, catalogs

# Router raiz da aplicação
api_router = APIRouter()

# Apontamentos (métricas)
api_router.include_router(metrics.router, prefix="/metrics")

# Catálogos (filtros para o front)
api_router.include_router(catalogs.router, prefix="/metrics")