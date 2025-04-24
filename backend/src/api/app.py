from fastapi import FastAPI

from src.api.v1.index import api_router_v1

app = FastAPI()


@app.get("/health")
def health():
    """Health check endpoint."""
    return {"status": "ok"}


# Include the /api/v1 router.
app.include_router(api_router_v1)
