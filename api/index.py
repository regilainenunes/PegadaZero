"""
PegadaZero API - Backend Python para Vercel
Sistema de cálculo de pegada de carbono com Supabase
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import os
import jwt
from datetime import datetime, timedelta
import bcrypt
from supabase import create_client, Client
import uvicorn

# Configuração do Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")
JWT_SECRET = os.getenv("JWT_SECRET", "pegada-zero-secret-key")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL e SUPABASE_ANON_KEY devem estar configurados")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Configuração do FastAPI
app = FastAPI(
    title="PegadaZero API",
    description="API para cálculo de pegada de carbono",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    organization: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class CarbonCalculation(BaseModel):
    energy_consumption: float
    transport_km: float
    waste_kg: float
    water_usage: float
    organization_id: Optional[str] = None

class CarbonResult(BaseModel):
    total_co2: float
    energy_co2: float
    transport_co2: float
    waste_co2: float
    water_co2: float
    calculation_date: datetime

# Utility functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_jwt_token(user_id: str, email: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def verify_jwt_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_jwt_token(token)
    return payload

# Carbon calculation functions
def calculate_energy_co2(kwh: float) -> float:
    """Calcula CO2 do consumo de energia (kg CO2 por kWh)"""
    return kwh * 0.233  # Fator de emissão médio Brasil

def calculate_transport_co2(km: float) -> float:
    """Calcula CO2 do transporte (kg CO2 por km)"""
    return km * 0.12  # Fator médio carro popular

def calculate_waste_co2(kg: float) -> float:
    """Calcula CO2 dos resíduos (kg CO2 por kg resíduo)"""
    return kg * 0.5  # Fator médio tratamento resíduos

def calculate_water_co2(liters: float) -> float:
    """Calcula CO2 do consumo de água (kg CO2 por litro)"""
    return liters * 0.0003  # Fator tratamento água

# Routes
@app.get("/")
async def root():
    return {
        "message": "PegadaZero API v2.0",
        "status": "online",
        "timestamp": datetime.utcnow()
    }

@app.post("/auth/register")
async def register(user: UserCreate):
    try:
        # Verificar se usuário já existe
        existing = supabase.table("users").select("*").eq("email", user.email).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Email já cadastrado")
        
        # Criar usuário
        hashed_password = hash_password(user.password)
        new_user = {
            "email": user.email,
            "password": hashed_password,
            "name": user.name,
            "organization": user.organization,
            "created_at": datetime.utcnow().isoformat()
        }
        
        result = supabase.table("users").insert(new_user).execute()
        user_data = result.data[0]
        
        # Gerar token
        token = create_jwt_token(user_data["id"], user_data["email"])
        
        return {
            "message": "Usuário criado com sucesso",
            "token": token,
            "user": {
                "id": user_data["id"],
                "email": user_data["email"],
                "name": user_data["name"]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/auth/login")
async def login(credentials: UserLogin):
    try:
        # Buscar usuário
        result = supabase.table("users").select("*").eq("email", credentials.email).execute()
        if not result.data:
            raise HTTPException(status_code=401, detail="Credenciais inválidas")
        
        user = result.data[0]
        
        # Verificar senha
        if not verify_password(credentials.password, user["password"]):
            raise HTTPException(status_code=401, detail="Credenciais inválidas")
        
        # Gerar token
        token = create_jwt_token(user["id"], user["email"])
        
        return {
            "message": "Login realizado com sucesso",
            "token": token,
            "user": {
                "id": user["id"],
                "email": user["email"],
                "name": user["name"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/carbon/calculate")
async def calculate_carbon(
    calculation: CarbonCalculation,
    current_user: dict = Depends(get_current_user)
):
    try:
        # Calcular emissões por categoria
        energy_co2 = calculate_energy_co2(calculation.energy_consumption)
        transport_co2 = calculate_transport_co2(calculation.transport_km)
        waste_co2 = calculate_waste_co2(calculation.waste_kg)
        water_co2 = calculate_water_co2(calculation.water_usage)
        
        total_co2 = energy_co2 + transport_co2 + waste_co2 + water_co2
        
        # Salvar cálculo no banco
        calculation_data = {
            "user_id": current_user["user_id"],
            "energy_consumption": calculation.energy_consumption,
            "transport_km": calculation.transport_km,
            "waste_kg": calculation.waste_kg,
            "water_usage": calculation.water_usage,
            "energy_co2": energy_co2,
            "transport_co2": transport_co2,
            "waste_co2": waste_co2,
            "water_co2": water_co2,
            "total_co2": total_co2,
            "calculation_date": datetime.utcnow().isoformat(),
            "organization_id": calculation.organization_id
        }
        
        result = supabase.table("carbon_calculations").insert(calculation_data).execute()
        
        return CarbonResult(
            total_co2=total_co2,
            energy_co2=energy_co2,
            transport_co2=transport_co2,
            waste_co2=waste_co2,
            water_co2=water_co2,
            calculation_date=datetime.utcnow()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/carbon/history")
async def get_carbon_history(current_user: dict = Depends(get_current_user)):
    try:
        result = supabase.table("carbon_calculations")\
            .select("*")\
            .eq("user_id", current_user["user_id"])\
            .order("calculation_date", desc=True)\
            .execute()
        
        return {"calculations": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/dashboard/stats")
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    try:
        # Buscar estatísticas do usuário
        calculations = supabase.table("carbon_calculations")\
            .select("*")\
            .eq("user_id", current_user["user_id"])\
            .execute()
        
        if not calculations.data:
            return {
                "total_calculations": 0,
                "total_co2": 0,
                "average_co2": 0,
                "last_calculation": None
            }
        
        data = calculations.data
        total_co2 = sum(calc["total_co2"] for calc in data)
        
        return {
            "total_calculations": len(data),
            "total_co2": total_co2,
            "average_co2": total_co2 / len(data),
            "last_calculation": data[0] if data else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Para desenvolvimento local
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)