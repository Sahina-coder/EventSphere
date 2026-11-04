from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.event import Event
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
    db.delete(event)
    db.commit()
    return {"message": "Event deleted successfully"}