import os

os.environ["DATABASE_URL"] = "sqlite:///./test_taskmanagement.db"

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_create_and_toggle_task():
    created = client.post("/tasks", json={"text": "Build API tests"})
    assert created.status_code == 201
    task = created.json()
    assert task["text"] == "Build API tests"
    assert task["done"] is False

    updated = client.patch(f"/tasks/{task['id']}")
    assert updated.status_code == 200
    assert updated.json()["done"] is True


def test_missing_task_returns_404():
    response = client.delete("/tasks/999999")
    assert response.status_code == 404
