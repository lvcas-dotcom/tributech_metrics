from datetime import date
from typing import List, Optional, Sequence

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.metrics_repository import MetricsRepository
from app.schemas.metrics import (
    MetricByTask,
    MetricByUserMonth,
    MetricByUserProjectMonth,
    IssueAssignedByUser,
    HelpHoursByUser,
    HighPriorityIssue,
    IssuesCreatedByProject,
    IssuesCompletionByProject,
)


class MetricsService:
    def __init__(self, session: AsyncSession) -> None:
        self.repo = MetricsRepository(session)

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

    async def issues_assigned_by_user(
        self,
        projects: Optional[Sequence[str]],
        users: Optional[Sequence[str]],
    ) -> List[IssueAssignedByUser]:
        return await self.repo.fetch_issues_assigned_by_user(projects, users)

    async def help_hours_by_user(
        self,
        start_date: date,
        end_date: date,
        projects: Optional[Sequence[str]],
        users: Optional[Sequence[str]],
    ) -> List[HelpHoursByUser]:
        return await self.repo.fetch_help_hours_by_user(
            start_date, end_date, projects, users
        )

    async def high_priority_issues(
        self,
        projects: Optional[Sequence[str]],
    ) -> List[HighPriorityIssue]:
        return await self.repo.fetch_high_priority_issues(projects)

    async def issues_created_by_project(
        self,
        start_date: date,
        end_date: date,
        projects: Optional[Sequence[str]],
    ) -> List[IssuesCreatedByProject]:
        return await self.repo.fetch_issues_created_by_project(
            start_date, end_date, projects
        )

    async def issues_completion_by_project(
        self,
        start_date: date,
        end_date: date,
        projects: Optional[Sequence[str]],
    ) -> List[IssuesCompletionByProject]:
        return await self.repo.fetch_issues_completion_by_project(
            start_date, end_date, projects
        )
