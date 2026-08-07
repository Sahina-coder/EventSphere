from pydantic import BaseModel
from typing import Optional

class VenueCreate(BaseModel):
    name: str
    location: str
    capacity: int
    is_available: Optional[str] = "Available"

class VenueResponse(BaseModel):
    id: int
    name: str
    location: str
    capacity: int
    is_available: str

    class Config:
        from_attributes = True