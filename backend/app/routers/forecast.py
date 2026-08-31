from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.event import Event
from app.models.attendee import Attendee
from app.models.resource import Resource
from app.models.allocation import Allocation
from app.models.expense import Expense
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/forecast", tags=["Forecasting"])

class AttendanceForecast(BaseModel):
    based_on_events: int
    historical_average: float
    forecast: int
    note: str

class ResourceForecastItem(BaseModel):
    resource_name: str
    average_allocated: float
    forecast_needed: int

class ResourceForecast(BaseModel):
    based_on_events: int
    items: List[ResourceForecastItem]

class BudgetForecast(BaseModel):
    based_on_events: int
    historical_average_expense: float
    forecast: float
    note: str

@router.get("/attendance", response_model=AttendanceForecast)
def forecast_attendance(db: Session = Depends(get_db)):
    events = db.query(Event).all()
    counts = []
    for e in events:
        c = db.query(Attendee).filter(Attendee.event_id == e.id).count()
        if c > 0:
            counts.append(c)

    if not counts:
        return AttendanceForecast(
            based_on_events=0,
            historical_average=0,
            forecast=0,
            note="Not enough historical data yet. Forecast will improve as more events are completed.",
        )

    avg = sum(counts) / len(counts)
    return AttendanceForecast(
        based_on_events=len(counts),
        historical_average=round(avg, 1),
        forecast=round(avg),
        note=f"Based on the average of {len(counts)} past event(s) with registrations.",
    )

@router.get("/resources", response_model=ResourceForecast)
def forecast_resources(db: Session = Depends(get_db)):
    events = db.query(Event).all()
    resources = db.query(Resource).all()

    items = []
    for r in resources:
        totals = []
        for e in events:
            allocs = db.query(Allocation).filter(Allocation.event_id == e.id, Allocation.resource_id == r.id).all()
            qty = sum(a.quantity for a in allocs)
            if qty > 0:
                totals.append(qty)
        if totals:
            avg = sum(totals) / len(totals)
            items.append(ResourceForecastItem(
                resource_name=r.name,
                average_allocated=round(avg, 1),
                forecast_needed=round(avg),
            ))

    return ResourceForecast(based_on_events=len(events), items=items)

@router.get("/budget", response_model=BudgetForecast)
def forecast_budget(db: Session = Depends(get_db)):
    events = db.query(Event).all()
    totals = []
    for e in events:
        expenses = db.query(Expense).filter(Expense.event_id == e.id).all()
        total = sum(x.amount for x in expenses)
        if total > 0:
            totals.append(total)

    if not totals:
        return BudgetForecast(
            based_on_events=0,
            historical_average_expense=0,
            forecast=0,
            note="Not enough historical expense data yet.",
        )

    avg = sum(totals) / len(totals)
    return BudgetForecast(
        based_on_events=len(totals),
        historical_average_expense=round(avg, 2),
        forecast=round(avg, 2),
        note=f"Based on the average final expenses of {len(totals)} past event(s).",
    )