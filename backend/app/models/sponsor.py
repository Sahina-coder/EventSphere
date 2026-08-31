from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from app.database import Base
import datetime

class Sponsor(Base):
    __tablename__ = "sponsors"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    name = Column(String, nullable=False)
    contact_email = Column(String, nullable=True)
    amount = Column(Float, nullable=False)
    sponsorship_type = Column(String, nullable=True)  # e.g. Cash, In-Kind, Media
    received_at = Column(DateTime, default=datetime.datetime.utcnow)