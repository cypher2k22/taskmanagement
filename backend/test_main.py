import os

# Keep the import-time application database isolated from a developer's local data.
os.environ.setdefault("DATABASE_URL", "sqlite:///./test_taskmanagement.db")

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import main
from database import Base


@pytest.fixture
def client(tmp_path):
    """Give each test a fresh database so tests are repeatable and independent."""
    database_path = tmp_path / "tasks.db"
    test_engine = create_engine(
        f"sqlite:///{database_path}",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=test_engine,
    )
    Base.metadata.create_all(bind=test_engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    main.app.dependency_overrides[main.get_db] = override_get_db

    with TestClient(main.app) as test_client:
        yield test_client

    main.app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=test_engine)
    test_engine.dispose()


def test_health_check(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "task-management-api",
    }


def test_create_and_list_tasks(client):
    created = client.post("/tasks", json={"text": "Build API tests"})

    assert created.status_code == 201
    task = created.json()
    assert task["text"] == "Build API tests"
    assert task["done"] is False
    assert isinstance(task["id"], int)

    listed = client.get("/tasks")
    assert listed.status_code == 200
    assert listed.json() == [task]


def test_rejects_whitespace_only_task_text(client):
    response = client.post("/tasks", json={"text": "   "})

    assert response.status_code == 400
    assert response.json()["detail"] == "Task text cannot be empty"


def test_rejects_task_text_over_maximum_length(client):
    response = client.post("/tasks", json={"text": "x" * 501})

    assert response.status_code == 422


def test_toggle_task_and_put_compatibility(client):
    created = client.post("/tasks", json={"text": "Review pull request"})
    task_id = created.json()["id"]

    patched = client.patch(f"/tasks/{task_id}")
    assert patched.status_code == 200
    assert patched.json()["done"] is True

    put_response = client.put(f"/tasks/{task_id}")
    assert put_response.status_code == 200
    assert put_response.json()["done"] is False


def test_delete_task(client):
    created = client.post("/tasks", json={"text": "Delete me"})
    task_id = created.json()["id"]

    deleted = client.delete(f"/tasks/{task_id}")
    assert deleted.status_code == 200
    assert deleted.json() == {"message": "deleted", "id": task_id}

    listed = client.get("/tasks")
    assert listed.status_code == 200
    assert listed.json() == []


@pytest.mark.parametrize(
    "method",
    [
        lambda client, task_id: client.delete(f"/tasks/{task_id}"),
        lambda client, task_id: client.patch(f"/tasks/{task_id}"),
        lambda client, task_id: client.put(f"/tasks/{task_id}"),
    ],
)
def test_missing_task_returns_404(client, method):
    response = method(client, 999999)

    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"
