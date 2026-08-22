from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CertificateResponse(BaseModel):
    id: int
    certificate_code: str
    attendee_id: int
    event_id: int
    issue_date: datetime

    class Config:
        from_attributes = True

class CertificateVerifyResponse(BaseModel):
    valid: bool
    certificate_code: Optional[str] = None
    participant_name: Optional[str] = None
    event_name: Optional[str] = None
    event_date: Optional[datetime] = None
    issue_date: Optional[datetime] = None
    message: Optional[str] = None