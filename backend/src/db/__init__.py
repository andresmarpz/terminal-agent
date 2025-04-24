"""Database module."""

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.core.config import get_settings

from .base import Base  # noqa: E402  (circular import safe at runtime)

# ---------------------------------------------------------------------------
# Environment configuration
# ---------------------------------------------------------------------------
# Prefer a .env file at the project root to keep credentials out of source
# control. Falls back to the default Docker-Compose settings if not found.
# ---------------------------------------------------------------------------

load_dotenv()

DATABASE_URL = get_settings().DATABASE_URL

# ---------------------------------------------------------------------------
# SQLAlchemy engine & session factory
# ---------------------------------------------------------------------------

engine = create_engine(DATABASE_URL, echo=False, future=True)

#: Factory that produces SQLAlchemy `Session` objects with sensible defaults
SessionLocal = sessionmaker(
    bind=engine, autoflush=False, autocommit=False, expire_on_commit=False
)

__all__ = [
    "Base",
    "engine",
    "SessionLocal",
]
