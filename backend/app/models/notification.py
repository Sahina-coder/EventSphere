from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from app.database import Base
import datetime

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=True)
    recipient_type = Column(String, nullable=False)  # "All Participants", "Vendors", "Staff", etc.
    recipient_id = Column(Integer, nullable=True)  # specific attendee/vendor id if targeted
    notification_type = Column(String, nullable=False)  # Event Reminder, Venue Change, etc.
    message = Column(String, nullable=False)
    sender = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)