
from typing import Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession, AsyncEngine, async_sessionmaker, create_async_engine

from app.core.config import settings

_engine: Optional[AsyncEngine] = None
_Session: Optional[async_sessionmaker[AsyncSession]] = None

def init_engine() -> Tuple[AsyncEngine, async_sessionmaker[AsyncSession]]:
    global _engine, _Session
    if _engine is None:
        _engine = create_async_engine(settings.DATABASE_URL, future=True, echo=False, pool_pre_ping=True)
        _Session = async_sessionmaker(_engine, expire_on_commit=False)
    return _engine, _Session  # type: ignore[return-value]
