
from typing import AsyncGenerator
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import init_engine
from app.core.config import settings

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    _, SessionLocal = init_engine()
    async with SessionLocal() as session:
        yield session
