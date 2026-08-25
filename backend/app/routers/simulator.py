from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.event import Event
from app.models.attendee import Attendee
from app.models.booking import Booking
from app.models.venue import Venue
from app.models.allocation import Allocation
from app.models.resource import Resource
from app.models.expense import Expense
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/simulate", tags=["What-If Simulator"])

class ParticipantSimResult(BaseModel):
    current_participants: int
    simulated_participants: int
    current_venue_capacity: Optional[int] = None
    capacity_sufficient: Optional[bool] = None
    additional_chairs_needed: int
    estimated_additional_cost: float
    recommendation: str

class BudgetSimResult(BaseModel):
    current_budget: float
    simulated_budget: float
    current_expenses: float
    fits_new_budget: bool
    deficit: float
    top_expense_categories: List[dict]
    recommendation: str

@router.get("/event/{event_id}/participants", response_model=ParticipantSimResult)
def simulate_participants(
    event_id: int,
    simulated_participants: int = Query(...),
    db: Session = Depends(get_db),
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    current_participants = db.query(Attendee).filter(Attendee.event_id == event_id).count()

    booking = db.query(Booking).filter(Booking.event_id == event_id).first()
    venue = db.query(Venue).filter(Venue.id == booking.venue_id).first() if booking else None
    venue_capacity = venue.capacity if venue else None
    capacity_sufficient = (simulated_participants <= venue_capacity) if venue_capacity is not None else None

    additional_participants = max(0, simulated_participants - current_participants)
    additional_chairs = additional_participants
    # Rough cost estimate: ₹50 per additional chair/setup, ₹150 per additional catering unit
    estimated_cost = additional_participants * 50 + additional_participants * 150

    if capacity_sufficient is False:
        recommendation = f"Venue capacity ({venue_capacity}) is insufficient for {simulated_participants} participants. Select a larger venue."
    elif capacity_sufficient is None:
        recommendation = "No venue booked yet — book a venue with sufficient capacity before finalizing this participant count."
    else:
        recommendation = f"Venue capacity is sufficient. Budget approximately ₹{estimated_cost:,.0f} additional for {additional_participants} more participants."

    return ParticipantSimResult(
        current_participants=current_participants,
        simulated_participants=simulated_participants,
        current_venue_capacity=venue_capacity,
        capacity_sufficient=capacity_sufficient,
        additional_chairs_needed=additional_chairs,
        estimated_additional_cost=estimated_cost,
        recommendation=recommendation,
    )

@router.get("/event/{event_id}/budget", response_model=BudgetSimResult)
def simulate_budget(
    event_id: int,
    budget_change: float = Query(..., description="Positive to increase, negative to decrease"),
    db: Session = Depends(get_db),
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    current_budget = event.budget or 0
    simulated_budget = current_budget + budget_change

    expenses = db.query(Expense).filter(Expense.event_id == event_id).all()
    current_expenses = sum(e.amount for e in expenses)

    fits = current_expenses <= simulated_budget
    deficit = max(0, current_expenses - simulated_budget)

    by_category: dict = {}
    for e in expenses:
        by_category[e.category] = by_category.get(e.category, 0) + e.amount
    top_categories = sorted(
        [{"category": k, "amount": v} for k, v in by_category.items()],
        key=lambda x: x["amount"], reverse=True
    )[:3]

    if fits:
        recommendation = f"Current expenses (₹{current_expenses:,.0f}) fit within the simulated budget of ₹{simulated_budget:,.0f}."
    else:
        top_cat = top_categories[0]["category"] if top_categories else "your largest category"
        recommendation = f"Expenses exceed the simulated budget by ₹{deficit:,.0f}. Consider reducing spend in {top_cat}."

    return BudgetSimResult(
        current_budget=current_budget,
        simulated_budget=simulated_budget,
        current_expenses=current_expenses,
        fits_new_budget=fits,
        deficit=deficit,
        top_expense_categories=top_categories,
        recommendation=recommendation,
    )