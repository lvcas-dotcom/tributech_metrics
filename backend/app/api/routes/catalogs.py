from datetime import date, timedelta
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_session
from app.services.catalogs_service import CatalogsService
from app.schemas.catalogs import (
    ProjectItem,
    TaskWithHoursItem,
    UserMetricsCatalogItem,
)

router = APIRouter(tags=["Catálogos"])


# =========================
# Helpers de período
# (mantém o mesmo padrão dos apontamentos)
# =========================


def month_bounds(d: date):
    first = d.replace(day=1)
    if first.month == 12:
        nxt = first.replace(year=first.year + 1, month=1)
    else:
        nxt = first.replace(month=first.month + 1)
    last = nxt - timedelta(days=1)
    return first, last


def default_period(start_date: Optional[date], end_date: Optional[date]):
    if start_date and end_date:
        return start_date, end_date
    today = date.today()
    return month_bounds(today)


# =========================
# Catálogos
# =========================


@router.get(
    "/catalog/projects",
    response_model=List[ProjectItem],
    summary="Lista de projetos (com apontamentos no período)",
)
async def catalog_projects(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    session: AsyncSession = Depends(get_session),
):
    s, e = default_period(start_date, end_date)
    service = CatalogsService(session)
    return await service.projects(s, e)


@router.get(
    "/catalog/users",
    response_model=List[UserMetricsCatalogItem],
    summary="Indicadores por usuário no período",
    description=(
        "Retorna dados consolidados por usuário, incluindo horas apontadas,"
        " contagem de issues e atividade diária na última semana."
        " Opcionalmente filtra por `projects`."
    ),
)
async def catalog_users(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    projects: Optional[List[str]] = Query(None),
    session: AsyncSession = Depends(get_session),
):
    s, e = default_period(start_date, end_date)
    prjs = projects if projects is not None else None
    service = CatalogsService(session)
    return await service.users(s, e, prjs)


@router.get(
    "/catalog/tasks",
    response_model=List[TaskWithHoursItem],
    summary="Lista de tarefas com horas por usuário (no período)",
    description=(
        "Retorna tarefas que possuem apontamentos no período, agregadas por "
        "usuário, incluindo horas apontadas. Pode filtrar por `projects` e "
        "`users`."
    ),
)
async def catalog_tasks(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    projects: Optional[List[str]] = Query(None),
    users: Optional[List[str]] = Query(None),
    session: AsyncSession = Depends(get_session),
):
    s, e = default_period(start_date, end_date)
    prjs = projects if projects is not None else None
    usrs = users if users is not None else None
    service = CatalogsService(session)
    return await service.tasks(s, e, prjs, usrs)
