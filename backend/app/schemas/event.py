from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class EventCreate(BaseModel):
    name: str
    event_type: str
    date: datetime
    budget: Optional[float] = None
    status: Optional[str] = "Planned"

class EventResponse(BaseModel):
    id: int
    name: str
    event_type: str
    date: datetime
    budget: Optional[float] = None
    status: str

    class Config:
        from_attributes = True