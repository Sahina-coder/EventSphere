from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.vendor_assignment import VendorAssignment
from app.models.vendor import Vendor
from app.schemas.vendor_assignment import VendorAssignmentCreate, VendorAssignmentResponse
from app.auth_utils import get_current_user, require_role
from typing import List

router = APIRouter(prefix="/vendor-assignments", tags=["Vendor Assignments"])

@router.post("/", response_model=VendorAssignmentResponse)
def assign_vendor(
    assignment: VendorAssignmentCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("Organizer")),
):
    vendor = db.query(Vendor).filter(Vendor.id == assignment.vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")

    if vendor.availability != "Available":
        raise HTTPException(status_code=409, detail=f"Vendor {vendor.name} is not available")

    new_assignment = VendorAssignment(**assignment.dict())
    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)
    return new_assignment

@router.get("/", response_model=List[VendorAssignmentResponse])
def get_assignments(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return db.query(VendorAssignment).offset(skip).limit(limit).all()

@router.delete("/{assignment_id}")
def delete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("Organizer")),
):
    assignment = db.query(VendorAssignment).filter(VendorAssignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    db.delete(assignment)
    db.commit()
    return {"message": "Vendor assignment removed"}