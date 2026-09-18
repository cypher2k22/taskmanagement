# Task Management System

A full-stack task management application designed as a practical software-engineering project, with a React frontend and FastAPI/SQLAlchemy backend.

## Engineering goals

This project is being developed beyond a basic CRUD demo to demonstrate:

- REST API design
- Input validation and HTTP error handling
- SQLAlchemy persistence
- Automated API tests
- Environment-based configuration
- Frontend/backend separation
- Continuous integration
- Production-ready project hygiene

## Architecture

React + Vite → FastAPI → SQLAlchemy → Database

## Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Pytest
- Uvicorn

### API surface

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Service health check |
| GET | `/tasks` | List tasks |
| POST | `/tasks` | Create a task |
| PATCH | `/tasks/{id}` | Toggle completion |
| PUT | `/tasks/{id}` | Toggle completion (compatibility) |
| DELETE | `/tasks/{id}` | Delete a task |

### Run backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

The API is available at `http://127.0.0.1:8000` and FastAPI documentation at `/docs`.

### Run tests

```bash
cd backend
pytest
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Production checks:

```bash
npm run lint
npm run build
```

## CI

GitHub Actions runs backend tests plus frontend lint/build checks on pushes and pull requests targeting `main`.

## Security hygiene

- `.env` files are ignored and are not part of the repository.
- Local virtual environments are ignored.
- Database files and Python bytecode are ignored.
- Use `.env.example` as the safe configuration template.

## Roadmap

- Authentication and authorization
- User-owned tasks
- Task priorities and due dates
- Filtering, sorting, and pagination
- Database migrations
- API integration tests with isolated test database
- Dockerized deployment
- Observability and structured logging

## Author

**Bakeerathan Karthigan**  
Computer Engineering Undergraduate · University of Sri Jayewardenepura

GitHub: https://github.com/cypher2k22
