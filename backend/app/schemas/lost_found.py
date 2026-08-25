from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class LostFoundCreate(BaseModel):
    event_id: Optional[int] = None
    report_type: str
    item_name: str
    description: Optional[str] = None
    location: Optional[str] = None
    contact_info: Optional[str] = None

class LostFoundResponse(BaseModel):
    id: int
    event_id: Optional[int] = None
    report_type: str
    item_name: str
    description: Optional[str] = None
    location: Optional[str] = None
    contact_info: Optional[str] = None
    status: str
    reported_at: datetime

    class Config:
        from_attributes = True