<<<<<<< HEAD

=======
>>>>>>> main
from datetime import date
from typing import List, Optional, Sequence

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.metrics_repository import MetricsRepository
<<<<<<< HEAD
from app.schemas.metrics import MetricByTask, MetricByUserMonth, MetricByUserProjectMonth
=======
from app.schemas.metrics import (
    MetricByTask,
    MetricByUserMonth,
    MetricByUserProjectMonth,
)

>>>>>>> main

class MetricsService:
    def __init__(self, session: AsyncSession) -> None:
        self.repo = MetricsRepository(session)

<<<<<<< HEAD
    async def by_task(self, start_date: date, end_date: date,
                      projects: Optional[Sequence[str]], users: Optional[Sequence[str]]) -> List[MetricByTask]:
        return await self.repo.fetch_by_task(start_date, end_date, projects, users)

    async def by_user_month(self, start_date: date, end_date: date,
                            projects: Optional[Sequence[str]], users: Optional[Sequence[str]]) -> List[MetricByUserMonth]:
        return await self.repo.fetch_by_user_month(start_date, end_date, projects, users)

    async def by_user_project_month(self, start_date: date, end_date: date,
                                    projects: Optional[Sequence[str]], users: Optional[Sequence[str]]) -> List[MetricByUserProjectMonth]:
        return await self.repo.fetch_by_user_project_month(start_date, end_date, projects, users)
=======
    async def by_task(
        self,
        start_date: date,
        end_date: date,
        projects: Optional[Sequence[str]],
        users: Optional[Sequence[str]],
    ) -> List[MetricByTask]:
        return await self.repo.fetch_by_task(start_date, end_date, projects, users)

    async def by_user_month(
        self,
        start_date: date,
        end_date: date,
        projects: Optional[Sequence[str]],
        users: Optional[Sequence[str]],
    ) -> List[MetricByUserMonth]:
        return await self.repo.fetch_by_user_month(
            start_date, end_date, projects, users
        )

    async def by_user_project_month(
        self,
        start_date: date,
        end_date: date,
        projects: Optional[Sequence[str]],
        users: Optional[Sequence[str]],
    ) -> List[MetricByUserProjectMonth]:
        return await self.repo.fetch_by_user_project_month(
            start_date, end_date, projects, users
        )
>>>>>>> main
