from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from app.database import Base
import datetime

class Attendee(Base):
    __tablename__ = "attendees"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    college = Column(String, nullable=True)
    department = Column(String, nullable=True)
    attendance_status = Column(String, default="Registered")
    registered_at = Column(DateTime, default=datetime.datetime.utcnow)