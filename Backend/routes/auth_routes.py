from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db
from models.auth_user import AuthUser
from schemas.auth_schema import RegisterSchema, LoginSchema

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

@router.post("/register")
def register(user: RegisterSchema, db: Session = Depends(get_db)):
    # Check if email already exists
    existing = db.query(AuthUser).filter(AuthUser.email == user.email).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = AuthUser(
        name=user.name,
        email=user.email,
        phone=user.phone,
        password=user.password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Registration Successful",
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email
    }


@router.post("/login")
def login(user: LoginSchema, db: Session = Depends(get_db)):
    existing = db.query(AuthUser).filter(
        AuthUser.email == user.email
    ).first()

    if existing is None:
        raise HTTPException(status_code=404, detail="User not found")

    if existing.password != user.password:
        raise HTTPException(status_code=401, detail="Incorrect password")

    return {
        "message": "Login Successful",
        "id": existing.id,
        "name": existing.name,
        "email": existing.email
    }