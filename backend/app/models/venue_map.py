from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.database import Base

class VenueMapPoint(Base):
    __tablename__ = "venue_map_points"

    id = Column(Integer, primary_key=True, index=True)
    venue_id = Column(Integer, ForeignKey("venues.id"), nullable=False)
    label = Column(String, nullable=False)
    point_type = Column(String, nullable=False)  # Entrance, Registration Desk, Hall, Food Area, Parking, Restroom, Help Desk, Emergency Exit
    x = Column(Float, nullable=False)  # percentage 0-100
    y = Column(Float, nullable=False)  # percentage 0-100