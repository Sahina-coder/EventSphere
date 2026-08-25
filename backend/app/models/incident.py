from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from app.database import Base
import datetime

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    incident_type = Column(String, nullable=False)
    description = Column(String, nullable=False)
    location = Column(String, nullable=True)
    reported_by = Column(String, nullable=False)
    priority = Column(String, nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    assigned_staff = Column(String, nullable=True)
    status = Column(String, default="OPEN")
    reported_at = Column(DateTime, default=datetime.datetime.utcnow)