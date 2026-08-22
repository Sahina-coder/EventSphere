from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.event import Event
from app.models.attendee import Attendee
from app.models.booking import Booking
from app.models.allocation import Allocation
from app.models.resource import Resource
from app.models.vendor_assignment import VendorAssignment
from app.models.expense import Expense
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/health-score", tags=["Health Score"])

class HealthScoreResponse(BaseModel):
    event_id: int
    score: int
    status: str
    breakdown: dict
    issues: List[str]

@router.get("/event/{event_id}", response_model=HealthScoreResponse)
def get_health_score(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    issues = []

    # Registration readiness (20%) - has at least some registrations
    attendee_count = db.query(Attendee).filter(Attendee.event_id == event_id).count()
    registration_score = min(attendee_count / 10, 1) * 20 if attendee_count > 0 else 0
    if attendee_count == 0:
        issues.append("No participants registered yet")
    elif attendee_count < 5:
        issues.append("Registration is below target")

    # Venue readiness (15%) - has a booking
    booking = db.query(Booking).filter(Booking.event_id == event_id).first()
    venue_score = 15 if booking else 0
    if not booking:
        issues.append("No venue booked for this event")

    # Resource readiness (15%) - has allocations, none unavailable
    allocations = db.query(Allocation).filter(Allocation.event_id == event_id).all()
    resource_score = 15 if allocations else 0
    unavailable_resources = 0
    for alloc in allocations:
        resource = db.query(Resource).filter(Resource.id == alloc.resource_id).first()
        if resource and resource.quantity_available < 0:
            unavailable_resources += 1
    if not allocations:
        issues.append("No resources allocated yet")
    if unavailable_resources > 0:
        issues.append(f"{unavailable_resources} resource(s) over-allocated")

    # Vendor readiness (15%)
    vendor_assignments = db.query(VendorAssignment).filter(VendorAssignment.event_id == event_id).all()
    vendor_score = 15 if vendor_assignments else 0
    pending_vendors = [v for v in vendor_assignments if v.status != "Confirmed"]
    if not vendor_assignments:
        issues.append("No vendors assigned")
    elif pending_vendors:
        issues.append(f"{len(pending_vendors)} vendor(s) not yet confirmed")

    # Budget health (10%)
    expenses = db.query(Expense).filter(Expense.event_id == event_id).all()
    total_expenses = sum(e.amount for e in expenses)
    total_budget = event.budget or 0
    if total_budget > 0:
        utilization = (total_expenses / total_budget) * 100
        if utilization > 100:
            budget_score = 0
            issues.append("Budget exceeded")
        elif utilization > 90:
            budget_score = 5
            issues.append("Budget nearly exhausted (over 90% used)")
        else:
            budget_score = 10
    else:
        budget_score = 5

    # Schedule readiness (10%) - event has a date set (always true, but check if in past without completion)
    schedule_score = 10

    # Attendance/engagement (15%) - only meaningful post-event, otherwise neutral partial credit
    checked_in = db.query(Attendee).filter(
        Attendee.event_id == event_id, Attendee.attendance_status == "Checked In"
    ).count()
    if event.status == "Completed" and attendee_count > 0:
        attendance_score = (checked_in / attendee_count) * 15
        if checked_in / attendee_count < 0.5:
            issues.append("Low attendance turnout")
    else:
        attendance_score = 7.5  # neutral, not yet applicable

    total_score = round(
        registration_score + venue_score + resource_score + vendor_score + budget_score + schedule_score + attendance_score
    )
    total_score = max(0, min(100, total_score))

    if total_score >= 80:
        status = "Healthy"
    elif total_score >= 60:
        status = "Needs Attention"
    elif total_score >= 40:
        status = "At Risk"
    else:
        status = "Critical"

    return HealthScoreResponse(
        event_id=event_id,
        score=total_score,
        status=status,
        breakdown={
            "registration": round(registration_score, 1),
            "venue": venue_score,
            "resources": resource_score,
            "vendors": vendor_score,
            "budget": budget_score,
            "schedule": schedule_score,
            "attendance": round(attendance_score, 1),
        },
        issues=issues,
    )