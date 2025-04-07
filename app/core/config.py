import os
from typing import Optional, List
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl

class Settings(BaseSettings):
    PROJECT_NAME: str = "ADL Builder"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []
    ALGORITHM: str = "HS256"
    
    # Database
    SQLALCHEMY_DATABASE_URI: str = os.getenv(
        "DATABASE_URL", "sqlite:///./app.db"
    )
    
    # OpenAI config removed - API key no longer encrypted
    
    model_config = {
        "case_sensitive": True
    }


settings = Settings()
