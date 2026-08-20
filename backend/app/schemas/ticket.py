from pydantic import BaseModel
from datetime import datetime

class TicketResponse(BaseModel):
    id: int
    ticket_code: str
    attendee_id: int
    event_id: int
    issue_date: datetime

    class Config:
        from_attributes = True