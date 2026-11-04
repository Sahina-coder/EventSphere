from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.feedback import Feedback
from app.models.attendee import Attendee
from app.schemas.feedback import FeedbackCreate, FeedbackResponse, FeedbackSummary
from app.auth_utils import get_current_user
from typing import List

router = APIRouter(prefix="/feedback", tags=["Feedback"])

def avg(values):
    vals = [v for v in values if v is not None]
    return round(sum(vals) / len(vals), 1) if vals else 0.0

@router.post("/", response_model=FeedbackResponse)
def submit_feedback(
    feedback: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    attendee = db.query(Attendee).filter(Attendee.id == feedback.attendee_id).first()
    if not attendee:
        raise HTTPException(status_code=404, detail="Attendee not found")

    if attendee.attendance_status not in ["Checked In", "Registered"]:
        raise HTTPException(status_code=403, detail="Only attendees who attended can submit feedback")

    existing = db.query(Feedback).filter(
        Feedback.event_id == feedback.event_id,
        Feedback.attendee_id == feedback.attendee_id,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Feedback already submitted for this event")

    new_feedback = Feedback(**feedback.dict())
    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)
    return new_feedback

@router.get("/", response_model=List[FeedbackResponse])
def get_all_feedback(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return db.query(Feedback).offset(skip).limit(limit).all()

@router.get("/event/{event_id}/summary", response_model=FeedbackSummary)
def get_feedback_summary(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    items = db.query(Feedback).filter(Feedback.event_id == event_id).all()
    return FeedbackSummary(
        event_id=event_id,
        total_submissions=len(items),
        avg_overall=avg([i.overall_rating for i in items]),
        avg_venue=avg([i.venue_rating for i in items]),
        avg_organization=avg([i.organization_rating for i in items]),
        avg_speaker=avg([i.speaker_rating for i in items]),
        avg_catering=avg([i.catering_rating for i in items]),
    )