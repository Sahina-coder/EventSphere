from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.lost_found import LostFoundItem
from app.schemas.lost_found import LostFoundCreate, LostFoundResponse
from typing import List

router = APIRouter(prefix="/lost-found", tags=["Lost & Found"])

VALID_STATUSES = ["Reported", "Found", "Claimed", "Verified", "Returned", "Closed"]

@router.post("/", response_model=LostFoundResponse)
def report_item(item: LostFoundCreate, db: Session = Depends(get_db)):
    new_item = LostFoundItem(**item.dict(), status="Reported")
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.get("/", response_model=List[LostFoundResponse])
def get_items(db: Session = Depends(get_db)):
    return db.query(LostFoundItem).order_by(LostFoundItem.reported_at.desc()).all()

@router.put("/{item_id}/status", response_model=LostFoundResponse)
def update_status(item_id: int, status: str, db: Session = Depends(get_db)):
    if status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Status must be one of {VALID_STATUSES}")
    item = db.query(LostFoundItem).filter(LostFoundItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    item.status = status
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(LostFoundItem).filter(LostFoundItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"message": "Item removed"}