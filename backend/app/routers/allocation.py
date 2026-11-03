from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.allocation import Allocation
from app.models.resource import Resource
from app.schemas.allocation import AllocationCreate, AllocationResponse
from app.auth_utils import get_current_user, require_role
from typing import List

router = APIRouter(prefix="/allocations", tags=["Allocations"])

@router.post("/", response_model=AllocationResponse)
def create_allocation(
    allocation: AllocationCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("Organizer")),
):
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
def get_allocations(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return db.query(Allocation).offset(skip).limit(limit).all()

@router.delete("/{allocation_id}")
def delete_allocation(
    allocation_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("Organizer")),
):
    allocation = db.query(Allocation).filter(Allocation.id == allocation_id).first()
    if not allocation:
        raise HTTPException(status_code=404, detail="Allocation not found")

    resource = db.query(Resource).filter(Resource.id == allocation.resource_id).first()
    if resource:
        resource.quantity_available += allocation.quantity

    db.delete(allocation)
    db.commit()
    return {"message": "Allocation removed and resource returned to inventory"}