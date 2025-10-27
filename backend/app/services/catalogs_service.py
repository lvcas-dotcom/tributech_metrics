from datetime import date, timedelta
from typing import Optional, Sequence, List, Dict

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.catalogs_repository import CatalogsRepository
from app.schemas.catalogs import (
    ProjectItem,
    TaskWithHoursItem,
    UserMetricsCatalogItem,
    IssuesAssignedSummary,
)


class CatalogsService:
    def __init__(self, session: AsyncSession) -> None:
        self.repo = CatalogsRepository(session)

    async def projects(self, start_date: date, end_date: date) -> List[ProjectItem]:
        return await self.repo.list_projects(start_date, end_date)

    async def users(
        self,
        start_date: date,
        end_date: date,
        projects: Optional[Sequence[str]],
    ) -> List[UserMetricsCatalogItem]:
        summaries = await self.repo.list_users_summary(start_date, end_date, projects)

        if not summaries:
            return []

        base_date = min(end_date, date.today())
        if base_date < start_date:
            base_date = end_date

        week_start = max(start_date, base_date - timedelta(days=6))
        weekly_rows = await self.repo.list_users_weekly_activity(
            week_start,
            base_date,
            projects,
        )

        weekly_map: Dict[str, Dict[date, float]] = {}
        for row in weekly_rows:
            username = row["username"]
            day = row["dia"]
            weekly_map.setdefault(username, {})[day] = float(row["horas"] or 0.0)

        items: List[UserMetricsCatalogItem] = []
        for summary in summaries:
            username = summary["username"]
            daily_hours: List[float] = []
            for offset in range(7):
                current_day = base_date - timedelta(days=offset)
                if current_day < start_date:
                    daily_hours.append(0.0)
                    continue
                daily_hours.append(
                    weekly_map.get(username, {}).get(current_day, 0.0)
                )

            items.append(
                UserMetricsCatalogItem(
                    username=username,
                    email=summary["email"],
                    horas_apontadas=float(summary["horas_apontadas"] or 0.0),
                    issues_assignadas=IssuesAssignedSummary(
                        issues_feitas_atrasadas=int(
                            summary["issues_feitas_atrasadas"] or 0
                        ),
                        issues_feitas=int(summary["issues_feitas"] or 0),
                        issues_totais=int(summary["issues_totais"] or 0),
                    ),
                    atividade_semanal=daily_hours,
                )
            )

        return items

    async def tasks(
        self,
        start_date: date,
        end_date: date,
        projects: Optional[Sequence[str]],
        users: Optional[Sequence[str]],
    ) -> List[TaskWithHoursItem]:
        return await self.repo.list_tasks(start_date, end_date, projects, users)
