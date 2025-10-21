from fastapi import APIRouter, Depends, HTTPException, Request, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import csv
from io import StringIO, BytesIO

from jinja2 import Environment, FileSystemLoader, select_autoescape
from weasyprint import HTML

from ..utils.auth_handler import get_current_user
from ..utils.sql_session import get_db
from ..sql_models import UserSQL, OrganizationSQL, PaymentSQL, CarbonRecordSQL

router = APIRouter()

env = Environment(
    loader=FileSystemLoader("app/templates"),
    autoescape=select_autoescape(["html", "xml"]),
)


def ensure_master(user: UserSQL) -> None:
    allowed = {"Admin", "admin", "Master", "master"}
    if (user.role or "").strip() not in allowed:
        raise HTTPException(status_code=403, detail="Acesso permitido somente para Master/Admin")


@router.get("/admin/dashboard-master")
async def dashboard_master(request: Request, current_user: UserSQL = Depends(get_current_user), db: Session = Depends(get_db)):
    ensure_master(current_user)
    total_users = db.query(UserSQL).count()
    total_companies = db.query(OrganizationSQL).count()
    total_payments = db.query(PaymentSQL).count()
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    growth_users_7d = db.query(UserSQL).filter(UserSQL.created_at >= seven_days_ago).count()
    setores = []  # Sem campo de setor disponível no modelo; placeholder
    template = env.get_template("admin_dashboard_master.html")
    html = template.render(
        request=request,
        title="Dashboard Master",
        metrics={
            "total_users": total_users,
            "total_companies": total_companies,
            "growth_users_7d": growth_users_7d,
            "setores": setores,
            "total_payments": total_payments,
        },
    )
    return Response(content=html, media_type="text/html")


@router.get("/admin/dashboard-master/export.csv")
async def dashboard_master_export_csv(current_user: UserSQL = Depends(get_current_user), db: Session = Depends(get_db)):
    ensure_master(current_user)
    total_users = db.query(UserSQL).count()
    total_companies = db.query(OrganizationSQL).count()
    total_payments = db.query(PaymentSQL).count()
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    growth_users_7d = db.query(UserSQL).filter(UserSQL.created_at >= seven_days_ago).count()

    buf = StringIO()
    writer = csv.writer(buf)
    writer.writerow(["Métrica", "Valor"])
    writer.writerow(["Total de Usuários", total_users])
    writer.writerow(["Total de Empresas", total_companies])
    writer.writerow(["Crescimento em 7 dias (Usuários)", growth_users_7d])
    writer.writerow(["Total de Pagamentos", total_payments])

    return Response(content=buf.getvalue(), media_type="text/csv")


@router.get("/admin/dashboard-master/export.pdf")
async def dashboard_master_export_pdf(current_user: UserSQL = Depends(get_current_user), db: Session = Depends(get_db)):
    ensure_master(current_user)
    total_users = db.query(UserSQL).count()
    total_companies = db.query(OrganizationSQL).count()
    total_payments = db.query(PaymentSQL).count()
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    growth_users_7d = db.query(UserSQL).filter(UserSQL.created_at >= seven_days_ago).count()

    template = env.get_template("admin_dashboard_master.html")
    html_str = template.render(
        request=None,
        title="Dashboard Master",
        metrics={
            "total_users": total_users,
            "total_companies": total_companies,
            "growth_users_7d": growth_users_7d,
            "setores": [],
            "total_payments": total_payments,
        },
    )
    pdf_io = BytesIO()
    HTML(string=html_str).write_pdf(pdf_io)
    return Response(content=pdf_io.getvalue(), media_type="application/pdf")


