from beanie import Document
from pydantic import EmailStr, Field
from enum import Enum
from datetime import datetime


class Role(str, Enum):
    admin = "Admin"
    empresa = "Empresa"
    ong = "ONG"
    usuario = "Usuario"


class User(Document):
    name: str
    email: EmailStr
    password: str
    role: Role = Role.usuario
    points: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"