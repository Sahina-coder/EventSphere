from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class ExpenseCreate(BaseModel):
    event_id: int
    category: str
    description: Optional[str] = None
    amount: float

class ExpenseResponse(BaseModel):
    id: int
    event_id: int
    category: str
    description: Optional[str] = None
    amount: float
    created_at: datetime

    class Config:
        from_attributes = True

class BudgetSummary(BaseModel):
    event_id: int
    total_budget: float
    total_expenses: float
    remaining_budget: float
    utilization_percent: float
    warning: Optional[str] = None
    expenses_by_category: dict
    expenses: List[ExpenseResponse]