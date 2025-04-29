from fastapi import APIRouter

from src.api.v1.clients.client_router import router as client_router
from src.api.v1.invoices.invoice_router import router as invoice_router
from src.api.v1.products.product_router import router as product_router
from src.api.v1.shipments.shipment_router import router as shipment_router
from src.core.config import get_settings

api_router_v1 = APIRouter(prefix=get_settings().API_V1_STR)

api_router_v1.include_router(product_router)
api_router_v1.include_router(client_router)
api_router_v1.include_router(shipment_router)
api_router_v1.include_router(invoice_router)


@api_router_v1.get("/")
async def index():
    """Index endpoint.

    Returns the API version.
    """
    return {"version": get_settings().API_VERSION}


@api_router_v1.get("/protected")
async def protected():
    """Protected endpoint.

    Returns a message.
    """
    return {"protected": True}