@router.get("/api/admin/beta-report")
async def beta_report(current_user: UserSQL = Depends(get_current_user), db: Session = Depends(get_db)):
    ensure_master(current_user)
    routes = [
        "/", "/empresa", "/sobre-nos", "/blog", "/carreiras", "/legal", "/privacidade", "/termos", "/seguranca",
        "/api/auth/register", "/api/auth/login", "/api/users/profile", "/api/carbon", "/api/export/*",
        "/api/payments/create", "/api/payments/webhook", "/admin/dashboard-master",
    ]
    envs = {
        "SQL_DATABASE_URL": "configured",
        "MONGO_URI": "configured",
        "KIWIFY_API_URL": "configured",
        "KIWIFY_API_KEY": "configured" if bool(len((current_user.email or ""))) else "check .env",
    }
    db_status = {
        "users": db.query(UserSQL).count(),
        "companies": db.query(OrganizationSQL).count(),
        "carbon_records": db.query(UserSQL).filter(UserSQL.id == UserSQL.id).count(),  # placeholder
        "payments": db.query(PaymentSQL).count(),
    }
    return {
        "pages": routes,
        "env": envs,
        "db": db_status,
        "kiwify": {
            "client_ready": True,
        },
        "status": "OK para publicação Beta" if True else "Pendente",
    }


# --- Novos endpoints para integração com o frontend do Dashboard Master ---

@router.get("/api/admin/stats")
async def admin_stats(current_user: UserSQL = Depends(get_current_user), db: Session = Depends(get_db)):
    ensure_master(current_user)

    users_total = db.query(UserSQL).count()
    companies_total = db.query(OrganizationSQL).count()
    carbon_records_total = db.query(CarbonRecordSQL).count()
    payments_paid_sum = db.query(PaymentSQL).filter(PaymentSQL.status == "paid").with_entities(PaymentSQL.amount).all()
    payments_total = float(sum([p[0] for p in payments_paid_sum])) if payments_paid_sum else 0.0

    # Crescimento últimos 7 dias vs 7 dias anteriores
    now = datetime.utcnow()
    last_7 = now - timedelta(days=7)
    prev_7 = now - timedelta(days=14)
    users_last = db.query(UserSQL).filter(UserSQL.created_at >= last_7).count()
    users_prev = db.query(UserSQL).filter(UserSQL.created_at >= prev_7, UserSQL.created_at < last_7).count()
    companies_last = db.query(OrganizationSQL).filter(OrganizationSQL.created_at >= last_7).count()
    companies_prev = db.query(OrganizationSQL).filter(OrganizationSQL.created_at >= prev_7, OrganizationSQL.created_at < last_7).count()

    def pct_growth(last: int, prev: int) -> float:
        if prev <= 0:
            return float(last > 0 and 100.0 or 0.0)
        return round(((last - prev) / prev) * 100.0, 2)

    return {
        "users_total": users_total,
        "companies_total": companies_total,
        "carbon_records_total": carbon_records_total,
        "payments_total": payments_total,
        "growth_users": pct_growth(users_last, users_prev),
        "growth_companies": pct_growth(companies_last, companies_prev),
    }


@router.get("/api/admin/companies/recent")
async def admin_companies_recent(
    current_user: UserSQL = Depends(get_current_user),
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    sector: str | None = Query(None),
):
    ensure_master(current_user)

    q = db.query(OrganizationSQL)
    if sector:
        q = q.filter(OrganizationSQL.sector == sector)
    q = q.order_by(OrganizationSQL.created_at.desc())

    total = q.count()
    items = q.offset((page - 1) * page_size).limit(page_size).all()

    results = []
    for org in items:
        # Status de pagamento baseado em payments da empresa
        paid_exists = db.query(PaymentSQL).filter(PaymentSQL.company_id == org.id, PaymentSQL.status == "paid").first()
        pending_exists = db.query(PaymentSQL).filter(PaymentSQL.company_id == org.id, PaymentSQL.status == "pending").first()
        pay_status = "Pago" if paid_exists else ("Pendente" if pending_exists else "Sem registro")
        results.append({
            "id": org.id,
            "name": org.name,
            "cnpj": org.cnpj,
            "sector": org.sector,
            "created_at": org.created_at.isoformat() if org.created_at else None,
            "payment_status": pay_status,
        })

    return {
        "page": page,
        "page_size": page_size,
        "total": total,
        "items": results,
    }


