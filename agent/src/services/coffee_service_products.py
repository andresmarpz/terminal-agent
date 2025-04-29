from src.services.coffee_service_base import CoffeeServiceBase


class CoffeeServiceProducts(CoffeeServiceBase):
    """Service for product-related operations."""

    async def get_products(self) -> list[dict]:
        """Get all products from the Coffee Service."""
        try:
            response = await self.make_request("GET", "/api/v1/products", timeout=5.0)
            return response.json()
        except Exception:
            return []

    async def get_product_by_id(self, product_id: str) -> dict:
        """Get a product by its ID from the Coffee Service."""
        try:
            response = await self.make_request(
                "GET", f"/api/v1/products/{product_id}", timeout=5.0
            )
            return response.json()
        except Exception:
            return {}
