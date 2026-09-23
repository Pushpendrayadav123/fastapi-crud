# For run the app

cd backend

# create avirtual enviornment

python3 -m venv venv

# Activate

source venv/bin/activate

# Install

pip install -r requirements.txt

# check

pip list

# FastAPI Employee CRUD

## Environment setup

The local `.env` files are already configured for `localhost`. They are ignored by Git;
the `.env.example` files are safe templates for other developers.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

- `backend/.env` contains `DATABASE_URL` and the comma-separated `ALLOWED_ORIGINS` list.
- `frontend/.env` contains `VITE_API_URL`. This is a public browser value, not a place for secrets.
- Restart FastAPI or Vite after changing an environment file.

## Run the API

```bash
uvicorn app.main:app --reload
```

## Run the React UI

In a second terminal:

```bash
cd frontend
pnpm install
pnpm run dev
```

Open the URL Vite prints (normally `http://localhost:5173`). The UI calls the API at `http://localhost:8000` by default. To use a different URL, copy `.env.example` to `.env` and update `VITE_API_URL`.

<!-- pip freeze > requirements.txt  it bring all installed dependency from venv inside requirement.txt-->
