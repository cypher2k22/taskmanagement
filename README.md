# Task Management System

A full-stack task management application designed as a practical software-engineering project, with a React frontend and FastAPI/SQLAlchemy backend.

## Engineering goals

- REST API design and HTTP status codes
- Input validation and error handling
- SQLAlchemy persistence
- Automated API tests with an isolated test database
- Environment-based configuration
- Accessible frontend loading, empty, and error states
- Frontend/backend separation and continuous integration
- Secure development defaults

## Architecture

React + Vite → FastAPI → SQLAlchemy → SQLite (default) or another SQLAlchemy-supported database

## Backend

- Python
- FastAPI and Pydantic
- SQLAlchemy
- Pytest and HTTPX
- Uvicorn

### API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Service health check |
| GET | `/tasks` | List tasks |
| POST | `/tasks` | Create a task |
| PATCH | `/tasks/{id}` | Toggle completion |
| PUT | `/tasks/{id}` | Toggle completion (compatibility endpoint) |
| DELETE | `/tasks/{id}` | Delete a task |

### Run the backend

```bash
cd backend
python -m venv .venv
# macOS/Linux:
source .venv/bin/activate
# Windows PowerShell:
# .venv\Scripts\Activate.ps1
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

The API runs at `http://127.0.0.1:8000`; interactive API documentation is available at `http://127.0.0.1:8000/docs`.

By default, the app uses a local SQLite database. Set `DATABASE_URL` in `backend/.env` to use another SQLAlchemy-supported database. Configure `CORS_ORIGINS` as a comma-separated list of trusted browser origins; the defaults allow the local Vite development server.

### Run backend tests

```bash
cd backend
pytest
```

Tests use a fresh temporary SQLite database per test, so they do not depend on or modify your development task data.

## Frontend

In a separate terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL` in `frontend/.env` to the base URL of the backend (without a trailing slash). The default is `http://127.0.0.1:8000`.

Production checks:

```bash
npm run lint
npm run build
```

## Continuous integration

GitHub Actions runs backend tests and frontend lint/build checks on pushes and pull requests targeting `main`.

## Current functionality

- Create tasks with input validation
- List persisted tasks
- Toggle completion state
- Delete tasks
- Filter all, pending, and completed tasks
- Display task totals and completed totals
- Show loading, API error, and empty states
- Configure the backend URL through a frontend environment variable

## Security and reliability notes

- CORS is restricted to configured origins rather than allowing every browser origin.
- Keep local `.env` files and credentials out of Git.
- The frontend displays API errors instead of silently failing.
- The API validates task text and returns a 404 for operations on missing tasks.
- Authentication and user-owned tasks are not implemented yet; this is currently a single-user demo and should not be exposed as a multi-user production service without access controls.

## Roadmap

- Authentication and authorization
- User-owned tasks
- Task priorities and due dates
- Filtering, sorting, and pagination on the API
- Database migrations
- Dockerized deployment
- Observability and structured logging

## Author

**Bakeerathan Karthigan**  
Computer Engineering Undergraduate · University of Sri Jayewardenepura

GitHub: https://github.com/cypher2k22
