from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # Organizer, Attendee, Vendor
    created_at = Column(DateTime, default=datetime.datetime.utcnow)