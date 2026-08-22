from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.event import Event
from app.models.attendee import Attendee
from app.models.booking import Booking
from app.models.venue import Venue
from app.models.allocation import Allocation
from app.models.resource import Resource
from app.models.vendor_assignment import VendorAssignment
from app.models.vendor import Vendor
from app.models.expense import Expense
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/risks", tags=["Risk Detection"])

class Risk(BaseModel):
    risk_type: str
    description: str
    severity: str
    suggested_action: Optional[str] = None

class RiskResponse(BaseModel):
    event_id: int
    risks: List[Risk]

@router.get("/event/{event_id}", response_model=RiskResponse)
def get_event_risks(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    risks: List[Risk] = []

    # Venue risks
    booking = db.query(Booking).filter(Booking.event_id == event_id).first()
    if not booking:
        risks.append(Risk(
            risk_type="Venue",
            description="No venue has been booked for this event",
            severity="HIGH",
            suggested_action="Book a venue as soon as possible",
        ))
    else:
        venue = db.query(Venue).filter(Venue.id == booking.venue_id).first()
        attendee_count = db.query(Attendee).filter(Attendee.event_id == event_id).count()
        if venue and attendee_count > venue.capacity:
            risks.append(Risk(
                risk_type="Venue",
                description=f"Registrations ({attendee_count}) exceed venue capacity ({venue.capacity})",
                severity="CRITICAL",
                suggested_action="Select a larger venue or cap registrations",
            ))

    # Resource risks
    allocations = db.query(Allocation).filter(Allocation.event_id == event_id).all()
    if not allocations:
        risks.append(Risk(
            risk_type="Resource",
            description="No resources have been allocated to this event",
            severity="MEDIUM",
            suggested_action="Allocate required resources",
        ))
    for alloc in allocations:
        resource = db.query(Resource).filter(Resource.id == alloc.resource_id).first()
        if resource and resource.quantity_available < 0:
            risks.append(Risk(
                risk_type="Resource",
                description=f"{resource.name} is over-allocated",
                severity="HIGH",
                suggested_action="Reduce allocation or source more units",
            ))

    # Vendor risks
    assignments = db.query(VendorAssignment).filter(VendorAssignment.event_id == event_id).all()
    if not assignments:
        risks.append(Risk(
            risk_type="Vendor",
            description="No vendors assigned to this event",
            severity="MEDIUM",
            suggested_action="Assign vendors for required services",
        ))
    for a in assignments:
        if a.status != "Confirmed":
            vendor = db.query(Vendor).filter(Vendor.id == a.vendor_id).first()
            vname = vendor.name if vendor else f"Vendor #{a.vendor_id}"
            risks.append(Risk(
                risk_type="Vendor",
                description=f"{vname} ({a.service}) has not confirmed service",
                severity="HIGH",
                suggested_action="Contact vendor or select a backup vendor",
            ))

    # Financial risks
    expenses = db.query(Expense).filter(Expense.event_id == event_id).all()
    total_expenses = sum(e.amount for e in expenses)
    total_budget = event.budget or 0
    if total_budget > 0:
        utilization = (total_expenses / total_budget) * 100
        if utilization >= 100:
            risks.append(Risk(
                risk_type="Financial",
                description=f"Budget exceeded ({round(utilization)}% used)",
                severity="CRITICAL",
                suggested_action="Review and cut non-essential expenses",
            ))
        elif utilization >= 90:
            risks.append(Risk(
                risk_type="Financial",
                description=f"Budget utilization at {round(utilization)}%",
                severity="HIGH",
                suggested_action="Monitor remaining spend closely",
            ))
        elif utilization >= 80:
            risks.append(Risk(
                risk_type="Financial",
                description=f"Budget utilization at {round(utilization)}%",
                severity="MEDIUM",
                suggested_action="Plan remaining expenses carefully",
            ))

    # Registration risks
    attendee_count = db.query(Attendee).filter(Attendee.event_id == event_id).count()
    if attendee_count == 0:
        risks.append(Risk(
            risk_type="Registration",
            description="No participants have registered yet",
            severity="MEDIUM",
            suggested_action="Promote registration for the event",
        ))
    cancelled_count = db.query(Attendee).filter(
        Attendee.event_id == event_id, Attendee.attendance_status == "Cancelled"
    ).count()
    if attendee_count > 0 and (cancelled_count / attendee_count) > 0.2:
        risks.append(Risk(
            risk_type="Registration",
            description=f"High cancellation rate ({round((cancelled_count / attendee_count) * 100)}%)",
            severity="MEDIUM",
            suggested_action="Investigate reasons for cancellations",
        ))

    # Attendance risks (only meaningful for completed events)
    if event.status == "Completed" and attendee_count > 0:
        checked_in = db.query(Attendee).filter(
            Attendee.event_id == event_id, Attendee.attendance_status == "Checked In"
        ).count()
        attendance_pct = (checked_in / attendee_count) * 100
        if attendance_pct < 50:
            risks.append(Risk(
                risk_type="Attendance",
                description=f"Low attendance turnout ({round(attendance_pct)}%)",
                severity="MEDIUM",
                suggested_action="Review event communication and reminders for future events",
            ))

    return RiskResponse(event_id=event_id, risks=risks)