from datetime import date
from typing import Optional, Sequence, Dict, Any, List

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.catalogs import (
    ProjectItem,
    TaskWithHoursItem,
)


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

    SQL_USERS_SUMMARY = text(
        """
        WITH timelog_filtered AS (
            SELECT
                t.user_id,
                t.issue_id,
                SUM(t.time_spent) AS total_time_spent
            FROM timelogs t
            JOIN issues i   ON i.id = t.issue_id
            JOIN projects p ON p.id = i.project_id
            JOIN issue_assignees ia
              ON ia.issue_id = t.issue_id
             AND ia.user_id = t.user_id
            WHERE t.spent_at::date BETWEEN :start_date AND :end_date
              AND (:projects_is_null OR p.name = ANY(:projects))
            GROUP BY t.user_id, t.issue_id
        )
        SELECT
            u.username AS username,
            u.email AS email,
            ROUND(COALESCE(SUM(tf.total_time_spent), 0) / 3600.0, 2) AS horas_apontadas,
            COUNT(DISTINCT tf.issue_id) AS issues_totais,
            COUNT(DISTINCT CASE
                WHEN i.closed_at IS NOT NULL
                     AND i.closed_at::date BETWEEN :start_date AND :end_date
                THEN tf.issue_id
            END) AS issues_feitas,
            COUNT(DISTINCT CASE
                WHEN i.closed_at IS NOT NULL
                     AND i.due_date IS NOT NULL
                     AND i.closed_at::date > i.due_date::date
                     AND i.closed_at::date BETWEEN :start_date AND :end_date
                THEN tf.issue_id
            END) AS issues_feitas_atrasadas
        FROM timelog_filtered tf
        JOIN users u ON u.id = tf.user_id
        JOIN issues i ON i.id = tf.issue_id
        GROUP BY u.username, u.email
        ORDER BY u.username
    """
    )

    SQL_USERS_WEEKLY_ACTIVITY = text(
        """
        SELECT
            u.username AS username,
            t.spent_at::date AS dia,
            ROUND(SUM(t.time_spent) / 3600.0, 2) AS horas
        FROM timelogs t
        JOIN users u    ON u.id = t.user_id
        JOIN issues i   ON i.id = t.issue_id
        JOIN projects p ON p.id = i.project_id
        JOIN issue_assignees ia
          ON ia.issue_id = t.issue_id
         AND ia.user_id = t.user_id
        WHERE t.spent_at::date BETWEEN :start_date AND :end_date
          AND (:projects_is_null OR p.name = ANY(:projects))
        GROUP BY u.username, t.spent_at::date
        ORDER BY u.username, t.spent_at::date
    """
    )

    SQL_LIST_TASKS = text(
        """
        WITH proj AS (
            SELECT p.id, p.name
            FROM projects p
            WHERE (:projects_is_null OR p.name = ANY(:projects))
        ),
        todo_events AS (
            SELECT
                rle.issue_id,
                MIN(rle.created_at) AS todo_start_time
            FROM proj p
            JOIN issues i
                ON p.id = i.project_id
            JOIN resource_label_events rle
                ON i.id = rle.issue_id
            JOIN labels l
                ON rle.label_id = l.id
            WHERE
                rle.action = 1
                AND (
                    (p.name = 'geo' AND l.title = 'ST_To Do') OR
                    (p.name = 'suporte-geo' AND l.title = 'ST_1_To_Do') OR
                    (p.name = 'suporte-reurb' AND l.title = 'ST_1_Todo') OR
                    (p.name = 'suporte-saovicente' AND l.title = 'To Do')
                )
            GROUP BY rle.issue_id
        ),
        issue_assignees_list AS (
            SELECT
                ia.issue_id,
                CASE
                    WHEN COUNT(u.id) = 1 THEN MAX(u.username)
                    WHEN COUNT(u.id) > 1 THEN 'Múltiplos'
                    ELSE NULL
                END AS usuario_responsavel
            FROM issue_assignees ia
            JOIN users u ON ia.user_id = u.id
            GROUP BY ia.issue_id
        )
        SELECT
            p.name AS project,
            i.iid AS issue_id,
            i.title AS title,
            asl.usuario_responsavel AS user,
            ROUND(COALESCE(SUM(t.time_spent), 0) / 3600.0, 2)
                AS hours,
            CASE
                WHEN i.closed_at IS NULL THEN 'Em Andamento'
                WHEN i.due_date IS NOT NULL
                    AND i.closed_at::date > i.due_date::date
                    THEN 'Concluída (Atrasada)'
                WHEN i.closed_at IS NOT NULL
                    AND (i.due_date IS NULL
                         OR i.closed_at::date <= i.due_date::date)
                    THEN 'Concluída (No Prazo)'
                ELSE 'Em Andamento'
            END AS status,
            (i.closed_at - todo.todo_start_time) AS blocked_time,
            todo.todo_start_time AS init_todo,
            i.due_date,
            i.closed_at
        FROM proj p
        JOIN issues i
            ON p.id = i.project_id
        LEFT JOIN todo_events todo
            ON i.id = todo.issue_id
        LEFT JOIN timelogs t
            ON i.id = t.issue_id
        INNER JOIN issue_assignees_list asl
            ON asl.issue_id = i.id
        WHERE (todo.todo_start_time::date BETWEEN :start_date AND :end_date) 
        and asl.usuario_responsavel = any(:users)
        GROUP BY
            p.name,
            i.id,
            i.iid,
            i.title,
            asl.usuario_responsavel,
            i.closed_at,
            i.due_date,
            todo.todo_start_time
        ORDER BY
            p.name,
            i.iid
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

    async def list_users_summary(
        self,
        start_date: date,
        end_date: date,
        projects: Optional[Sequence[str]],
    ) -> List[Dict[str, Any]]:
        params = self._bind_params(start_date, end_date, projects, users=None)
        result = await self.session.execute(self.SQL_USERS_SUMMARY, params)
        return result.mappings().all()

    async def list_users_weekly_activity(
        self,
        start_date: date,
        end_date: date,
        projects: Optional[Sequence[str]],
    ) -> List[Dict[str, Any]]:
        params = self._bind_params(start_date, end_date, projects, users=None)
        result = await self.session.execute(self.SQL_USERS_WEEKLY_ACTIVITY, params)
        return result.mappings().all()

    async def list_tasks(
        self,
        start_date: date,
        end_date: date,
        projects: Optional[Sequence[str]],
        users: Optional[Sequence[str]],
    ) -> List[TaskWithHoursItem]:
        params = self._bind_params(start_date, end_date, projects, users)
        rows = (
            (await self.session.execute(self.SQL_LIST_TASKS, params)).mappings().all()
        )
        return [TaskWithHoursItem(**r) for r in rows]
