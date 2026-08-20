from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class VendorAssignment(Base):
    __tablename__ = "vendor_assignments"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=False)
    service = Column(String, nullable=False)
    status = Column(String, default="Assigned")