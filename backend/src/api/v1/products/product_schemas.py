from typing import Optional

from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    """Create a new product."""

    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    price: float


class ProductUpdate(BaseModel):
    """Update a product."""

    name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    price: Optional[float] = None


class ProductDTO(BaseModel):
    """Product data transfer object."""

    id: int
    name: str
    description: Optional[str]
    price: float

    class Config:
        """Config for the ProductDTO."""

        from_attributes = True
