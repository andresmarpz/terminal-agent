from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.status import HTTP_401_UNAUTHORIZED

from src.core.config import get_settings


def register_api_key_middleware(app: FastAPI):
    """Register the API key middleware."""

    @app.middleware("http")
    async def api_key_middleware(request: Request, call_next):
        """Require API key for all requests to the API v1."""
        settings = get_settings()
        if request.url.path.startswith(settings.API_V1_STR):
            api_key = request.headers.get("x-api-key")
            if not api_key:
                return JSONResponse(
                    status_code=HTTP_401_UNAUTHORIZED,
                    content={"detail": "Missing API Key in header 'x-api-key'"},
                )
            if api_key != settings.API_KEY:
                return JSONResponse(
                    status_code=HTTP_401_UNAUTHORIZED,
                    content={"detail": "Invalid API Key in header 'x-api-key'"},
                )
        return await call_next(request)
