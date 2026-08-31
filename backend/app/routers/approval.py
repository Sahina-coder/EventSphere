from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.approval import ApprovalRequest
from app.schemas.approval import ApprovalCreate, ApprovalResponse
from typing import List
import datetime

router = APIRouter(prefix="/approvals", tags=["Approval Workflow"])

@router.post("/", response_model=ApprovalResponse)
def create_request(request: ApprovalCreate, db: Session = Depends(get_db)):
    new_request = ApprovalRequest(**request.dict(), status="Pending")
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request

@router.get("/", response_model=List[ApprovalResponse])
def get_requests(db: Session = Depends(get_db)):
    return db.query(ApprovalRequest).order_by(ApprovalRequest.created_at.desc()).all()

@router.put("/{request_id}/decision", response_model=ApprovalResponse)
def make_decision(request_id: int, decision: str, reviewed_by: str, db: Session = Depends(get_db)):
    if decision not in ["Approved", "Rejected"]:
        raise HTTPException(status_code=400, detail="Decision must be 'Approved' or 'Rejected'")
    req = db.query(ApprovalRequest).filter(ApprovalRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != "Pending":
        raise HTTPException(status_code=409, detail="Request has already been reviewed")
    req.status = decision
    req.reviewed_by = reviewed_by
    req.reviewed_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(req)
    return req

@router.delete("/{request_id}")
def delete_request(request_id: int, db: Session = Depends(get_db)):
    req = db.query(ApprovalRequest).filter(ApprovalRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    db.delete(req)
    db.commit()
    return {"message": "Request removed"}