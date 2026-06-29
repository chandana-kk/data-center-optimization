from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..core import security
from ..db import models
from ..schemas.user import UserCreate


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user_in: UserCreate):
    hashed_password = security.get_password_hash(user_in.password)
    user = models.User(email=user_in.email, hashed_password=hashed_password, full_name=user_in.full_name)
    db.add(user)
    try:
        db.commit()
        db.refresh(user)
    except IntegrityError as exc:
        db.rollback()
        raise ValueError("A user with that email already exists.") from exc
    return user


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not security.verify_password(password, user.hashed_password):
        return None
    return user
