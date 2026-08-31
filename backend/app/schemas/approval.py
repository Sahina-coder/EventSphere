from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ApprovalCreate(BaseModel):
    event_id: int
    request_type: str
    requested_by: str
    description: str
    amount: Optional[float] = None

class ApprovalResponse(BaseModel):
    id: int
    event_id: int
    request_type: str
    requested_by: str
    description: str
    amount: Optional[float] = None
    status: str
    reviewed_by: Optional[str] = None
    created_at: datetime
    reviewed_at: Optional[datetime] = None

    class Config:
        from_attributes = True