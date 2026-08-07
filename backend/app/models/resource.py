from sqlalchemy import Column, Integer, String
from app.database import Base

class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    quantity_total = Column(Integer, nullable=False)
    quantity_available = Column(Integer, nullable=False)