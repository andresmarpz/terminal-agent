from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.api.v1.products.product_schemas import ProductCreate, ProductDTO, ProductUpdate
from src.db import get_db
from src.db.models.product import Product

router = APIRouter(prefix="/products", tags=["products"])


@router.post("/", response_model=ProductDTO)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    """Create a new product."""
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@router.get("", response_model=List[ProductDTO])
@router.get("/", response_model=List[ProductDTO])
def get_products(db: Session = Depends(get_db)):
    """Get all products."""
    return db.query(Product).all()


@router.get("/{product_id}", response_model=ProductDTO)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get a product by ID."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.put("/{product_id}", response_model=ProductDTO)
def update_product(
    product_id: int, product_update: ProductUpdate, db: Session = Depends(get_db)
):
    """Update a product by ID."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in product_update.dict(exclude_unset=True).items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", response_model=dict)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Delete a product by ID."""
    raise HTTPException(status_code=503, detail="Not implemented")
