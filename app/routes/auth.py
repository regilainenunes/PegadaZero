from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from ..sql_models import UserSQL
from ..models.user import Role
from ..utils.auth_handler import hash_password, verify_password, create_access_token, get_current_user
from ..utils.sql_session import get_db


router = APIRouter()
users_router = APIRouter()


class RegisterPayload(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Role = Role.usuario
    company: str | None = None


class LoginPayload(BaseModel):
    email: EmailStr
    password: str


class UpdateProfilePayload(BaseModel):
    name: str | None = None
    email: EmailStr | None = None


class ChangePasswordPayload(BaseModel):
    current_password: str
    new_password: str


@router.post("/register")
async def register(payload: RegisterPayload, db: Session = Depends(get_db)):
    existing = db.query(UserSQL).filter(UserSQL.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="E-mail já registrado")
    user = UserSQL(name=payload.name, email=payload.email, password=hash_password(payload.password), role=payload.role.value)
    db.add(user)
    db.commit()
    db.refresh(user)
    # Se empresa foi informada, cria/associa organização
    if payload.company:
        from ..sql_models import OrganizationSQL
        org = db.query(OrganizationSQL).filter(OrganizationSQL.name == payload.company).first()
        if not org:
            org = OrganizationSQL(name=payload.company, admin_id=user.id)
            db.add(org)
            db.commit()
            db.refresh(org)
        user.organization_id = org.id
        db.add(user)
        db.commit()
    token = create_access_token(str(user.id))
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login")
async def login(payload: LoginPayload, db: Session = Depends(get_db)):
    user = db.query(UserSQL).filter(UserSQL.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    token = create_access_token(str(user.id))
    return {"access_token": token, "token_type": "bearer"}


@router.get("/profile")
async def profile(current_user: UserSQL = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "points": current_user.points,
    }


@users_router.put("/profile")
async def update_profile(payload: UpdateProfilePayload, current_user: UserSQL = Depends(get_current_user), db: Session = Depends(get_db)):
    if payload.email and payload.email != current_user.email:
        existing = db.query(UserSQL).filter(UserSQL.email == payload.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="E-mail já está em uso")
        current_user.email = payload.email
    if payload.name:
        current_user.name = payload.name
    db.add(current_user)
    db.commit()
    return {"message": "Perfil atualizado"}


@users_router.put("/change-password")
async def change_password(payload: ChangePasswordPayload, current_user: UserSQL = Depends(get_current_user), db: Session = Depends(get_db)):
    if not verify_password(payload.current_password, current_user.password):
        raise HTTPException(status_code=400, detail="Senha atual incorreta")
    current_user.password = hash_password(payload.new_password)
    db.add(current_user)
    db.commit()
    return {"message": "Senha alterada"}


@users_router.delete("")
async def delete_account(current_user: UserSQL = Depends(get_current_user), db: Session = Depends(get_db)):
    # Remove registros de carbono do usuário e depois o usuário
    from ..sql_models import CarbonRecordSQL
    db.query(CarbonRecordSQL).filter(CarbonRecordSQL.user_id == current_user.id).delete()
    db.delete(current_user)
    db.commit()
    return {"message": "Conta excluída"}