import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from ..config import settings


# Configuração do engine baseada na URL
url = settings.SQL_DATABASE_URL
connect_args = {}
if url.startswith("sqlite"):
    # Necessário para SQLite em aplicações async/sync mistas
    connect_args = {"check_same_thread": False}

engine = create_engine(url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()