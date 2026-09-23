from sqlalchemy.orm import Session

from .models import User
from .schemas import UserCreate


# CREATE
def create_user(
    db: Session,
    user: UserCreate
):
    new_user = User(
        name=user.name,
        email=user.email,
        age=user.age
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return new_user


# READ ALL
def get_users(db: Session):

    return db.query(User).all()


# READ ONE
def get_user(
    db: Session,
    user_id: int
):

    return (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )


# UPDATE
def update_user(
    db: Session,
    user_id: int,
    user_data: UserCreate
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        return None

    user.name = user_data.name
    user.email = user_data.email
    user.age = user_data.age

    db.commit()

    db.refresh(user)

    return user


# DELETE
def delete_user(
    db: Session,
    user_id: int
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        return None

    db.delete(user)

    db.commit()

    return user



   

# create_user()
# get_users()
# get_user()
# update_user()
# delete_user()