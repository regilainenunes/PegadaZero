#!/usr/bin/env python3
"""
Script para verificar se o usuário master foi criado corretamente
"""
import sqlite3

def check_master_user():
    """Verifica o usuário master no banco SQLite"""
    
    # Conectar ao banco SQLite
    conn = sqlite3.connect('pegadazero.db')
    cursor = conn.cursor()
    
    try:
        # Verificar usuário master
        cursor.execute("SELECT id, name, email, role FROM users WHERE email = ?", ("master@pegadazero.local",))
        user = cursor.fetchone()
        
        if user:
            print(f"✅ Usuário master encontrado:")
            print(f"   ID: {user[0]}")
            print(f"   Nome: {user[1]}")
            print(f"   Email: {user[2]}")
            print(f"   Role: {user[3]}")
        else:
            print("❌ Usuário master não encontrado!")
        
        # Verificar organização master
        cursor.execute("SELECT id, name, admin_id FROM organizations WHERE name = ?", ("master",))
        org = cursor.fetchone()
        
        if org:
            print(f"\n✅ Organização master encontrada:")
            print(f"   ID: {org[0]}")
            print(f"   Nome: {org[1]}")
            print(f"   Admin ID: {org[2]}")
        else:
            print("\n❌ Organização master não encontrada!")
        
        # Listar todos os usuários
        cursor.execute("SELECT id, name, email, role FROM users")
        all_users = cursor.fetchall()
        
        print(f"\n📋 Todos os usuários no banco ({len(all_users)}):")
        for user in all_users:
            print(f"   {user[0]} - {user[1]} ({user[2]}) - Role: {user[3]}")
        
    except Exception as e:
        print(f"❌ Erro ao verificar usuário master: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    print("🔍 Verificando usuário master...")
    check_master_user()
    print("✨ Verificação concluída!")