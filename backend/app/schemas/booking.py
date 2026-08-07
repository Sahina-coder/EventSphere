from pydantic import BaseModel
from datetime import datetime

class BookingCreate(BaseModel):
    event_id: int
    venue_id: int
    start_time: datetime
    end_time: datetime

class BookingResponse(BaseModel):
    id: int
    event_id: int
    venue_id: int
    start_time: datetime
    end_time: datetime

    class Config:
        from_attributes = True