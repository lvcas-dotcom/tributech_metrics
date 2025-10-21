from datetime import date, datetime
from pydantic import BaseModel


class MetricByTask(BaseModel):
    projeto: str
    usuario: str
    tarefa: str
    horas_apontadas: float
    data: date


class MetricByUserMonth(BaseModel):
    usuario: str
    mes: date
    horas_apontadas: float


class MetricByUserProjectMonth(BaseModel):
    usuario: str
    projeto: str
    mes: date
    horas_apontadas: float


class IssueAssignedByUser(BaseModel):
    usuario: str
    mes: date
    total_issues_assinadas: int
    projeto: str


class HelpHoursByUser(BaseModel):
    usuario: str
    mes: date
    horas_ajuda: float
    horas_totais_mes: float
    horas_liquidas: float


class HighPriorityIssue(BaseModel):
    issue_id: int
    titulo_issue: str
    projeto: str
    label: str
    created_at: datetime
    updated_at: datetime


class IssuesCreatedByProject(BaseModel):
    projeto: str
    issues_criadas: int


class IssuesCompletionByProject(BaseModel):
    projeto: str
    total_abertas: int
    total_finalizadas_no_prazo: int
    total_finalizadas_com_atraso: int
    total_abertas_atrasadas: int
