from src.services.coffee_service_base import CoffeeServiceBase


class CoffeeServiceShipments(CoffeeServiceBase):
    """Service for shipment-related operations."""

    async def create_shipment(
        self, invoice_id: int, client_id: int, status: str = "pending"
    ) -> dict:
        """Create a new shipment.

        Args:
            invoice_id: The ID of the invoice
            client_id: The ID of the client
            status: The shipment status (pending, shipping, done)

        Returns:
            dict: The created shipment object
        """
        try:
            data = {"invoice_id": invoice_id, "client_id": client_id, "status": status}
            response = await self.make_request(
                "POST", "/api/v1/shipments/", json=data, timeout=5.0
            )
            return response.json()
        except Exception:
            return {}

    async def get_shipments(self) -> list[dict]:
        """Get all shipments.

        Returns:
            list[dict]: List of all shipment objects
        """
        try:
            response = await self.make_request("GET", "/api/v1/shipments/", timeout=5.0)
            return response.json()
        except Exception:
            return []

    async def get_shipment_by_id(self, shipment_id: int) -> dict:
        """Get a shipment by its ID.

        Args:
            shipment_id: The ID of the shipment

        Returns:
            dict: The shipment object
        """
        try:
            response = await self.make_request(
                "GET", f"/api/v1/shipments/{shipment_id}", timeout=5.0
            )
            return response.json()
        except Exception:
            return {}

    async def update_shipment(self, shipment_id: int, status: str) -> dict:
        """Update a shipment's status.

        Args:
            shipment_id: The ID of the shipment to update
            status: The new status (pending, shipping, done)

        Returns:
            dict: The updated shipment object
        """
        try:
            data = {"status": status}
            response = await self.make_request(
                "PUT", f"/api/v1/shipments/{shipment_id}", json=data, timeout=5.0
            )
            return response.json()
        except Exception:
            return {}

    async def get_shipments_by_client(self, client_id: int) -> list[dict]:
        """Get all shipments for a specific client.

        Args:
            client_id: The ID of the client

        Returns:
            list[dict]: List of shipment objects for the client
        """
        try:
            response = await self.make_request(
                "GET", f"/api/v1/shipments/client/{client_id}", timeout=5.0
            )
            return response.json()
        except Exception:
            return []
