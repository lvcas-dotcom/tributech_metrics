
from datetime import date
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
