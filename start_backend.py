#!/usr/bin/env python3
"""
Script para iniciar o servidor FastAPI na porta 5000
"""
import uvicorn
import sys
import os

# Adicionar o diretório raiz ao path para resolver imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=5000,
        reload=True,
        log_level="info"
    )