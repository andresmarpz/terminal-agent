import httpx

from src.core.config import get_settings


class CoffeeServiceBase:
    """Base service for interacting with the Coffee Service API."""

    def __init__(self, api_url: str):
        """Initialize the Coffee Service Base.

        Args:
            api_url: URL of the Coffee Service API
        """
        self.api_url = api_url
        self.api_key = get_settings().BACKEND_API_KEY

    async def make_request(self, method: str, path: str, **kwargs) -> httpx.Response:
        """Make a request to the Coffee Service API with authentication.

        Args:
            method: HTTP method (GET, POST, etc.)
            path: API endpoint path (should start with '/')
            **kwargs: Additional arguments to pass to the request

        Returns:
            httpx.Response: The response from the API

        Raises:
            Exception: If the request fails
        """
        # Ensure the API URL doesn't end with a slash and the path starts with one
        base_url = self.api_url.rstrip("/")
        path = path if path.startswith("/") else f"/{path}"
        url = f"{base_url}{path}"

        headers = kwargs.get("headers", {})
        headers["x-api-key"] = self.api_key
        kwargs["headers"] = headers

        async with httpx.AsyncClient() as client:
            return await getattr(client, method.lower())(url, **kwargs)

    async def check_health(self) -> bool:
        """Check if the Coffee Service is running by making a request to its health endpoint."""
        try:
            response = await self.make_request("GET", "/health", timeout=5.0)
            return response.status_code == 200
        except Exception:
            return False
