from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.sponsor import Sponsor
from app.models.event import Event
from app.models.expense import Expense
from app.schemas.sponsor import SponsorCreate, SponsorResponse, FinancialSummary
from typing import List

router = APIRouter(prefix="/sponsors", tags=["Sponsorship"])

@router.post("/", response_model=SponsorResponse)
def add_sponsor(sponsor: SponsorCreate, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == sponsor.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    new_sponsor = Sponsor(**sponsor.dict())
    db.add(new_sponsor)
    db.commit()
    db.refresh(new_sponsor)
    return new_sponsor

@router.get("/", response_model=List[SponsorResponse])
def get_sponsors(db: Session = Depends(get_db)):
    return db.query(Sponsor).all()

@router.delete("/{sponsor_id}")
def delete_sponsor(sponsor_id: int, db: Session = Depends(get_db)):
    sponsor = db.query(Sponsor).filter(Sponsor.id == sponsor_id).first()
    if not sponsor:
        raise HTTPException(status_code=404, detail="Sponsor not found")
    db.delete(sponsor)
    db.commit()
    return {"message": "Sponsor removed"}

@router.get("/event/{event_id}/financial-summary", response_model=FinancialSummary)
def get_financial_summary(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    sponsors = db.query(Sponsor).filter(Sponsor.event_id == event_id).all()
    expenses = db.query(Expense).filter(Expense.event_id == event_id).all()

    total_budget = event.budget or 0
    total_sponsorship = sum(s.amount for s in sponsors)
    total_expenses = sum(e.amount for e in expenses)
    net_balance = (total_budget + total_sponsorship) - total_expenses

    return FinancialSummary(
        event_id=event_id,
        total_budget=total_budget,
        total_sponsorship=total_sponsorship,
        total_expenses=total_expenses,
        net_balance=net_balance,
        sponsors=sponsors,
    )