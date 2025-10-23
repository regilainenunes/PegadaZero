#!/usr/bin/env python3
"""
Script simples para criar o usuário master no banco de dados SQLite
Usa hash simples para compatibilidade
"""
import sqlite3
import hashlib
from datetime import datetime

def simple_hash(password: str) -> str:
    """Hash simples da senha"""
    return hashlib.sha256(password.encode()).hexdigest()

def create_master_user():
    """Cria o usuário master no banco SQLite"""
    
    # Conectar ao banco SQLite
    conn = sqlite3.connect('pegadazero.db')
    cursor = conn.cursor()
    
    try:
        # Criar tabelas se não existirem
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'Usuario' NOT NULL,
                points INTEGER DEFAULT 0 NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
                organization_id INTEGER
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS organizations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(200) UNIQUE NOT NULL,
                admin_id INTEGER,
                cnpj VARCHAR(20),
                sector VARCHAR(100),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
                latitude REAL,
                longitude REAL
            )
        ''')
        
        # Verificar se o usuário master já existe
        cursor.execute("SELECT id FROM users WHERE email = ?", ("master@pegadazero.local",))
        existing_user = cursor.fetchone()
        
        if existing_user:
            # Atualizar usuário existente - usar hash temporário
            temp_password = simple_hash("Master123!")
            cursor.execute("""
                UPDATE users 
                SET name = ?, password = ?, role = ?
                WHERE email = ?
            """, ("Master Admin", temp_password, "Master", "master@pegadazero.local"))
            print("✅ Usuário master atualizado com sucesso!")
            user_id = existing_user[0]
        else:
            # Criar novo usuário master - usar hash temporário
            temp_password = simple_hash("Master123!")
            cursor.execute("""
                INSERT INTO users (name, email, password, role, points, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            """, ("Master Admin", "master@pegadazero.local", temp_password, "Master", 0, datetime.utcnow()))
            user_id = cursor.lastrowid
            print("✅ Usuário master criado com sucesso!")
        
        # Verificar se a organização master existe
        cursor.execute("SELECT id FROM organizations WHERE name = ?", ("master",))
        existing_org = cursor.fetchone()
        
        if not existing_org:
            # Criar organização master
            cursor.execute("""
                INSERT INTO organizations (name, admin_id, created_at)
                VALUES (?, ?, ?)
            """, ("master", user_id, datetime.utcnow()))
            print("✅ Organização master criada com sucesso!")
        else:
            print("✅ Organização master já existe!")
        
        # Commit das mudanças
        conn.commit()
        
        # Verificar se foi criado corretamente
        cursor.execute("SELECT id, name, email, role FROM users WHERE email = ?", ("master@pegadazero.local",))
        user = cursor.fetchone()
        
        if user:
            print(f"\n📋 Detalhes do usuário master:")
            print(f"   ID: {user[0]}")
            print(f"   Nome: {user[1]}")
            print(f"   Email: {user[2]}")
            print(f"   Role: {user[3]}")
            print(f"\n🔑 Credenciais de acesso:")
            print(f"   Email: master@pegadazero.local")
            print(f"   Senha: Master123!")
            print(f"\n⚠️  IMPORTANTE: O hash da senha é temporário.")
            print(f"   Você precisará fazer login pelo sistema para gerar o hash correto.")
        
    except Exception as e:
        print(f"❌ Erro ao criar usuário master: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    print("🚀 Criando usuário master...")
    create_master_user()
    print("✨ Processo concluído!")