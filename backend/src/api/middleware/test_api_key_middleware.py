from fastapi.testclient import TestClient

from src.api.app import app
from src.core.config import get_settings

client = TestClient(app)
settings = get_settings()


def test_health_open():
    """Test the health endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_protected_missing_api_key():
    """Test the protected endpoint with a missing API key."""
    response = client.get(f"{settings.API_V1_STR}/protected")
    assert response.status_code == 401
    assert response.json()["detail"].startswith("Missing API Key")


def test_protected_wrong_api_key():
    """Test the protected endpoint with a wrong API key."""
    response = client.get(
        f"{settings.API_V1_STR}/protected", headers={"x-api-key": "wrong-key"}
    )
    assert response.status_code == 401
    assert response.json()["detail"].startswith("Invalid API Key")


def test_protected_correct_api_key():
    """Test the protected endpoint with the correct API key."""
    response = client.get(
        f"{settings.API_V1_STR}/protected",
        headers={"x-api-key": settings.API_KEY},
    )
    assert response.status_code == 200
    assert response.json() == {"protected": "check"}
