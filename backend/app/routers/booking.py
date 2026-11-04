from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.database import get_db
from app.models.booking import Booking
from app.schemas.booking import BookingCreate, BookingResponse
from app.auth_utils import get_current_user, require_role
from typing import List

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.post("/", response_model=BookingResponse)
def create_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("Organizer")),
):
    conflict = db.query(Booking).filter(
        Booking.venue_id == booking.venue_id,
        and_(
            Booking.start_time < booking.end_time,
            Booking.end_time > booking.start_time,
        )
    ).first()

    if conflict:
        raise HTTPException(
            status_code=409,
            detail=f"Venue already booked from {conflict.start_time} to {conflict.end_time}"
        )

    new_booking = Booking(**booking.dict())
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking

@router.get("/", response_model=List[BookingResponse])
def get_bookings(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return db.query(Booking).offset(skip).limit(limit).all()

@router.delete("/{booking_id}")
def delete_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("Organizer")),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    db.delete(booking)
    db.commit()
    return {"message": "Booking deleted successfully"}