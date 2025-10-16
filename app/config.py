import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017/pegadazero")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "pegadazero_secret_key_2025")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    ENV: str = os.getenv("ENV", "development")
    JWT_ALGORITHM: str = "HS256"


settings = Settings()