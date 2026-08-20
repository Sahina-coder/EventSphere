from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.attendee import Attendee
from app.schemas.attendee import AttendeeCreate, AttendeeResponse
from typing import List

router = APIRouter(prefix="/attendees", tags=["Attendees"])

@router.post("/", response_model=AttendeeResponse)
def register_attendee(attendee: AttendeeCreate, db: Session = Depends(get_db)):
    # Duplicate check: same email or phone already registered for this event
    existing = db.query(Attendee).filter(
        Attendee.event_id == attendee.event_id,
        (Attendee.email == attendee.email) | (Attendee.phone == attendee.phone)
    ).first()

    if existing:
        raise HTTPException(
            status_code=409,
            detail="This email or phone number is already registered for this event"
        )

    new_attendee = Attendee(**attendee.dict())
    db.add(new_attendee)
    db.commit()
    db.refresh(new_attendee)
    return new_attendee

@router.get("/", response_model=List[AttendeeResponse])
def get_attendees(db: Session = Depends(get_db)):
    return db.query(Attendee).all()

@router.get("/{attendee_id}", response_model=AttendeeResponse)
def get_attendee(attendee_id: int, db: Session = Depends(get_db)):
    attendee = db.query(Attendee).filter(Attendee.id == attendee_id).first()
    if not attendee:
        raise HTTPException(status_code=404, detail="Attendee not found")
    return attendee

@router.put("/{attendee_id}/status", response_model=AttendeeResponse)
def update_attendance_status(attendee_id: int, status: str, db: Session = Depends(get_db)):
    valid_statuses = ["Registered", "Checked In", "Absent", "Cancelled"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Status must be one of {valid_statuses}")

    attendee = db.query(Attendee).filter(Attendee.id == attendee_id).first()
    if not attendee:
        raise HTTPException(status_code=404, detail="Attendee not found")

    attendee.attendance_status = status
    db.commit()
    db.refresh(attendee)
    return attendee

@router.delete("/{attendee_id}")
def delete_attendee(attendee_id: int, db: Session = Depends(get_db)):
    attendee = db.query(Attendee).filter(Attendee.id == attendee_id).first()
    if not attendee:
        raise HTTPException(status_code=404, detail="Attendee not found")
    db.delete(attendee)
    db.commit()
    return {"message": "Attendee deleted successfully"}