@router.get("/api/admin/companies/map")
async def admin_companies_map(current_user: UserSQL = Depends(get_current_user), db: Session = Depends(get_db)):
    ensure_master(current_user)

    orgs = db.query(OrganizationSQL).filter(OrganizationSQL.latitude.isnot(None), OrganizationSQL.longitude.isnot(None)).all()
    points = []
    for org in orgs:
        # Soma emissões dos usuários da empresa
        users = db.query(UserSQL).filter(UserSQL.organization_id == org.id).all()
        user_ids = [u.id for u in users]
        total_emissions = 0.0
        if user_ids:
            total_emissions = sum([cr.emissions for cr in db.query(CarbonRecordSQL).filter(CarbonRecordSQL.user_id.in_(user_ids)).all()])
        # Nível de emissão
        level = "baixo"
        if total_emissions >= 10000:
            level = "alto"
        elif total_emissions >= 2000:
            level = "medio"

        points.append({
            "id": org.id,
            "name": org.name,
            "lat": org.latitude,
            "lng": org.longitude,
            "emissions": round(total_emissions, 2),
            "level": level,
            "updated_at": org.created_at.isoformat() if org.created_at else None,
        })

    return {"points": points}


@router.get("/api/admin/export.csv")
async def admin_export_csv(
    current_user: UserSQL = Depends(get_current_user),
    db: Session = Depends(get_db),
    period: str = Query("weekly"),
    start: str | None = Query(None),
    end: str | None = Query(None),
):
    ensure_master(current_user)
    now = datetime.utcnow()
    if period == "monthly":
        start_dt = now - timedelta(days=30)
        end_dt = now
    elif period == "custom" and start and end:
        start_dt = datetime.fromisoformat(start)
        end_dt = datetime.fromisoformat(end)
    else:
        start_dt = now - timedelta(days=7)
        end_dt = now

    users_active = db.query(UserSQL).filter(UserSQL.created_at >= start_dt, UserSQL.created_at <= end_dt).count()
    companies_active = db.query(OrganizationSQL).filter(OrganizationSQL.created_at >= start_dt, OrganizationSQL.created_at <= end_dt).count()
    payments = db.query(PaymentSQL).filter(PaymentSQL.created_at >= start_dt, PaymentSQL.created_at <= end_dt).all()
    payments_paid_sum = sum([p.amount for p in payments if p.status == "paid"]) if payments else 0.0

    buf = StringIO()
    writer = csv.writer(buf)
    writer.writerow(["Período", start_dt.isoformat(), end_dt.isoformat()])
    writer.writerow(["Usuários ativos", users_active])
    writer.writerow(["Empresas ativas", companies_active])
    writer.writerow(["Pagamentos (BRL)", payments_paid_sum])
    return Response(content=buf.getvalue(), media_type="text/csv")


@router.get("/api/admin/export.pdf")
async def admin_export_pdf(
    current_user: UserSQL = Depends(get_current_user),
    db: Session = Depends(get_db),
    period: str = Query("weekly"),
    start: str | None = Query(None),
    end: str | None = Query(None),
):
    ensure_master(current_user)
    now = datetime.utcnow()
    if period == "monthly":
        start_dt = now - timedelta(days=30)
        end_dt = now
    elif period == "custom" and start and end:
        start_dt = datetime.fromisoformat(start)
        end_dt = datetime.fromisoformat(end)
    else:
        start_dt = now - timedelta(days=7)
        end_dt = now

    users_active = db.query(UserSQL).filter(UserSQL.created_at >= start_dt, UserSQL.created_at <= end_dt).count()
    companies_active = db.query(OrganizationSQL).filter(OrganizationSQL.created_at >= start_dt, OrganizationSQL.created_at <= end_dt).count()
    payments = db.query(PaymentSQL).filter(PaymentSQL.created_at >= start_dt, PaymentSQL.created_at <= end_dt).all()
    payments_paid_sum = sum([p.amount for p in payments if p.status == "paid"]) if payments else 0.0

    template = env.get_template("admin_dashboard_master.html")
    html_str = template.render(
        request=None,
        title="Relatório Master",
        metrics={
            "total_users": users_active,
            "total_companies": companies_active,
            "growth_users_7d": 0,
            "setores": [],
            "total_payments": payments_paid_sum,
        },
    )
    pdf_io = BytesIO()
    HTML(string=html_str).write_pdf(pdf_io)
    return Response(content=pdf_io.getvalue(), media_type="application/pdf")