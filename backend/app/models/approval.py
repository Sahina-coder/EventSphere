from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from app.database import Base
import datetime

class ApprovalRequest(Base):
    __tablename__ = "approval_requests"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    request_type = Column(String, nullable=False)  # e.g. "Vendor Payment", "Budget Increase", "Resource Purchase"
    requested_by = Column(String, nullable=False)
    description = Column(String, nullable=False)
    amount = Column(Float, nullable=True)
    status = Column(String, default="Pending")  # Pending, Approved, Rejected
    reviewed_by = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)