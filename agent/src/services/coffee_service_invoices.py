from typing import Dict, List

from pydantic import BaseModel

from src.services.coffee_service_base import CoffeeServiceBase


class InvoiceItem(BaseModel):
    product_id: int
    quantity: int


class CoffeeServiceInvoices(CoffeeServiceBase):
    """Service for interacting with the Coffee Service API invoices endpoints."""

    async def create_invoice(
        self, client_id: int, items: List[InvoiceItem], status: str = "pending"
    ) -> Dict:
        """Create a new invoice.

        Args:
            client_id: The client's ID
            items: List of invoice items, each containing product_id, quantity, and unit_price
            status: Invoice status, defaults to "pending"

        Returns:
            The created invoice data with items
        """
        invoice_data = {
            "client_id": client_id,
            "status": status,
            "items": [item.model_dump() for item in items],
        }

        try:
            response = await self.make_request(
                "POST", "/api/v1/invoices", json=invoice_data, timeout=5.0
            )
            print(f"Response: {response}")
            return response.json()
        except Exception as e:
            print(f"Error: {e}")
            raise e

    async def get_invoices(self) -> List[Dict]:
        """Get all invoices.

        Returns:
            List of all invoices with their items
        """
        try:
            response = await self.make_request("GET", "/api/v1/invoices", timeout=5.0)
            return response.json()
        except Exception:
            return []

    async def get_invoice(self, invoice_id: int) -> Dict:
        """Get an invoice by ID.

        Args:
            invoice_id: The invoice's ID

        Returns:
            The invoice data with items
        """
        try:
            response = await self.make_request(
                "GET", f"/api/v1/invoices/{invoice_id}", timeout=5.0
            )
            return response.json()
        except Exception:
            return {}

    async def update_invoice(
        self,
        invoice_id: int,
        status: str,
    ) -> Dict:
        """Update an invoice's status.

        Args:
            invoice_id: The invoice's ID
            status: The new status for the invoice

        Returns:
            The updated invoice data with items
        """
        update_data = {"status": status}

        try:
            response = await self.make_request(
                "PUT", f"/api/v1/invoices/{invoice_id}", json=update_data, timeout=5.0
            )
            return response.json()
        except Exception:
            return {}

    async def get_invoices_by_client(self, client_id: int) -> List[Dict]:
        """Get all invoices for a specific client.

        Args:
            client_id: The client's ID

        Returns:
            List of invoices for the client with their items
        """
        try:
            response = await self.make_request(
                "GET", f"/api/v1/invoices/client/{client_id}", timeout=5.0
            )
            return response.json()
        except Exception:
            return []

    async def delete_invoice(self, invoice_id: int) -> Dict:
        """Delete an invoice by ID.

        Args:
            invoice_id: The invoice's ID

        Returns:
            Confirmation message
        """
        try:
            response = await self.make_request(
                "DELETE", f"/api/v1/invoices/{invoice_id}", timeout=5.0
            )
            return response.json()
        except Exception:
            return {"message": "Failed to delete invoice"}
