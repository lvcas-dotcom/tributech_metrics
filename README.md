
# Tributech • Metrics API

Backend para relatórios de apontamento de horas (GitLab-like) com PostgreSQL.
Arquitetura: API → Services → Repositories → DB/Core.

## Endpoints principais
- `GET /metrics/by-task`
- `GET /metrics/by-user-month`
- `GET /metrics/by-user-project-month`
- `GET /healthz`

### Filtros
- `start_date` (YYYY-MM-DD), `end_date` (YYYY-MM-DD)
- `projects` (multi: `?projects=a&projects=b`)
- `users` (multi: `?users=u1&users=u2`)

### Como rodar (dev)
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # edite as variáveis
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
# abra http://localhost:8000/docs
```

### Variáveis de ambiente
Veja `.env.example`.
