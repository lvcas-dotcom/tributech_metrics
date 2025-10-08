
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
