from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.api.v1.shipments.shipment_schemas import (
    ShipmentCreate,
    ShipmentDTO,
    ShipmentUpdate,
)
from src.db import get_db
from src.db.models.shipment import Shipment

router = APIRouter(prefix="/shipments", tags=["shipments"])


@router.post("/", response_model=ShipmentDTO)
def create_shipment(shipment: ShipmentCreate, db: Session = Depends(get_db)):
    """Create a new shipment."""
    db_shipment = Shipment(**shipment.model_dump())
    db.add(db_shipment)
    db.commit()
    db.refresh(db_shipment)
    return db_shipment


@router.get("", response_model=List[ShipmentDTO])
@router.get("/", response_model=List[ShipmentDTO])
def get_shipments(db: Session = Depends(get_db)):
    """Get all shipments."""
    return db.query(Shipment).all()


@router.get("/{shipment_id}", response_model=ShipmentDTO)
def get_shipment(shipment_id: int, db: Session = Depends(get_db)):
    """Get a shipment by ID."""
    shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment


@router.put("/{shipment_id}", response_model=ShipmentDTO)
def update_shipment(
    shipment_id: int, shipment_update: ShipmentUpdate, db: Session = Depends(get_db)
):
    """Update a shipment by ID."""
    shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    for key, value in shipment_update.model_dump(exclude_unset=True).items():
        setattr(shipment, key, value)
    db.commit()
    db.refresh(shipment)
    return shipment


@router.get("/client/{client_id}", response_model=List[ShipmentDTO])
def get_shipments_by_client(client_id: int, db: Session = Depends(get_db)):
    """Get all shipments for a specific client."""
    shipments = db.query(Shipment).filter(Shipment.client_id == client_id).all()
    return shipments


@router.delete("/{shipment_id}", response_model=dict)
def delete_shipment(shipment_id: int, db: Session = Depends(get_db)):
    """Delete a shipment by ID."""
    shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    db.delete(shipment)
    db.commit()
    return {"message": "Shipment deleted successfully"}
