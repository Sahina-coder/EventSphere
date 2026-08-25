from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.venue_map import VenueMapPoint
from app.schemas.venue_map import VenueMapPointCreate, VenueMapPointResponse
from typing import List

router = APIRouter(prefix="/venue-map", tags=["Venue Map"])

@router.post("/", response_model=VenueMapPointResponse)
def add_point(point: VenueMapPointCreate, db: Session = Depends(get_db)):
    new_point = VenueMapPoint(**point.dict())
    db.add(new_point)
    db.commit()
    db.refresh(new_point)
    return new_point

@router.get("/venue/{venue_id}", response_model=List[VenueMapPointResponse])
def get_venue_map(venue_id: int, db: Session = Depends(get_db)):
    return db.query(VenueMapPoint).filter(VenueMapPoint.venue_id == venue_id).all()

@router.delete("/{point_id}")
def delete_point(point_id: int, db: Session = Depends(get_db)):
    point = db.query(VenueMapPoint).filter(VenueMapPoint.id == point_id).first()
    if not point:
        raise HTTPException(status_code=404, detail="Map point not found")
    db.delete(point)
    db.commit()
    return {"message": "Map point removed"}