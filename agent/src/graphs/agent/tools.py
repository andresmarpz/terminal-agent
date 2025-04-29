from langchain_core.tools import tool

from src.services.coffee_service import coffee_service


@tool()
async def check_coffee_service() -> bool:
    """Check if the Coffee Service is running by making a request to its health endpoint."""
    return await coffee_service.check_coffee_service()


@tool()
async def get_products() -> list[dict]:
    """Get all coffee products from the Coffee Service."""
    return await coffee_service.get_products()


agent_tools = [check_coffee_service, get_products]
