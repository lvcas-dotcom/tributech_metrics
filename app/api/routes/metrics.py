from datetime import date, timedelta
from typing import List, Optional, Sequence

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_session
from app.core.config import settings
from app.schemas.metrics import (
    MetricByTask,
    MetricByUserMonth,
    MetricByUserProjectMonth,
)
from app.services.metrics_service import MetricsService

router = APIRouter(tags=["Apontamentos"])


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


def default_projects() -> List[str]:
    return [p.strip() for p in settings.DEFAULT_PROJECTS.split(",") if p.strip()]


@router.get(
    "/by-task",
    response_model=List[MetricByTask],
    summary="Hours by task",
    description=(
        "Retorna as horas apontadas **agrupadas por tarefa** no período informado. "
        "Se `start_date` e `end_date` não forem enviados, o período padrão é o mês atual. "
        "Se `projects` não for enviado, é usada a lista configurada em `DEFAULT_PROJECTS`."
    ),
)
async def by_task(
    start_date: Optional[date] = Query(None, description="Data inicial (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="Data final (YYYY-MM-DD)"),
    projects: Optional[List[str]] = Query(
        None, description="Projetos", example=["geo", "suporte-reurb"]
    ),
    users: Optional[List[str]] = Query(
        None, description="Usernames", example=["lucas"]
    ),
    session: AsyncSession = Depends(get_session),
):
    s, e = default_period(start_date, end_date)
    prjs = projects if projects is not None else default_projects()
    service = MetricsService(session)
    return await service.by_task(s, e, prjs, users)


@router.get(
    "/by-user-month",
    response_model=List[MetricByUserMonth],
    summary="Hours by user per month",
    description=(
        "Retorna o **total de horas por usuário, agregado por mês** dentro do período."
    ),
)
async def by_user_month(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    projects: Optional[List[str]] = Query(None),
    users: Optional[List[str]] = Query(None),
    session: AsyncSession = Depends(get_session),
):
    s, e = default_period(start_date, end_date)
    prjs = projects if projects is not None else default_projects()
    service = MetricsService(session)
    return await service.by_user_month(s, e, prjs, users)


@router.get(
    "/by-user-project-month",
    response_model=List[MetricByUserProjectMonth],
    summary="Hours by user per project per month",
    description="Horas por usuário **por projeto** e **por mês** no período especificado.",
)
async def by_user_project_month(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    projects: Optional[List[str]] = Query(None, example=["geo", "suporte-reurb"]),
    users: Optional[List[str]] = Query(None, example=["lucas"]),
    session: AsyncSession = Depends(get_session),
):
    s, e = default_period(start_date, end_date)
    prjs = projects if projects is not None else default_projects()
    service = MetricsService(session)
    return await service.by_user_project_month(s, e, prjs, users)
