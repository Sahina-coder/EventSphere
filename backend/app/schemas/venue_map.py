from pydantic import BaseModel, Field

class VenueMapPointCreate(BaseModel):
    venue_id: int
    label: str
    point_type: str
    x: float = Field(ge=0, le=100)
    y: float = Field(ge=0, le=100)

class VenueMapPointResponse(BaseModel):
    id: int
    venue_id: int
    label: str
    point_type: str
    x: float
    y: float

    class Config:
        from_attributes = True