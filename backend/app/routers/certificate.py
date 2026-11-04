from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.certificate import Certificate
from app.models.attendee import Attendee
from app.models.event import Event
from app.schemas.certificate import CertificateResponse, CertificateVerifyResponse
from app.auth_utils import get_current_user, require_role
from typing import List
import datetime
import uuid

router = APIRouter(prefix="/certificates", tags=["Certificates"])

@router.post("/generate/{attendee_id}", response_model=CertificateResponse)
def generate_certificate(
    attendee_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("Organizer")),
):
    attendee = db.query(Attendee).filter(Attendee.id == attendee_id).first()
    if not attendee:
        raise HTTPException(status_code=404, detail="Attendee not found")

    if attendee.attendance_status != "Checked In":
        raise HTTPException(
            status_code=403,
            detail="Only attendees who checked in are eligible for a certificate"
        )

    existing = db.query(Certificate).filter(Certificate.attendee_id == attendee_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Certificate already generated for this attendee")

    year = datetime.datetime.utcnow().year
    unique_id = uuid.uuid4().hex[:8].upper()
    cert_code = f"CERT-{year}-{unique_id}"

    new_cert = Certificate(
        certificate_code=cert_code,
        attendee_id=attendee_id,
        event_id=attendee.event_id,
    )
    db.add(new_cert)
    db.commit()
    db.refresh(new_cert)
    return new_cert

@router.get("/", response_model=List[CertificateResponse])
def get_certificates(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return db.query(Certificate).offset(skip).limit(limit).all()

@router.get("/verify/{certificate_code}", response_model=CertificateVerifyResponse)
def verify_certificate(
    certificate_code: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    cert = db.query(Certificate).filter(Certificate.certificate_code == certificate_code).first()
    if not cert:
        return CertificateVerifyResponse(valid=False, message="Certificate not found / Invalid certificate.")

    attendee = db.query(Attendee).filter(Attendee.id == cert.attendee_id).first()
    event = db.query(Event).filter(Event.id == cert.event_id).first()

    return CertificateVerifyResponse(
        valid=True,
        certificate_code=cert.certificate_code,
        participant_name=attendee.name if attendee else None,
        event_name=event.name if event else None,
        event_date=event.date if event else None,
        issue_date=cert.issue_date,
    )