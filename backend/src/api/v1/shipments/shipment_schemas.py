from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel


class ShipmentStatus(str, Enum):
    PENDING = "pending"
    SHIPPING = "shipping"
    DONE = "done"


class ShipmentCreate(BaseModel):
    """Create a new shipment."""

    invoice_id: int
    client_id: int
    status: ShipmentStatus = ShipmentStatus.PENDING


class ShipmentUpdate(BaseModel):
    """Update a shipment."""

    status: Optional[ShipmentStatus] = None


class ShipmentDTO(BaseModel):
    """Shipment data transfer object."""

    id: int
    invoice_id: int
    client_id: int
    status: ShipmentStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        """Config for the ShipmentDTO."""

        from_attributes = True
