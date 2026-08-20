from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.vendor import Vendor
from app.schemas.vendor import VendorCreate, VendorResponse
from typing import List

router = APIRouter(prefix="/vendors", tags=["Vendors"])

@router.post("/", response_model=VendorResponse)
def create_vendor(vendor: VendorCreate, db: Session = Depends(get_db)):
    new_vendor = Vendor(**vendor.dict())
    db.add(new_vendor)
    db.commit()
    db.refresh(new_vendor)
    return new_vendor

@router.get("/", response_model=List[VendorResponse])
def get_vendors(db: Session = Depends(get_db)):
    return db.query(Vendor).all()

@router.get("/{vendor_id}", response_model=VendorResponse)
def get_vendor(vendor_id: int, db: Session = Depends(get_db)):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor

@router.put("/{vendor_id}", response_model=VendorResponse)
def update_vendor(vendor_id: int, updated: VendorCreate, db: Session = Depends(get_db)):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    for key, value in updated.dict().items():
        setattr(vendor, key, value)
    db.commit()
    db.refresh(vendor)
    return vendor

@router.delete("/{vendor_id}")
def delete_vendor(vendor_id: int, db: Session = Depends(get_db)):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    db.delete(vendor)
    db.commit()
    return {"message": "Vendor deleted successfully"}