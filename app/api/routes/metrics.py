from datetime import date, timedelta
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from app.api.deps import get_session
from app.core.config import settings
from app.schemas.metrics import (
    MetricByTask,
    MetricByUserMonth,
    MetricByUserProjectMonth,
)
from app.services.metrics_service import MetricsService
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(
    tags=["Métricas"],
    responses={404: {"description": "Recurso não encontrado"}},
)


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
    start_date: Optional[date] = Query(
        None,
        description="Data inicial no formato AAAA-MM-DD. Padrão: 1º dia do mês atual.",
        example="2025-09-01",
    ),
    end_date: Optional[date] = Query(
        None,
        description="Data final no formato AAAA-MM-DD. Padrão: último dia do mês atual.",
        example="2025-09-30",
    ),
    projects: Optional[List[str]] = Query(
        None,
        description=(
            "Lista de nomes de projetos a filtrar (ex.: `geo`, `suporte-geo`). "
            "Padrão: valor de `DEFAULT_PROJECTS` nas configurações."
        ),
        example=["suporte-geo", "suporte-saovicente", "suporte-reurb", "geo"],
    ),
    users: Optional[List[str]] = Query(
        None,
        description="Lista de usernames para filtrar. Padrão: todos os usuários.",
        example=["lucas", "bruno.z", "gessica"],
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
        "Retorna o **total de horas por usuário, agregado por mês** dentro do período. "
        "Útil para visões de capacidade e carga mensal por colaborador."
    ),
)
async def by_user_month(
    start_date: Optional[date] = Query(
        None,
        description="Data inicial no formato AAAA-MM-DD. Padrão: 1º dia do mês atual.",
        example="2025-09-01",
    ),
    end_date: Optional[date] = Query(
        None,
        description="Data final no formato AAAA-MM-DD. Padrão: último dia do mês atual.",
        example="2025-09-30",
    ),
    projects: Optional[List[str]] = Query(
        None,
        description=(
            "Lista de nomes de projetos a filtrar. Padrão: valor de `DEFAULT_PROJECTS`."
        ),
        example=["suporte-geo", "geo"],
    ),
    users: Optional[List[str]] = Query(
        None,
        description="Lista de usernames para filtrar. Padrão: todos os usuários.",
        example=["lucas", "jefferson"],
    ),
    session: AsyncSession = Depends(get_session),
):
    s, e = default_period(start_date, end_date)
    prjs = projects if projects is not None else default_projects()
    service = MetricsService(session)
    return await service.by_user_month(s, e, prjs, users)


@router.get(
    "/by-project",
    response_model=List[MetricByUserProjectMonth],
    summary="Hours by user and project per month",
    description=(
        "Retorna horas **por usuário e por projeto**, agregadas por mês, dentro do período. "
        "Ideal para cruzar alocação (quem trabalhou) com destino (em qual projeto)."
    ),
)
async def by_user_project_month(
    start_date: Optional[date] = Query(
        None,
        description="Data inicial no formato AAAA-MM-DD. Padrão: 1º dia do mês atual.",
        example="2025-09-01",
    ),
    end_date: Optional[date] = Query(
        None,
        description="Data final no formato AAAA-MM-DD. Padrão: último dia do mês atual.",
        example="2025-09-30",
    ),
    projects: Optional[List[str]] = Query(
        None,
        description=(
            "Lista de nomes de projetos a filtrar. Padrão: valor de `DEFAULT_PROJECTS`."
        ),
        example=["geo", "suporte-reurb"],
    ),
    users: Optional[List[str]] = Query(
        None,
        description="Lista de usernames para filtrar. Padrão: todos os usuários.",
        example=["lucas"],
    ),
    session: AsyncSession = Depends(get_session),
):
    s, e = default_period(start_date, end_date)
    prjs = projects if projects is not None else default_projects()
    service = MetricsService(session)
    return await service.by_user_project_month(s, e, prjs, users)
