from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from models.contact import EmergencyContact
from schemas.contact_schema import ContactCreate

router = APIRouter(
    prefix="/api/contact",
    tags=["Emergency Contacts"]
)

@router.post("/add")
def add_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    new_contact = EmergencyContact(
        user_id=contact.user_id,
        name=contact.name,
        phone=contact.phone,
        relation=contact.relation
    )

    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)

    return {
        "message": "Contact Added Successfully",
        "contact_id": new_contact.id
    }

@router.get("/{user_id}")
def get_contacts(user_id: int, db: Session = Depends(get_db)):
    return db.query(EmergencyContact).filter(
        EmergencyContact.user_id == user_id
    ).all()