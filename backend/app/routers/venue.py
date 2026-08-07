from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.venue import Venue
from app.schemas.venue import VenueCreate, VenueResponse
from typing import List

router = APIRouter(prefix="/venues", tags=["Venues"])

@router.post("/", response_model=VenueResponse)
def create_venue(venue: VenueCreate, db: Session = Depends(get_db)):
    new_venue = Venue(**venue.dict())
    db.add(new_venue)
    db.commit()
    db.refresh(new_venue)
    return new_venue

@router.get("/", response_model=List[VenueResponse])
def get_venues(db: Session = Depends(get_db)):
    return db.query(Venue).all()

@router.get("/{venue_id}", response_model=VenueResponse)
def get_venue(venue_id: int, db: Session = Depends(get_db)):
    venue = db.query(Venue).filter(Venue.id == venue_id).first()
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    return venue

@router.put("/{venue_id}", response_model=VenueResponse)
def update_venue(venue_id: int, updated: VenueCreate, db: Session = Depends(get_db)):
    venue = db.query(Venue).filter(Venue.id == venue_id).first()
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    for key, value in updated.dict().items():
        setattr(venue, key, value)
    db.commit()
    db.refresh(venue)
    return venue

@router.delete("/{venue_id}")
def delete_venue(venue_id: int, db: Session = Depends(get_db)):
    venue = db.query(Venue).filter(Venue.id == venue_id).first()
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    db.delete(venue)
    db.commit()
    return {"message": "Venue deleted successfully"}