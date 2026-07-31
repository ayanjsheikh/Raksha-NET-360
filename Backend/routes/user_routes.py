from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from models.user import User
from schemas.user_schema import UserCreate

router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)

# Register User
@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):

    new_user = User(
        name=user.name,
        age=user.age,
        category=user.category,
        gender=user.gender,
        blood_group=user.blood_group,
        height=user.height,
        weight=user.weight,
        medical_condition=user.medical_condition
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User Registered Successfully",
        "user_id": new_user.id
    }

# Get All Users
@router.get("/")
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users