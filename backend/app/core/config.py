from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "NeuroDC"
    database_url: str = "sqlite:///./neurodc.db"
    jwt_secret: str = "local-development-secret"
    jwt_algorithm: str = "HS256"
    access_token_minutes: int = 60 * 12
    demo_data_records: int = 100000

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()
