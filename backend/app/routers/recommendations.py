from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.venue import Venue
from app.models.booking import Booking
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/recommendations", tags=["Smart Recommendations"])

class VenueRecommendation(BaseModel):
    venue_id: int
    name: str
    location: str
    capacity: int
    is_available: str
    score: int
    reasons: List[str]

@router.get("/venues", response_model=List[VenueRecommendation])
def recommend_venues(
    expected_participants: int = Query(..., description="Expected number of participants"),
    db: Session = Depends(get_db),
):
    venues = db.query(Venue).all()
    booked_venue_ids = {b.venue_id for b in db.query(Booking).all()}

    results = []
    for v in venues:
        score = 0
        reasons = []

        # Capacity suitability (up to 50 points)
        if v.capacity >= expected_participants:
            excess_ratio = v.capacity / expected_participants if expected_participants > 0 else 1
            if excess_ratio <= 1.3:
                score += 50
                reasons.append("Capacity closely matches expected participants")
            elif excess_ratio <= 2:
                score += 35
                reasons.append("Capacity comfortably fits expected participants")
            else:
                score += 20
                reasons.append("Capacity is much larger than needed")
        else:
            reasons.append(f"Capacity ({v.capacity}) is below expected participants ({expected_participants})")

        # Availability (up to 30 points)
        currently_booked = v.id in booked_venue_ids
        if v.is_available == "Available" and not currently_booked:
            score += 30
            reasons.append("Currently available with no conflicting bookings")
        elif v.is_available == "Available":
            score += 15
            reasons.append("Marked available but has existing bookings — check time slot")
        else:
            reasons.append("Marked unavailable")

        # Base viability (up to 20 points) - always gets some credit for existing
        score += 20

        results.append(VenueRecommendation(
            venue_id=v.id,
            name=v.name,
            location=v.location,
            capacity=v.capacity,
            is_available=v.is_available,
            score=min(score, 100),
            reasons=reasons,
        ))

    results.sort(key=lambda r: r.score, reverse=True)
    return results