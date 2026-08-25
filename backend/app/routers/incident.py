from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.incident import Incident
from app.schemas.incident import IncidentCreate, IncidentResponse
from typing import List

router = APIRouter(prefix="/incidents", tags=["Incident Management"])

VALID_STATUSES = ["OPEN", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED"]

@router.post("/", response_model=IncidentResponse)
def report_incident(incident: IncidentCreate, db: Session = Depends(get_db)):
    new_incident = Incident(**incident.dict(), status="OPEN")
    db.add(new_incident)
    db.commit()
    db.refresh(new_incident)
    return new_incident

@router.get("/", response_model=List[IncidentResponse])
def get_incidents(db: Session = Depends(get_db)):
    return db.query(Incident).order_by(Incident.reported_at.desc()).all()

@router.put("/{incident_id}/status", response_model=IncidentResponse)
def update_status(incident_id: int, status: str, db: Session = Depends(get_db)):
    if status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Status must be one of {VALID_STATUSES}")
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    incident.status = status
    db.commit()
    db.refresh(incident)
    return incident

@router.put("/{incident_id}/assign", response_model=IncidentResponse)
def assign_staff(incident_id: int, staff_name: str, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    incident.assigned_staff = staff_name
    if incident.status == "OPEN":
        incident.status = "ASSIGNED"
    db.commit()
    db.refresh(incident)
    return incident

@router.delete("/{incident_id}")
def delete_incident(incident_id: int, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    db.delete(incident)
    db.commit()
    return {"message": "Incident removed"}