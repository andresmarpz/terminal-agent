from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from src.api.v1.invoices.invoice_schemas import InvoiceCreate, InvoiceDTO, InvoiceUpdate
from src.db import get_db
from src.db.models.invoice import Invoice, InvoiceItem
from src.db.models.product import Product

router = APIRouter(prefix="/invoices", tags=["invoices"])


@router.post("", response_model=InvoiceDTO)
@router.post("/", response_model=InvoiceDTO)
def create_invoice(invoice_data: InvoiceCreate, db: Session = Depends(get_db)):
    """Create a new invoice with items."""
    # Create the invoice
    new_invoice = Invoice(
        client_id=invoice_data.client_id,
        status=invoice_data.status,
    )
    db.add(new_invoice)
    db.flush()  # Flush to get the invoice ID

    # Create invoice items
    for item_data in invoice_data.items:
        # Get product price from database
        product = db.query(Product).filter(Product.id == item_data.product_id).first()
        if not product:
            raise HTTPException(
                status_code=404, detail=f"Product {item_data.product_id} not found"
            )

        item = InvoiceItem(
            invoice_id=new_invoice.id,
            product_id=item_data.product_id,
            quantity=item_data.quantity,
            unit_price=float(product.price),
            total_price=float(product.price) * item_data.quantity,
        )
        db.add(item)

    # Recalculate the total amount
    new_invoice.recalculate_total()

    db.commit()
    db.refresh(new_invoice)

    # Return with items loaded
    return (
        db.query(Invoice)
        .options(joinedload(Invoice.items))
        .filter(Invoice.id == new_invoice.id)
        .first()
    )


@router.get("", response_model=List[InvoiceDTO])
@router.get("/", response_model=List[InvoiceDTO])
def get_invoices(db: Session = Depends(get_db)):
    """Get all invoices with their items."""
    return db.query(Invoice).options(joinedload(Invoice.items)).all()


@router.get("/{invoice_id}", response_model=InvoiceDTO)
def get_invoice(invoice_id: int, db: Session = Depends(get_db)):
    """Get an invoice by ID with its items."""
    invoice = (
        db.query(Invoice)
        .options(joinedload(Invoice.items))
        .filter(Invoice.id == invoice_id)
        .first()
    )

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    return invoice


@router.put("/{invoice_id}", response_model=InvoiceDTO)
def update_invoice(
    invoice_id: int, invoice_update: InvoiceUpdate, db: Session = Depends(get_db)
):
    """Update an invoice's status."""
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    # Update only allowed fields (status in this case)
    for key, value in invoice_update.model_dump(exclude_unset=True).items():
        setattr(invoice, key, value)

    db.commit()
    db.refresh(invoice)

    # Return with items loaded
    return (
        db.query(Invoice)
        .options(joinedload(Invoice.items))
        .filter(Invoice.id == invoice_id)
        .first()
    )


@router.get("/client/{client_id}", response_model=List[InvoiceDTO])
def get_invoices_by_client(client_id: int, db: Session = Depends(get_db)):
    """Get all invoices for a specific client."""
    invoices = (
        db.query(Invoice)
        .options(joinedload(Invoice.items))
        .filter(Invoice.client_id == client_id)
        .all()
    )

    return invoices


@router.delete("/{invoice_id}", response_model=dict)
def delete_invoice(invoice_id: int, db: Session = Depends(get_db)):
    """Delete an invoice by ID and all its items."""
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    # Items will be deleted automatically due to cascade
    db.delete(invoice)
    db.commit()

    return {"message": "Invoice and its items deleted successfully"}
