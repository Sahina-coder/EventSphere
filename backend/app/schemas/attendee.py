from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from typing import Optional

class AttendeeCreate(BaseModel):
    event_id: int
    name: str
    email: EmailStr
    phone: str
    college: Optional[str] = None
    department: Optional[str] = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v):
        digits = v.strip()
        if not digits.isdigit() or len(digits) != 10:
            raise ValueError("Phone number must be exactly 10 digits")
        return digits

class AttendeeResponse(BaseModel):
    id: int
    event_id: int
    name: str
    email: str
    phone: str
    college: Optional[str] = None
    department: Optional[str] = None
    attendance_status: str
    registered_at: datetime

    class Config:
        from_attributes = True