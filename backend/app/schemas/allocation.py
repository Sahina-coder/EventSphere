from pydantic import BaseModel

class AllocationCreate(BaseModel):
    event_id: int
    resource_id: int
    quantity: int

class AllocationResponse(BaseModel):
    id: int
    event_id: int
    resource_id: int
    quantity: int

    class Config:
        from_attributes = True