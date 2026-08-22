from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from app.database import Base
import datetime

class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    certificate_code = Column(String, unique=True, nullable=False)
    attendee_id = Column(Integer, ForeignKey("attendees.id"), nullable=False, unique=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    issue_date = Column(DateTime, default=datetime.datetime.utcnow)