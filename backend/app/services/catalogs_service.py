from datetime import date
from typing import Optional, Sequence, List

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.catalogs_repository import CatalogsRepository
from app.schemas.catalogs import ProjectItem, UserItem, TaskItem


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
    ) -> List[UserItem]:
        return await self.repo.list_users(start_date, end_date, projects)

    async def tasks(
        self,
        start_date: date,
        end_date: date,
        projects: Optional[Sequence[str]],
        users: Optional[Sequence[str]],
    ) -> List[TaskItem]:
        return await self.repo.list_tasks(start_date, end_date, projects, users)
