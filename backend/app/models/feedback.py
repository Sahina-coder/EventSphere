from sqlalchemy import Column, Integer, ForeignKey, String, DateTime
from app.database import Base
import datetime

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    attendee_id = Column(Integer, ForeignKey("attendees.id"), nullable=False)
    overall_rating = Column(Integer, nullable=False)
    venue_rating = Column(Integer, nullable=True)
    organization_rating = Column(Integer, nullable=True)
    speaker_rating = Column(Integer, nullable=True)
    catering_rating = Column(Integer, nullable=True)
    comments = Column(String, nullable=True)
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)