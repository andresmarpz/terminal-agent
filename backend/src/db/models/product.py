from __future__ import annotations

from sqlalchemy import Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from ..base import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    image: Mapped[str | None] = mapped_column(String(255), nullable=True)

    def __repr__(self) -> str:  # pragma: no cover - debugging convenience
        return f"<Product(id={self.id}, name={self.name!r})>"
