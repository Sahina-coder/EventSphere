from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.expense import Expense
from app.models.event import Event
from app.schemas.expense import ExpenseCreate, ExpenseResponse, BudgetSummary
from typing import List

router = APIRouter(prefix="/expenses", tags=["Expenses"])

@router.post("/", response_model=ExpenseResponse)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == expense.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    new_expense = Expense(**expense.dict())
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense

@router.get("/", response_model=List[ExpenseResponse])
def get_expenses(db: Session = Depends(get_db)):
    return db.query(Expense).all()

@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(expense_id: int, updated: ExpenseCreate, db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    for key, value in updated.dict().items():
        setattr(expense, key, value)
    db.commit()
    db.refresh(expense)
    return expense

@router.delete("/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    db.delete(expense)
    db.commit()
    return {"message": "Expense deleted successfully"}

@router.get("/event/{event_id}/summary", response_model=BudgetSummary)
def get_budget_summary(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    expenses = db.query(Expense).filter(Expense.event_id == event_id).all()
    total_budget = event.budget or 0
    total_expenses = sum(e.amount for e in expenses)
    remaining = total_budget - total_expenses
    utilization = (total_expenses / total_budget * 100) if total_budget > 0 else 0

    warning = None
    if utilization >= 100:
        warning = f"Budget Alert: Budget exceeded! {round(utilization)}% of allocated budget used."
    elif utilization >= 90:
        warning = f"Budget Alert: {round(utilization)}% of the allocated budget has been used."
    elif utilization >= 80:
        warning = f"Budget Alert: {round(utilization)}% of the allocated budget has been used."

    by_category = {}
    for e in expenses:
        by_category[e.category] = by_category.get(e.category, 0) + e.amount

    return BudgetSummary(
        event_id=event_id,
        total_budget=total_budget,
        total_expenses=total_expenses,
        remaining_budget=remaining,
        utilization_percent=round(utilization, 1),
        warning=warning,
        expenses_by_category=by_category,
        expenses=expenses,
    )