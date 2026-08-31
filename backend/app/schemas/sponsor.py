from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class SponsorCreate(BaseModel):
    event_id: int
    name: str
    contact_email: Optional[str] = None
    amount: float
    sponsorship_type: Optional[str] = "Cash"

class SponsorResponse(BaseModel):
    id: int
    event_id: int
    name: str
    contact_email: Optional[str] = None
    amount: float
    sponsorship_type: Optional[str] = None
    received_at: datetime

    class Config:
        from_attributes = True

class FinancialSummary(BaseModel):
    event_id: int
    total_budget: float
    total_sponsorship: float
    total_expenses: float
    net_balance: float
    sponsors: List[SponsorResponse]