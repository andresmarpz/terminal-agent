from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class InvoiceStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"


class InvoiceItemCreate(BaseModel):
    """Create a new invoice item."""

    product_id: int
    quantity: int = Field(..., gt=0)


class InvoiceItemDTO(BaseModel):
    """Invoice item data transfer object."""

    id: int
    invoice_id: int
    product_id: int
    quantity: int
    unit_price: float
    total_price: float

    class Config:
        """Config for the InvoiceItemDTO."""

        from_attributes = True


class InvoiceCreate(BaseModel):
    """Create a new invoice."""

    client_id: int
    items: List[InvoiceItemCreate]
    status: InvoiceStatus = InvoiceStatus.PENDING


class InvoiceUpdate(BaseModel):
    """Update an invoice."""

    status: Optional[InvoiceStatus] = None


class InvoiceDTO(BaseModel):
    """Invoice data transfer object."""

    id: int
    client_id: int
    status: InvoiceStatus
    total_amount: float
    created_at: datetime
    updated_at: datetime
    items: List[InvoiceItemDTO] = []

    class Config:
        """Config for the InvoiceDTO."""

        from_attributes = True
