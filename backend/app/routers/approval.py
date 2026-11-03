from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.approval import ApprovalRequest
from app.schemas.approval import ApprovalCreate, ApprovalResponse
from app.auth_utils import get_current_user, require_role
from typing import List
import datetime

router = APIRouter(prefix="/approvals", tags=["Approval Workflow"])

@router.post("/", response_model=ApprovalResponse)
def create_request(
    request: ApprovalCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("Organizer")),
):
    new_request = ApprovalRequest(**request.dict(), status="Pending")
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request

@router.get("/", response_model=List[ApprovalResponse])
def get_requests(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return db.query(ApprovalRequest).order_by(ApprovalRequest.created_at.desc()).offset(skip).limit(limit).all()

@router.put("/{request_id}/decision", response_model=ApprovalResponse)
def make_decision(
    request_id: int,
    decision: str,
    reviewed_by: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("Organizer")),
):
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
def delete_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("Organizer")),
):
    req = db.query(ApprovalRequest).filter(ApprovalRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    db.delete(req)
    db.commit()
    return {"message": "Request removed"}