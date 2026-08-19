from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.allocation import Allocation
from app.models.resource import Resource
from app.schemas.allocation import AllocationCreate, AllocationResponse
from typing import List

router = APIRouter(prefix="/allocations", tags=["Allocations"])

@router.post("/", response_model=AllocationResponse)
def create_allocation(allocation: AllocationCreate, db: Session = Depends(get_db)):
    resource = db.query(Resource).filter(Resource.id == allocation.resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    if allocation.quantity > resource.quantity_available:
        raise HTTPException(
            status_code=409,
            detail=f"Only {resource.quantity_available} '{resource.name}' available, requested {allocation.quantity}"
        )

    resource.quantity_available -= allocation.quantity
    new_allocation = Allocation(**allocation.dict())
    db.add(new_allocation)
    db.commit()
    db.refresh(new_allocation)
    return new_allocation

@router.get("/", response_model=List[AllocationResponse])
def get_allocations(db: Session = Depends(get_db)):
    return db.query(Allocation).all()

@router.delete("/{allocation_id}")
def delete_allocation(allocation_id: int, db: Session = Depends(get_db)):
    allocation = db.query(Allocation).filter(Allocation.id == allocation_id).first()
    if not allocation:
        raise HTTPException(status_code=404, detail="Allocation not found")

    resource = db.query(Resource).filter(Resource.id == allocation.resource_id).first()
    if resource:
        resource.quantity_available += allocation.quantity

    db.delete(allocation)
    db.commit()
    return {"message": "Allocation removed and resource returned to inventory"}