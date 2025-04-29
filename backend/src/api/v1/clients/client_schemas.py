from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ClientCreate(BaseModel):
    """Create a new client."""

    name: str = Field(..., max_length=255)
    email: str = Field(..., max_length=255)
    country: Optional[str] = Field(None, max_length=100)
    address: Optional[str] = None


class ClientUpdate(BaseModel):
    """Update a client."""

    name: Optional[str] = Field(None, max_length=255)
    email: Optional[str] = Field(None, max_length=255)
    country: Optional[str] = Field(None, max_length=100)
    address: Optional[str] = None


class ClientDTO(BaseModel):
    """Client data transfer object."""

    id: int
    name: str
    email: str
    country: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        """Config for the ClientDTO."""

        from_attributes = True
