#!/usr/bin/env python3
"""
Backend simples para testar login do usuário master
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import bcrypt
import jwt
from datetime import datetime, timedelta

app = FastAPI(title="PegadaZero Simple Backend")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configurações
SECRET_KEY = "pegadazero_secret_key_2025"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha está correta"""
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except:
        return False

def create_access_token(user_id: str) -> str:
    """Cria token JWT"""
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": user_id, "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_user_by_email(email: str):
    """Busca usuário por email no SQLite"""
    conn = sqlite3.connect('pegadazero.db')
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, name, email, password, role FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        if user:
            return {
                "id": user[0],
                "name": user[1], 
                "email": user[2],
                "password": user[3],
                "role": user[4]
            }
        return None
    finally:
        conn.close()

@app.post("/api/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Endpoint de login"""
    print(f"🔐 Tentativa de login: {request.email}")
    
    # Buscar usuário
    user = get_user_by_email(request.email)
    if not user:
        print(f"❌ Usuário não encontrado: {request.email}")
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    
    print(f"✅ Usuário encontrado: {user['name']} ({user['role']})")
    
    # Verificar senha
    if not verify_password(request.password, user['password']):
        print(f"❌ Senha incorreta para: {request.email}")
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    
    print(f"✅ Login bem-sucedido: {user['name']}")
    
    # Criar token
    token = create_access_token(str(user['id']))
    
    return LoginResponse(
        access_token=token,
        token_type="bearer"
    )

@app.get("/api/auth/profile")
async def get_profile():
    """Endpoint de perfil (simplificado)"""
    return {
        "id": 1,
        "name": "Master Admin",
        "email": "master@pegadazero.local",
        "role": "Master"
    }

@app.get("/")
async def root():
    """Endpoint raiz"""
    return {"message": "PegadaZero Backend - Login Test"}

@app.get("/health")
async def health():
    """Health check"""
    return {"status": "ok", "timestamp": datetime.utcnow()}

if __name__ == "__main__":
    import uvicorn
    print("🚀 Iniciando servidor backend simples...")
    print("📍 URL: http://localhost:5000")
    print("🔑 Teste com: master@pegadazero.local / Master123!")
    uvicorn.run(app, host="0.0.0.0", port=5000)