from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from app.database import Base
import datetime

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    category = Column(String, nullable=False)
    description = Column(String, nullable=True)
    amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)