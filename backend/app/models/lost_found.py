from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from app.database import Base
import datetime

class LostFoundItem(Base):
    __tablename__ = "lost_found_items"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=True)
    report_type = Column(String, nullable=False)  # "Lost" or "Found"
    item_name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    location = Column(String, nullable=True)
    contact_info = Column(String, nullable=True)
    status = Column(String, default="Reported")
    reported_at = Column(DateTime, default=datetime.datetime.utcnow)