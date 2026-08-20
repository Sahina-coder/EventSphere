from pydantic import BaseModel
from typing import Optional

class VendorAssignmentCreate(BaseModel):
    event_id: int
    vendor_id: int
    service: str
    status: Optional[str] = "Assigned"

class VendorAssignmentResponse(BaseModel):
    id: int
    event_id: int
    vendor_id: int
    service: str
    status: str

    class Config:
        from_attributes = True