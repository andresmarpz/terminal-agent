from langchain_core.tools import tool
from langgraph.types import interrupt

from src.graphs.agent.interrupts import ToolInterrupt
from src.services.coffee_service import coffee_service
from src.services.coffee_service_invoices import InvoiceItem


@tool()
async def check_coffee_service() -> bool:
    """Check if the Coffee Service is running by making a request to its health endpoint."""
    return await coffee_service.check_coffee_service()


# Product tools
@tool()
async def get_products() -> list[dict]:
    """Get all coffee products from the Coffee Service."""
    return await coffee_service.products.get_products()


@tool()
async def get_product_by_id(product_id: str) -> dict:
    """Get a coffee product by its ID from the Coffee Service."""
    return await coffee_service.products.get_product_by_id(product_id)


# Client tools
@tool()
async def create_client(name: str, email: str, phone: str = None) -> dict:
    """Create a new client with the specified name, email, and optional phone number."""
    return await coffee_service.clients.create_client(name, email, phone)


@tool()
async def get_clients() -> list[dict]:
    """Get all clients from the Coffee Service."""
    allowed_responses = ["Y", "n"]
    allowed = interrupt(
        value=ToolInterrupt(
            tool_name="get_clients",
            user_prompt="Can I really get the clients? (Y/n)",
            allowed_responses=allowed_responses,
        )
    )

    if allowed not in allowed_responses:
        return "Invalid response. Please respond with 'Y' or 'n'."

    if allowed == "Y":
        return await coffee_service.clients.get_clients()
    else:
        return "Client retrieval cancelled"


@tool()
async def get_client_by_id(client_id: int) -> dict:
    """Get a client by its ID from the Coffee Service."""
    return await coffee_service.clients.get_client(client_id)


@tool()
async def update_client(
    client_id: int, name: str = None, email: str = None, phone: str = None
) -> dict:
    """Update a client's information by its ID."""
    return await coffee_service.clients.update_client(client_id, name, email, phone)


@tool()
async def delete_client(client_id: int) -> dict:
    """Delete a client by its ID."""
    return await coffee_service.clients.delete_client(client_id)


# Invoice tools
@tool()
async def create_invoice(
    client_id: int, items: list[InvoiceItem], status: str = "pending"
) -> dict:
    """Create a new invoice with the specified client ID, items, and status.

    Each item in the items list should contain product_id, quantity, and unit_price.
    """
    allowed = interrupt(
        "Are you sure you want to create this invoice? (Y/n)",
    )
    print(f"Allowed: {allowed}")

    if allowed:
        return await coffee_service.invoices.create_invoice(client_id, items, status)
    else:
        return "Invoice creation cancelled"


@tool()
async def get_invoices() -> list[dict]:
    """Get all invoices from the Coffee Service."""
    return await coffee_service.invoices.get_invoices()


@tool()
async def get_invoice_by_id(invoice_id: int) -> dict:
    """Get an invoice by its ID from the Coffee Service."""
    return await coffee_service.invoices.get_invoice(invoice_id)


@tool()
async def update_invoice(invoice_id: int, status: str) -> dict:
    """Update the status of an invoice by its ID."""
    return await coffee_service.invoices.update_invoice(invoice_id, status)


@tool()
async def get_invoices_by_client(client_id: int) -> list[dict]:
    """Get all invoices for a specific client from the Coffee Service."""
    return await coffee_service.invoices.get_invoices_by_client(client_id)


@tool()
async def delete_invoice(invoice_id: int) -> dict:
    """Delete an invoice by its ID."""
    return await coffee_service.invoices.delete_invoice(invoice_id)


# Shipment tools
@tool()
async def create_shipment(
    invoice_id: int, client_id: int, status: str = "pending"
) -> dict:
    """Create a new shipment with the specified invoice ID, client ID, and status."""
    return await coffee_service.shipments.create_shipment(invoice_id, client_id, status)


@tool()
async def get_shipments() -> list[dict]:
    """Get all shipments from the Coffee Service."""
    return await coffee_service.shipments.get_shipments()


@tool()
async def get_shipment_by_id(shipment_id: int) -> dict:
    """Get a shipment by its ID from the Coffee Service."""
    return await coffee_service.shipments.get_shipment_by_id(shipment_id)


@tool()
async def update_shipment(shipment_id: int, status: str) -> dict:
    """Update the status of a shipment by its ID."""
    return await coffee_service.shipments.update_shipment(shipment_id, status)


@tool()
async def get_shipments_by_client(client_id: int) -> list[dict]:
    """Get all shipments for a specific client from the Coffee Service."""
    return await coffee_service.shipments.get_shipments_by_client(client_id)


agent_tools = [
    check_coffee_service,
    get_products,
    get_product_by_id,
    create_client,
    get_clients,
    get_client_by_id,
    update_client,
    delete_client,
    create_invoice,
    get_invoices,
    get_invoice_by_id,
    update_invoice,
    get_invoices_by_client,
    delete_invoice,
    create_shipment,
    get_shipments,
    get_shipment_by_id,
    update_shipment,
    get_shipments_by_client,
]
