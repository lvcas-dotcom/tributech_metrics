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
