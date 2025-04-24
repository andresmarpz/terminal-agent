import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .base import Base  # noqa: E402  (circular import safe at runtime)

# ---------------------------------------------------------------------------
# Environment configuration
# ---------------------------------------------------------------------------
# Prefer a .env file at the project root to keep credentials out of source
# control. Falls back to the default Docker-Compose settings if not found.
# ---------------------------------------------------------------------------

load_dotenv()

DEFAULT_DB_URL = "postgresql+psycopg2://postgres:postgres@localhost:5432/terminal_db"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DB_URL)

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
