import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017/pegadazero")
    SQL_DATABASE_URL: str = os.getenv("SQL_DATABASE_URL", "sqlite:///./pegadazero.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "pegadazero_secret_key_2025")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    ENV: str = os.getenv("ENV", "development")
    JWT_ALGORITHM: str = "HS256"
    # Kiwify
    KIWIFY_API_KEY: str = os.getenv("KIWIFY_API_KEY", "")
    KIWIFY_API_URL: str = os.getenv("KIWIFY_API_URL", "https://api.kiwify.com.br")


settings = Settings()