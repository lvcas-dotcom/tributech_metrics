from datetime import datetime, timedelta
from typing import List, Optional

from pydantic import BaseModel


class ProjectItem(BaseModel):
    id: int
    name: str


class UserItem(BaseModel):
    id: int
    username: str


class IssuesAssignedSummary(BaseModel):
    issues_feitas_atrasadas: int
    issues_feitas: int
    issues_totais: int


class UserMetricsCatalogItem(BaseModel):
    username: str
    email: str
    horas_apontadas: float
    issues_assignadas: IssuesAssignedSummary
    atividade_semanal: List[float]


class TaskItem(BaseModel):
    id: int
    title: str
    projeto: str


class TaskWithHoursItem(BaseModel):
    project: str
    issue_id: int
    title: str
    user: Optional[str]
    hours: float
    status: str
    blocked_time: Optional[timedelta]
    init_todo: Optional[datetime]
    due_date: Optional[datetime]
    closed_at: Optional[datetime]
