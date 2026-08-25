from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class IncidentCreate(BaseModel):
    event_id: int
    incident_type: str
    description: str
    location: Optional[str] = None
    reported_by: str
    priority: str
    assigned_staff: Optional[str] = None

class IncidentResponse(BaseModel):
    id: int
    event_id: int
    incident_type: str
    description: str
    location: Optional[str] = None
    reported_by: str
    priority: str
    assigned_staff: Optional[str] = None
    status: str
    reported_at: datetime

    class Config:
        from_attributes = True