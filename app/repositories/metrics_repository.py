<<<<<<< HEAD

from datetime import date
from typing import List, Optional, Sequence
=======
from datetime import date
from typing import List, Optional, Sequence, Dict, Any
>>>>>>> main

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

<<<<<<< HEAD
from app.schemas.metrics import MetricByTask, MetricByUserMonth, MetricByUserProjectMonth

class MetricsRepository:
    SQL_BY_TASK = text("""
=======
from app.schemas.metrics import (
    MetricByTask,
    MetricByUserMonth,
    MetricByUserProjectMonth,
)


class MetricsRepository:
    SQL_BY_TASK = text(
        """
>>>>>>> main
        SELECT
            p.name AS projeto,
            u.username AS usuario,
            i.title AS tarefa,
            SUM(t.time_spent) / 3600.0 AS horas_apontadas,
            t.spent_at::date AS data
        FROM timelogs t
        JOIN users u    ON u.id = t.user_id
        JOIN issues i   ON i.id = t.issue_id
        JOIN projects p ON p.id = i.project_id
<<<<<<< HEAD
        WHERE t.spent_at BETWEEN :start_date AND :end_date
          AND (:projects_is_null OR p.name = ANY(:projects))
          AND (:users_is_null OR u.username = ANY(:users))
        GROUP BY p.name, u.username, i.title, t.spent_at
        ORDER BY u.username, t.spent_at
    """)

    SQL_BY_USER_MONTH = text("""
        SELECT
            u.username AS usuario,
            DATE_TRUNC('month', t.spent_at)::date AS mes,
            ROUND(SUM(t.time_spent) / 3600.0, 2) AS horas_apontadas
=======
        WHERE t.spent_at::date BETWEEN :start_date AND :end_date
          AND (:projects_is_null OR p.name = ANY(:projects))
          AND (:users_is_null OR u.username = ANY(:users))
        GROUP BY p.name, u.username, i.title, t.spent_at::date
        ORDER BY u.username, t.spent_at::date
    """
    )

    SQL_BY_USER_MONTH = text(
        """
        SELECT
            u.username AS usuario,
            DATE_TRUNC('month', t.spent_at)::date AS mes,
            SUM(t.time_spent) / 3600.0 AS horas_apontadas
>>>>>>> main
        FROM timelogs t
        JOIN users u    ON u.id = t.user_id
        JOIN issues i   ON i.id = t.issue_id
        JOIN projects p ON p.id = i.project_id
<<<<<<< HEAD
        WHERE t.spent_at BETWEEN :start_date AND :end_date
=======
        WHERE t.spent_at::date BETWEEN :start_date AND :end_date
>>>>>>> main
          AND (:projects_is_null OR p.name = ANY(:projects))
          AND (:users_is_null OR u.username = ANY(:users))
        GROUP BY u.username, DATE_TRUNC('month', t.spent_at)
        ORDER BY u.username, mes
<<<<<<< HEAD
    """)

    SQL_BY_USER_PROJECT_MONTH = text("""
        SELECT
            u.username AS usuario,
            p.name     AS projeto,
            DATE_TRUNC('month', t.spent_at)::date AS mes,
            ROUND(SUM(t.time_spent) / 3600.0, 2) AS horas_apontadas
=======
    """
    )

    SQL_BY_USER_PROJECT_MONTH = text(
        """
        SELECT
            u.username AS usuario,
            p.name      AS projeto,
            DATE_TRUNC('month', t.spent_at)::date AS mes,
            SUM(t.time_spent) / 3600.0 AS horas_apontadas
>>>>>>> main
        FROM timelogs t
        JOIN users u    ON u.id = t.user_id
        JOIN issues i   ON i.id = t.issue_id
        JOIN projects p ON p.id = i.project_id
<<<<<<< HEAD
        WHERE t.spent_at BETWEEN :start_date AND :end_date
=======
        WHERE t.spent_at::date BETWEEN :start_date AND :end_date
>>>>>>> main
          AND (:projects_is_null OR p.name = ANY(:projects))
          AND (:users_is_null OR u.username = ANY(:users))
        GROUP BY u.username, p.name, DATE_TRUNC('month', t.spent_at)
        ORDER BY u.username, p.name, mes
<<<<<<< HEAD
    """)
=======
    """
    )
>>>>>>> main

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

<<<<<<< HEAD
    def _params(self, start_date: date, end_date: date,
                projects: Optional[Sequence[str]], users: Optional[Sequence[str]]):
=======
    @staticmethod
    def _bind_params(
        start_date: date,
        end_date: date,
        projects: Optional[Sequence[str]],
        users: Optional[Sequence[str]],
    ) -> Dict[str, Any]:
>>>>>>> main
        return {
            "start_date": start_date,
            "end_date": end_date,
            "projects": list(projects) if projects else [],
<<<<<<< HEAD
            "projects_is_null": projects is None or len(projects) == 0,
            "users": list(users) if users else [],
            "users_is_null": users is None or len(users) == 0,
        }

    async def fetch_by_task(self, start_date: date, end_date: date,
                            projects: Optional[Sequence[str]], users: Optional[Sequence[str]]) -> List[MetricByTask]:
        rows = (await self.session.execute(self.SQL_BY_TASK, self._params(start_date, end_date, projects, users))).mappings().all()
        return [MetricByTask(**r) for r in rows]

    async def fetch_by_user_month(self, start_date: date, end_date: date,
                                  projects: Optional[Sequence[str]], users: Optional[Sequence[str]]) -> List[MetricByUserMonth]:
        rows = (await self.session.execute(self.SQL_BY_USER_MONTH, self._params(start_date, end_date, projects, users))).mappings().all()
        return [MetricByUserMonth(**r) for r in rows]

    async def fetch_by_user_project_month(self, start_date: date, end_date: date,
                                          projects: Optional[Sequence[str]], users: Optional[Sequence[str]]) -> List[MetricByUserProjectMonth]:
        rows = (await self.session.execute(self.SQL_BY_USER_PROJECT_MONTH, self._params(start_date, end_date, projects, users))).mappings().all()
=======
            "users": list(users) if users else [],
            "projects_is_null": projects is None or len(projects) == 0,
            "users_is_null": users is None or len(users) == 0,
        }

    async def fetch_by_task(
        self,
        start_date: date,
        end_date: date,
        projects: Optional[Sequence[str]],
        users: Optional[Sequence[str]],
    ) -> List[MetricByTask]:
        params = self._bind_params(start_date, end_date, projects, users)
        rows = (await self.session.execute(self.SQL_BY_TASK, params)).mappings().all()
        return [MetricByTask(**r) for r in rows]

    async def fetch_by_user_month(
        self,
        start_date: date,
        end_date: date,
        projects: Optional[Sequence[str]],
        users: Optional[Sequence[str]],
    ) -> List[MetricByUserMonth]:
        params = self._bind_params(start_date, end_date, projects, users)
        rows = (
            (await self.session.execute(self.SQL_BY_USER_MONTH, params))
            .mappings()
            .all()
        )
        return [MetricByUserMonth(**r) for r in rows]

    async def fetch_by_user_project_month(
        self,
        start_date: date,
        end_date: date,
        projects: Optional[Sequence[str]],
        users: Optional[Sequence[str]],
    ) -> List[MetricByUserProjectMonth]:
        params = self._bind_params(start_date, end_date, projects, users)
        rows = (
            (await self.session.execute(self.SQL_BY_USER_PROJECT_MONTH, params))
            .mappings()
            .all()
        )
>>>>>>> main
        return [MetricByUserProjectMonth(**r) for r in rows]
