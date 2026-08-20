from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from app.database import Base
import datetime

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    ticket_code = Column(String, unique=True, nullable=False)
    attendee_id = Column(Integer, ForeignKey("attendees.id"), nullable=False, unique=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    issue_date = Column(DateTime, default=datetime.datetime.utcnow)