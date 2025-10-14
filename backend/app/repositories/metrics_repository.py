from datetime import date
from typing import List, Optional, Sequence, Dict, Any

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.metrics import (
    MetricByTask,
    MetricByUserMonth,
    MetricByUserProjectMonth,
    IssueAssignedByUser,
    HelpHoursByUser,
    HighPriorityIssue,
)


class MetricsRepository:
    SQL_BY_TASK = text(
        """
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
        FROM timelogs t
        JOIN users u    ON u.id = t.user_id
        JOIN issues i   ON i.id = t.issue_id
        JOIN projects p ON p.id = i.project_id
        WHERE t.spent_at::date BETWEEN :start_date AND :end_date
          AND (:projects_is_null OR p.name = ANY(:projects))
          AND (:users_is_null OR u.username = ANY(:users))
        GROUP BY u.username, DATE_TRUNC('month', t.spent_at)
        ORDER BY u.username, mes
    """
    )

    SQL_BY_USER_PROJECT_MONTH = text(
        """
        SELECT
            u.username AS usuario,
            p.name      AS projeto,
            DATE_TRUNC('month', t.spent_at)::date AS mes,
            SUM(t.time_spent) / 3600.0 AS horas_apontadas
        FROM timelogs t
        JOIN users u    ON u.id = t.user_id
        JOIN issues i   ON i.id = t.issue_id
        JOIN projects p ON p.id = i.project_id
        WHERE t.spent_at::date BETWEEN :start_date AND :end_date
          AND (:projects_is_null OR p.name = ANY(:projects))
          AND (:users_is_null OR u.username = ANY(:users))
        GROUP BY u.username, p.name, DATE_TRUNC('month', t.spent_at)
        ORDER BY u.username, p.name, mes
    """
    )

    SQL_ISSUES_ASSIGNED_BY_USER = text(
        """
        SELECT
            u.username AS usuario,
            DATE_TRUNC('month', CURRENT_DATE)::date AS mes,
            COUNT(DISTINCT ia.issue_id) AS total_issues_assinadas,
            p.name AS projeto
        FROM issue_assignees ia
        JOIN users u    ON u.id = ia.user_id
        JOIN issues i   ON i.id = ia.issue_id
        JOIN projects p ON p.id = i.project_id
        WHERE i.closed_at IS NULL
          AND (:projects_is_null OR p.name = ANY(:projects))
          AND (:users_is_null OR u.username = ANY(:users))
        GROUP BY u.username, p.name
        ORDER BY u.username
    """
    )

    SQL_HELP_HOURS_BY_USER = text(
        """
        WITH ia_unique AS (
            SELECT DISTINCT issue_id, user_id
            FROM issue_assignees
        )
        SELECT
            u.username AS usuario,
            DATE_TRUNC('month', t.spent_at)::date AS mes,
            ROUND(SUM(CASE WHEN iau.user_id IS NULL THEN t.time_spent ELSE 0 END) / 3600.0, 2) AS horas_ajuda,
            ROUND(SUM(t.time_spent) / 3600.0, 2) AS horas_totais_mes,
            ROUND(
                (SUM(t.time_spent) - SUM(CASE WHEN iau.user_id IS NULL THEN t.time_spent ELSE 0 END)) / 3600.0
            , 2) AS horas_liquidas
        FROM timelogs t
        JOIN users u    ON u.id = t.user_id
        JOIN issues i   ON i.id = t.issue_id
        JOIN projects p ON p.id = i.project_id
        LEFT JOIN ia_unique iau
               ON iau.issue_id = i.id AND iau.user_id = u.id
        WHERE t.spent_at::date BETWEEN :start_date AND :end_date
          AND (:projects_is_null OR p.name = ANY(:projects))
          AND (:users_is_null OR u.username = ANY(:users))
        GROUP BY u.username, DATE_TRUNC('month', t.spent_at)
        ORDER BY u.username, mes
    """
    )

    SQL_HIGH_PRIORITY_ISSUES = text(
        """
        SELECT
            i.iid         AS issue_id,
            i.title      AS titulo_issue,
            p.name       AS projeto,
            l.title      AS label,
            i.created_at,
            i.updated_at
        FROM label_links    ll
        JOIN labels         l  ON l.id = ll.label_id
        JOIN issues         i  ON i.id = ll.target_id
        JOIN projects       p  ON p.id = i.project_id
        WHERE ll.target_type = 'Issue'
          AND l.title = 'P_Alta'
          AND i.closed_at IS NULL
          AND (:projects_is_null OR p.name = ANY(:projects))
        ORDER BY i.created_at DESC
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
        return [MetricByUserProjectMonth(**r) for r in rows]

    async def fetch_issues_assigned_by_user(
        self,
        projects: Optional[Sequence[str]],
        users: Optional[Sequence[str]],
    ) -> List[IssueAssignedByUser]:
        params = {
            "projects": list(projects) if projects else [],
            "users": list(users) if users else [],
            "projects_is_null": projects is None or len(projects) == 0,
            "users_is_null": users is None or len(users) == 0,
        }
        rows = (
            (await self.session.execute(self.SQL_ISSUES_ASSIGNED_BY_USER, params))
            .mappings()
            .all()
        )
        return [IssueAssignedByUser(**r) for r in rows]

    async def fetch_help_hours_by_user(
        self,
        start_date: date,
        end_date: date,
        projects: Optional[Sequence[str]],
        users: Optional[Sequence[str]],
    ) -> List[HelpHoursByUser]:
        params = self._bind_params(start_date, end_date, projects, users)
        rows = (
            (await self.session.execute(self.SQL_HELP_HOURS_BY_USER, params))
            .mappings()
            .all()
        )
        return [HelpHoursByUser(**r) for r in rows]

    async def fetch_high_priority_issues(
        self,
        projects: Optional[Sequence[str]],
    ) -> List[HighPriorityIssue]:
        params = {
            "projects": list(projects) if projects else [],
            "projects_is_null": projects is None or len(projects) == 0,
        }
        rows = (
            (await self.session.execute(self.SQL_HIGH_PRIORITY_ISSUES, params))
            .mappings()
            .all()
        )
        return [HighPriorityIssue(**r) for r in rows]
