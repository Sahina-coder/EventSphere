from pydantic import BaseModel

class ResourceCreate(BaseModel):
    name: str
    category: str
    quantity_total: int
    quantity_available: int

class ResourceResponse(BaseModel):
    id: int
    name: str
    category: str
    quantity_total: int
    quantity_available: int

    class Config:
        from_attributes = True