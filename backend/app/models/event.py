from sqlalchemy import Column, Integer, String, DateTime, Float
from app.database import Base
import datetime

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    event_type = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)
    budget = Column(Float, nullable=True)
    status = Column(String, default="Planned")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)