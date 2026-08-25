from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NotificationCreate(BaseModel):
    event_id: Optional[int] = None
    recipient_type: str
    recipient_id: Optional[int] = None
    notification_type: str
    message: str
    sender: str

class NotificationResponse(BaseModel):
    id: int
    event_id: Optional[int] = None
    recipient_type: str
    recipient_id: Optional[int] = None
    notification_type: str
    message: str
    sender: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True