
from functools import lru_cache
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    ALLOWED_ORIGINS: str = "http://localhost:4200"
    DEFAULT_PROJECTS: str = "suporte-geo,suporte-saovicente,suporte-reurb,geo"
    ENABLE_CACHE: bool = True
    CACHE_TTL_SECONDS: int = 60

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

@lru_cache
def get_settings() -> "Settings":
    return Settings()

settings = get_settings()
