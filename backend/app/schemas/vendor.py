from pydantic import BaseModel, EmailStr
from typing import Optional

class VendorCreate(BaseModel):
    name: str
    service_type: str
    phone: str
    email: EmailStr
    availability: Optional[str] = "Available"

class VendorResponse(BaseModel):
    id: int
    name: str
    service_type: str
    phone: str
    email: str
    availability: str

    class Config:
        from_attributes = True