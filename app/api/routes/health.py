
from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from app.db.session import init_engine

router = APIRouter()

@router.get("/healthz")
async def healthz():
    try:
        engine, _ = init_engine()
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
