from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, Base, get_db
from .config import ALLOWED_ORIGINS
from .models import User
from .schemas import UserCreate, UserResponse
from . import crud


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# HOME
@app.get("/")
def home():

    return {
        "message": "FastAPI + MySQL CRUD Application"
    }


# CREATE USER
@app.post(
    "/users",
    response_model=UserResponse
)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    return crud.create_user(db, user)


# GET ALL USERS
@app.get(
    "/users",
    response_model=list[UserResponse]
)
def get_users(
    db: Session = Depends(get_db)
):

    return crud.get_users(db)


# GET SINGLE USER
@app.get(
    "/users/{user_id}",
    response_model=UserResponse
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = crud.get_user(
        db,
        user_id
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


# UPDATE USER
@app.put(
    "/users/{user_id}",
    response_model=UserResponse
)
def update_user(
    user_id: int,
    user_data: UserCreate,
    db: Session = Depends(get_db)
):

    user = crud.update_user(
        db,
        user_id,
        user_data
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


# DELETE USER
@app.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = crud.delete_user(
        db,
        user_id
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "message": "User deleted successfully"
    }
