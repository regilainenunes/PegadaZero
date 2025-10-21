from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates

from .utils.database import init_db
from .db.sql import Base, engine
from .utils.seed import ensure_admin_user, ensure_sql_seed
from .routes.public_pages import router as public_router
from .routes.auth import router as auth_router, users_router
from .routes.carbon import router as carbon_router
from .routes.dashboard import router as dashboard_router
from .routes.export import router as export_router


app = FastAPI(title="PegadaZero", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")


@app.on_event("startup")
async def on_startup():
    await init_db()
    # Cria tabelas SQL (SQLite/Postgres/MySQL) caso não existam
    Base.metadata.create_all(bind=engine)
    # Seed Mongo (opcional) e SEMPRE seed SQL
    try:
        await ensure_admin_user()
    except Exception:
        pass
    ensure_sql_seed()


app.include_router(public_router, tags=["public"])  # rotas públicas sem prefixo
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])  # autenticação
app.include_router(users_router, prefix="/api/users", tags=["users"])  # usuários
app.include_router(carbon_router, prefix="/api/carbon", tags=["carbon"])  # pegada de carbono
app.include_router(dashboard_router, prefix="/api", tags=["dashboard"])  # dashboard
app.include_router(export_router, prefix="/api/export", tags=["export"])  # exportações PDF/Excel


@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request, "title": "PegadaZero"})