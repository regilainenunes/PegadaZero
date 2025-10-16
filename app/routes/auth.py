from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from beanie import PydanticObjectId

from ..models.user import User, Role
from ..utils.auth_handler import hash_password, verify_password, create_access_token, get_current_user


router = APIRouter()
users_router = APIRouter()


class RegisterPayload(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Role = Role.usuario


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
async def register(payload: RegisterPayload):
    existing = await User.find_one(User.email == payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="E-mail já registrado")
    user = User(name=payload.name, email=payload.email, password=hash_password(payload.password), role=payload.role)
    await user.insert()
    token = create_access_token(str(user.id))
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login")
async def login(payload: LoginPayload):
    user = await User.find_one(User.email == payload.email)
    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    token = create_access_token(str(user.id))
    return {"access_token": token, "token_type": "bearer"}


@router.get("/profile")
async def profile(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "points": current_user.points,
    }


@users_router.put("/profile")
async def update_profile(payload: UpdateProfilePayload, current_user: User = Depends(get_current_user)):
    if payload.email and payload.email != current_user.email:
        existing = await User.find_one(User.email == payload.email)
        if existing:
            raise HTTPException(status_code=400, detail="E-mail já está em uso")
        current_user.email = payload.email
    if payload.name:
        current_user.name = payload.name
    await current_user.save()
    return {"message": "Perfil atualizado"}


@users_router.put("/change-password")
async def change_password(payload: ChangePasswordPayload, current_user: User = Depends(get_current_user)):
    if not verify_password(payload.current_password, current_user.password):
        raise HTTPException(status_code=400, detail="Senha atual incorreta")
    current_user.password = hash_password(payload.new_password)
    await current_user.save()
    return {"message": "Senha alterada"}


@users_router.delete("")
async def delete_account(current_user: User = Depends(get_current_user)):
    await current_user.delete()
    return {"message": "Conta excluída"}