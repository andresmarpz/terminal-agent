from src.core.config import get_settings
from src.services.coffee_service_base import CoffeeServiceBase
from src.services.coffee_service_clients import CoffeeServiceClients
from src.services.coffee_service_invoices import CoffeeServiceInvoices
from src.services.coffee_service_products import CoffeeServiceProducts
from src.services.coffee_service_shipments import CoffeeServiceShipments


class CoffeeService:
    """Main service that aggregates all specialized Coffee Service modules."""

    def __init__(self, api_url: str):
        """Initialize the Coffee Service with all sub-services.

        Args:
            api_url: URL of the Coffee Service API
        """
        self.api_url = api_url
        self.base = CoffeeServiceBase(api_url)
        self.products = CoffeeServiceProducts(api_url)
        self.shipments = CoffeeServiceShipments(api_url)
        self.clients = CoffeeServiceClients(api_url)
        self.invoices = CoffeeServiceInvoices(api_url)

    async def check_coffee_service(self) -> bool:
        """Check if the Coffee Service is running."""
        return await self.base.check_health()


# Create a singleton instance
coffee_service = CoffeeService(get_settings().BACKEND_API_URL)
