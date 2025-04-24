"""Application configuration and settings."""

from enum import Enum
from functools import lru_cache
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Environment(str, Enum):
    """Environment enumeration."""

    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"


class Settings(BaseSettings):
    """Application settings."""

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=True
    )

    # Environment
    ENVIRONMENT: Environment = Field(
        default=Environment.DEVELOPMENT, description="Current environment"
    )

    # API Settings
    API_V1_STR: str = Field(default="/api/v1", description="API v1 string")
    API_NAME: str = Field(default="Coffee Delivery Service", description="API name")
    API_VERSION: str = Field(default="0.0.1", description="API version")
    API_DESCRIPTION: str = Field(
        default="REST API for interacting with the Coffee Delivery Service",
        description="API description",
    )
    API_HOST: str = Field(default="0.0.0.0", description="API host")
    API_PORT: int = Field(default=8000, description="API port")

    # PostgreSQL Database Settings
    DATABASE_URL: str = Field(..., description="PostgreSQL database URL")

    @field_validator("DATABASE_URL")
    def validate_database_url(cls, v: str) -> str:
        """Validate database URL."""
        if not v or "postgres" not in v:
            raise ValueError("DATABASE_URL must contain 'postgres'")
        return v

    # CORS Settings
    API_CORS_ORIGINS: List[str] = Field(default=["*"], description="CORS origins")

    # Logging Settings
    LOG_LEVEL: str = Field(default="INFO", description="Logging level")

    @property
    def is_development(self) -> bool:
        """Check if environment is development."""
        return self.ENVIRONMENT == Environment.DEVELOPMENT

    @property
    def is_production(self) -> bool:
        """Check if environment is production."""
        return self.ENVIRONMENT == Environment.PRODUCTION

    @field_validator("API_CORS_ORIGINS")
    @classmethod
    def validate_cors_origins(cls, v: List[str], info) -> List[str]:
        """Validate CORS origins."""
        env = info.data.get("ENVIRONMENT")
        if env == Environment.PRODUCTION and "*" in v:
            raise ValueError("Wildcard CORS origin not allowed in production")
        return v

    @field_validator("LOG_LEVEL")
    @classmethod
    def validate_log_level(cls, v: str) -> str:
        """Validate log level."""
        valid_levels = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
        if v.upper() not in valid_levels:
            raise ValueError(f"Log level must be one of {valid_levels}")
        return v.upper()


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    settings = Settings()
    return settings
