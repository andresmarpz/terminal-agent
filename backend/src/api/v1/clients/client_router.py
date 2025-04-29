from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.api.v1.clients.client_schemas import ClientCreate, ClientDTO, ClientUpdate
from src.db import get_db
from src.db.models.client import Client

router = APIRouter(prefix="/clients", tags=["clients"])


@router.post("/", response_model=ClientDTO)
def create_client(client: ClientCreate, db: Session = Depends(get_db)):
    """Create a new client."""
    db_client = Client(**client.model_dump())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client


@router.get("", response_model=List[ClientDTO])
@router.get("/", response_model=List[ClientDTO])
def get_clients(db: Session = Depends(get_db)):
    """Get all clients."""
    return db.query(Client).all()


@router.get("/{client_id}", response_model=ClientDTO)
def get_client(client_id: int, db: Session = Depends(get_db)):
    """Get a client by ID."""
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


@router.put("/{client_id}", response_model=ClientDTO)
def update_client(
    client_id: int, client_update: ClientUpdate, db: Session = Depends(get_db)
):
    """Update a client by ID."""
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    for key, value in client_update.model_dump(exclude_unset=True).items():
        setattr(client, key, value)
    db.commit()
    db.refresh(client)
    return client


@router.delete("/{client_id}", response_model=dict)
def delete_client(client_id: int, db: Session = Depends(get_db)):
    """Delete a client by ID."""
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    db.delete(client)
    db.commit()
    return {"message": "Client deleted successfully"}
