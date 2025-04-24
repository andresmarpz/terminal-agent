from __future__ import annotations

from datetime import datetime
from enum import Enum

from sqlalchemy import CheckConstraint, ForeignKey, Integer, Numeric
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..base import Base


class InvoiceStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"


class Invoice(Base):
    __tablename__ = "invoices"
    __table_args__ = (
        CheckConstraint(
            "total_amount >= 0", name="check_invoices_total_amount_positive"
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    client_id: Mapped[int] = mapped_column(
        ForeignKey("clients.id", ondelete="RESTRICT"), index=True, nullable=False
    )
    status: Mapped[InvoiceStatus] = mapped_column(
        SAEnum(InvoiceStatus, name="invoice_status"),
        default=InvoiceStatus.PENDING,
        nullable=False,
        index=True,
    )
    total_amount: Mapped[float] = mapped_column(
        Numeric(12, 2), default=0.00, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relations
    client = relationship("Client", back_populates="invoices")
    items = relationship(
        "InvoiceItem", back_populates="invoice", cascade="all, delete-orphan"
    )
    shipment = relationship("Shipment", back_populates="invoice", uselist=False)

    def recalculate_total(self) -> None:
        self.total_amount = sum(item.total_price for item in self.items)


class InvoiceItem(Base):
    __tablename__ = "invoice_items"
    __table_args__ = (
        CheckConstraint("quantity > 0", name="check_invoice_items_quantity_positive"),
        CheckConstraint(
            "unit_price >= 0", name="check_invoice_items_unit_price_positive"
        ),
        CheckConstraint(
            "total_price >= 0", name="check_invoice_items_total_price_positive"
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    invoice_id: Mapped[int] = mapped_column(
        ForeignKey("invoices.id", ondelete="CASCADE"), index=True, nullable=False
    )
    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="RESTRICT"), index=True, nullable=False
    )
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    total_price: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)

    # Relations
    invoice = relationship("Invoice", back_populates="items")
    product = relationship("Product")

    def __repr__(self) -> str:
        return f"<InvoiceItem(id={self.id}, invoice_id={self.invoice_id})>"
