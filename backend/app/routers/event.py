from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.event import Event
from app.models.booking import Booking
from app.models.attendee import Attendee
from app.models.ticket import Ticket
from app.models.certificate import Certificate
from app.models.feedback import Feedback
from app.models.allocation import Allocation
from app.models.resource import Resource
from app.models.vendor_assignment import VendorAssignment
from app.models.expense import Expense
from app.models.sponsor import Sponsor
from app.schemas.event import EventCreate, EventResponse
from app.auth_utils import get_current_user, require_role
from typing import List

router = APIRouter(prefix="/events", tags=["Events"])

@router.post("/", response_model=EventResponse)
def create_event(
    event: EventCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("Organizer")),
):
    new_event = Event(**event.dict())
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

@router.get("/", response_model=List[EventResponse])
def get_events(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return db.query(Event).offset(skip).limit(limit).all()

@router.get("/{event_id}", response_model=EventResponse)
def get_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.put("/{event_id}", response_model=EventResponse)
def update_event(
    event_id: int,
    updated: EventCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("Organizer")),
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    for key, value in updated.dict().items():
        setattr(event, key, value)
    db.commit()
    db.refresh(event)
    return event

@router.delete("/{event_id}")
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("Organizer")),
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # 1. Return allocated resource quantities back to inventory before deleting allocations
    allocations = db.query(Allocation).filter(Allocation.event_id == event_id).all()
    for alloc in allocations:
        resource = db.query(Resource).filter(Resource.id == alloc.resource_id).first()
        if resource:
            resource.quantity_available += alloc.quantity
        db.delete(alloc)

    # 2. Delete certificates, tickets, and feedback
    db.query(Certificate).filter(Certificate.event_id == event_id).delete(synchronize_session=False)
    db.query(Ticket).filter(Ticket.event_id == event_id).delete(synchronize_session=False)
    db.query(Feedback).filter(Feedback.event_id == event_id).delete(synchronize_session=False)

    # 3. Delete attendees
    db.query(Attendee).filter(Attendee.event_id == event_id).delete(synchronize_session=False)

    # 4. Delete bookings
    db.query(Booking).filter(Booking.event_id == event_id).delete(synchronize_session=False)

    # 5. Delete vendor assignments, expenses, sponsors
    db.query(VendorAssignment).filter(VendorAssignment.event_id == event_id).delete(synchronize_session=False)
    db.query(Expense).filter(Expense.event_id == event_id).delete(synchronize_session=False)
    db.query(Sponsor).filter(Sponsor.event_id == event_id).delete(synchronize_session=False)

    # 6. Delete the event itself
    db.delete(event)
    db.commit()
    return {"message": "Event and all associated records deleted successfully"}