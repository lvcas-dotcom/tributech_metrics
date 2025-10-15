from datetime import date
from typing import Optional, Sequence, Dict, Any, List

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.catalogs import ProjectItem, UserItem, TaskItem


class CatalogsRepository:
    SQL_LIST_PROJECTS = text(
        """
        SELECT
            p.id   AS id,
            p.name AS name
        FROM timelogs t
        JOIN issues i   ON i.id = t.issue_id
        JOIN projects p ON p.id = i.project_id
        WHERE t.spent_at::date BETWEEN :start_date AND :end_date
        GROUP BY p.id, p.name
        ORDER BY p.name
    """
    )

    SQL_LIST_USERS = text(
        """
        SELECT
            u.id        AS id,
            u.username  AS username
        FROM timelogs t
        JOIN users u    ON u.id = t.user_id
        JOIN issues i   ON i.id = t.issue_id
        JOIN projects p ON p.id = i.project_id
        WHERE t.spent_at::date BETWEEN :start_date AND :end_date
          AND (:projects_is_null OR p.name = ANY(:projects))
        GROUP BY u.id, u.username
        ORDER BY u.username
    """
    )

    SQL_LIST_TASKS = text(
        """
        SELECT
            i.iid      AS id,
            i.title   AS title,
            p.name    AS projeto
        FROM timelogs t
        JOIN users u    ON u.id = t.user_id
        JOIN issues i   ON i.id = t.issue_id
        JOIN projects p ON p.id = i.project_id
        WHERE t.spent_at::date BETWEEN :start_date AND :end_date
          AND (:projects_is_null OR p.name = ANY(:projects))
          AND (:users_is_null OR u.username = ANY(:users))
        GROUP BY i.id, i.title, p.name
        ORDER BY i.title
    """
    )

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    @staticmethod
    def _bind_params(
        start_date: date,
        end_date: date,
        projects: Optional[Sequence[str]],
        users: Optional[Sequence[str]],
    ) -> Dict[str, Any]:
        return {
            "start_date": start_date,
            "end_date": end_date,
            "projects": list(projects) if projects else [],
            "users": list(users) if users else [],
            "projects_is_null": projects is None or len(projects) == 0,
            "users_is_null": users is None or len(users) == 0,
        }

    async def list_projects(
        self,
        start_date: date,
        end_date: date,
    ) -> List[ProjectItem]:
        params = {"start_date": start_date, "end_date": end_date}
        rows = (
            (await self.session.execute(self.SQL_LIST_PROJECTS, params))
            .mappings()
            .all()
        )
        return [ProjectItem(**r) for r in rows]

    async def list_users(
        self,
        start_date: date,
        end_date: date,
        projects: Optional[Sequence[str]],
    ) -> List[UserItem]:
        params = self._bind_params(start_date, end_date, projects, users=None)
        rows = (
            (await self.session.execute(self.SQL_LIST_USERS, params)).mappings().all()
        )
        return [UserItem(**r) for r in rows]

    async def list_tasks(
        self,
        start_date: date,
        end_date: date,
        projects: Optional[Sequence[str]],
        users: Optional[Sequence[str]],
    ) -> List[TaskItem]:
        params = self._bind_params(start_date, end_date, projects, users)
        rows = (
            (await self.session.execute(self.SQL_LIST_TASKS, params)).mappings().all()
        )
        return [TaskItem(**r) for r in rows]
