from ..models.user import User, Role
from ..models.organization import Organization
from ..utils.auth_handler import hash_password
from sqlalchemy.orm import Session
from ..db.sql import SessionLocal
from ..sql_models import UserSQL, OrganizationSQL


def ensure_sql_seed() -> None:
    """Seed independente para SQL (roda mesmo sem Mongo/Beanie)."""
    db: Session = SessionLocal()
    try:
        # Admin padrão em SQL
        existing_admin_sql = db.query(UserSQL).filter(UserSQL.email == "admin@pegadazero.local").first()
        if not existing_admin_sql:
            admin_sql = UserSQL(
                name="Admin Master",
                email="admin@pegadazero.local",
                password=hash_password("Admin123!"),
                role=Role.admin.value,
            )
            db.add(admin_sql)
            db.commit()
            db.refresh(admin_sql)

        # Master em SQL
        master_sql = db.query(UserSQL).filter(UserSQL.email == "master@pegadazero.local").first()
        if not master_sql:
            master_sql = UserSQL(
                name="Master",
                email="master@pegadazero.local",
                password=hash_password("Master123!"),
                role="Master",
            )
            db.add(master_sql)
            db.commit()
            db.refresh(master_sql)
        else:
            # Garante papel Master caso exista com outro papel
            if (master_sql.role or "").strip() != "Master":
                master_sql.role = "Master"
                db.add(master_sql)
                db.commit()

        # Organização master
        org_sql = db.query(OrganizationSQL).filter(OrganizationSQL.name == "master").first()
        if not org_sql and master_sql:
            org_sql = OrganizationSQL(name="master", admin_id=master_sql.id)
            db.add(org_sql)
            db.commit()
    finally:
        db.close()


async def ensure_admin_user() -> None:
    """
    Garante a existência de um usuário Admin Master com credenciais padrão.
    - Email: admin@pegadazero.local
    - Senha: Admin123!
    """
    # Operações Beanie/Mongo opcionais — se falhar, seguimos com SQL
    try:
        existing_admin = await User.find_one(User.email == "admin@pegadazero.local")
        if not existing_admin:
            admin = User(
                name="Admin Master",
                email="admin@pegadazero.local",
                password=hash_password("Admin123!"),
                role=Role.admin,
            )
            await admin.insert()

        master_user = await User.find_one(User.email == "master@pegadazero.com.br")
        if not master_user:
            master_user = User(
                name="master",
                email="master@pegadazero.com.br",
                password=hash_password("123adm"),
                role=Role.admin,
            )
            await master_user.insert()

        if master_user:
            existing_org = await Organization.find_one(Organization.name == "master")
            if not existing_org:
                org = Organization(name="master", admin_id=master_user.id)
                await org.insert()
    except Exception:
        # Ignora erros de Mongo/Beanie em ambientes sem essa dependência
        pass

    # Sempre garantir seed em SQL
    ensure_sql_seed()


# Bloco CLI para executar o seed diretamente
if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Seed de usuários padrão (Admin e Master) em SQL")
    parser.add_argument("--create-master", action="store_true", help="Garante a criação/atualização do usuário Master")
    args = parser.parse_args()

    ensure_sql_seed()
    if args.create_master:
        # A função ensure_sql_seed já cobre criação/atualização do Master
        pass