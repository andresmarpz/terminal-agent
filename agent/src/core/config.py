"""Application configuration and settings."""

from enum import Enum
from functools import lru_cache

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
    BACKEND_API_URL: str = Field(..., description="URL for the backend API")
    BACKEND_API_KEY: str = Field(
        ..., description="API key for authenticating requests against the backend"
    )

    # OpenAI Settings
    OPENAI_API_KEY: str = Field(
        ..., description="API key for authenticating requests against OpenAI"
    )

    # LangSmith Settings
    LANGSMITH_API_KEY: str = Field(
        ..., description="API key for authenticating requests against LangSmith"
    )

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
