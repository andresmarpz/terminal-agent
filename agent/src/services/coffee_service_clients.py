from typing import Dict, List, Optional

from src.services.coffee_service_base import CoffeeServiceBase


class CoffeeServiceClients(CoffeeServiceBase):
    """Service for interacting with the Coffee Service API clients endpoints."""

    async def create_client(
        self, name: str, email: str, phone: Optional[str] = None
    ) -> Dict:
        """Create a new client.

        Args:
            name: The client's name
            email: The client's email
            phone: The client's phone number (optional)

        Returns:
            The created client data
        """
        client_data = {"name": name, "email": email}
        if phone:
            client_data["phone"] = phone

        try:
            response = await self.make_request(
                "POST", "/api/v1/clients", json=client_data, timeout=5.0
            )
            return response.json()
        except Exception:
            return {}

    async def get_clients(self) -> List[Dict]:
        """Get all clients.

        Returns:
            List of all clients
        """
        try:
            response = await self.make_request("GET", "/api/v1/clients", timeout=5.0)
            return response.json()
        except Exception:
            return []

    async def get_client(self, client_id: int) -> Dict:
        """Get a client by ID.

        Args:
            client_id: The client's ID

        Returns:
            The client data
        """
        try:
            response = await self.make_request(
                "GET", f"/api/v1/clients/{client_id}", timeout=5.0
            )
            return response.json()
        except Exception:
            return {}

    async def update_client(
        self,
        client_id: int,
        name: Optional[str] = None,
        email: Optional[str] = None,
        phone: Optional[str] = None,
    ) -> Dict:
        """Update a client by ID.

        Args:
            client_id: The client's ID
            name: The client's new name (optional)
            email: The client's new email (optional)
            phone: The client's new phone number (optional)

        Returns:
            The updated client data
        """
        update_data = {}
        if name:
            update_data["name"] = name
        if email:
            update_data["email"] = email
        if phone:
            update_data["phone"] = phone

        try:
            response = await self.make_request(
                "PUT", f"/api/v1/clients/{client_id}", json=update_data, timeout=5.0
            )
            return response.json()
        except Exception:
            return {}

    async def delete_client(self, client_id: int) -> Dict:
        """Delete a client by ID.

        Args:
            client_id: The client's ID

        Returns:
            Confirmation message
        """
        try:
            response = await self.make_request(
                "DELETE", f"/api/v1/clients/{client_id}", timeout=5.0
            )
            return response.json()
        except Exception:
            return {"message": "Failed to delete client"}
