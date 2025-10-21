from pydantic import BaseModel


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
    id: int
    title: str
    projeto: str
    usuario: str
    horas_apontadas: float
