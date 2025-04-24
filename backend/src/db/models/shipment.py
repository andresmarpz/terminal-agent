from __future__ import annotations

from datetime import datetime
from enum import Enum

from sqlalchemy import Enum as SAEnum
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..base import Base


class ShipmentStatus(str, Enum):
    PENDING = "pending"
    SHIPPING = "shipping"
    DONE = "done"


class Shipment(Base):
    __tablename__ = "shipments"

    id: Mapped[int] = mapped_column(primary_key=True)
    invoice_id: Mapped[int] = mapped_column(
        ForeignKey("invoices.id", ondelete="RESTRICT"),
        unique=True,
        index=True,
        nullable=False,
    )
    client_id: Mapped[int] = mapped_column(
        ForeignKey("clients.id", ondelete="RESTRICT"), index=True, nullable=False
    )
    status: Mapped[ShipmentStatus] = mapped_column(
        SAEnum(ShipmentStatus, name="shipment_status"),
        default=ShipmentStatus.PENDING,
        nullable=False,
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relations
    invoice = relationship("Invoice", back_populates="shipment")
    client = relationship("Client", back_populates="shipments")

    def __repr__(self) -> str:
        return f"<Shipment(id={self.id}, status={self.status})>"
