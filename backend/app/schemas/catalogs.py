from datetime import datetime, timedelta
from typing import Optional

from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional

class ProjectItem(BaseModel):
    id: int
    name: str


class UserItem(BaseModel):
    id: int
    username: str


class TaskItem(BaseModel):
    id: int
    title: str
    projeto: str


class TaskWithHoursItem(BaseModel):
<<<<<<< HEAD
<<<<<<< HEAD
    projeto: str
    issue_id: int
    titulo_da_issue: str
    usuario_responsavel: Optional[str]
    horas_apontadas: float
    status: str
    tempo_de_ciclo: Optional[timedelta]
    inicio_todo: Optional[datetime]
=======
=======
>>>>>>> origin/fronted_backend
    project: str
    issue_id: int
    title: str
    user: Optional[str]
    hours: float
    status: str
    blocked_time: Optional[timedelta]
    init_todo: Optional[datetime]
<<<<<<< HEAD
>>>>>>> origin/fronted_backend
=======
=======
    projeto: str
    issue_id: int
    titulo_da_issue: str
    usuario_responsavel: Optional[str]
    horas_apontadas: float
    status: str
    tempo_de_ciclo: Optional[timedelta]
    inicio_todo: Optional[datetime]
>>>>>>> origin/frontend_test
>>>>>>> origin/fronted_backend
    due_date: Optional[datetime]
    closed_at: Optional[datetime]
