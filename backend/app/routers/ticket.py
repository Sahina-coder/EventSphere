from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.ticket import Ticket
from app.models.attendee import Attendee
from app.models.event import Event
from app.schemas.ticket import TicketResponse
from app.auth_utils import get_current_user, require_role
from typing import List
import qrcode
import io
import json
import uuid

router = APIRouter(prefix="/tickets", tags=["Tickets"])

@router.post("/generate/{attendee_id}", response_model=TicketResponse)
def generate_ticket(
    attendee_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("Organizer")),
):
    attendee = db.query(Attendee).filter(Attendee.id == attendee_id).first()
    if not attendee:
        raise HTTPException(status_code=404, detail="Attendee not found")

    existing = db.query(Ticket).filter(Ticket.attendee_id == attendee_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Ticket already generated for this attendee")

    ticket_code = f"TKT-{uuid.uuid4().hex[:10].upper()}"

    new_ticket = Ticket(
        ticket_code=ticket_code,
        attendee_id=attendee_id,
        event_id=attendee.event_id,
    )
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    return new_ticket

@router.get("/", response_model=List[TicketResponse])
def get_tickets(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return db.query(Ticket).offset(skip).limit(limit).all()

@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

@router.get("/{ticket_id}/qrcode")
def get_ticket_qrcode(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    attendee = db.query(Attendee).filter(Attendee.id == ticket.attendee_id).first()
    event = db.query(Event).filter(Event.id == ticket.event_id).first()

    qr_data = {
        "ticket_id": ticket.ticket_code,
        "attendee_name": attendee.name if attendee else None,
        "attendee_email": attendee.email if attendee else None,
        "event_name": event.name if event else None,
    }

    qr = qrcode.make(json.dumps(qr_data))
    buffer = io.BytesIO()
    qr.save(buffer, format="PNG")
    buffer.seek(0)

    return StreamingResponse(buffer, media_type="image/png")