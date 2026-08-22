from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class FeedbackCreate(BaseModel):
    event_id: int
    attendee_id: int
    overall_rating: int = Field(ge=1, le=5)
    venue_rating: Optional[int] = Field(default=None, ge=1, le=5)
    organization_rating: Optional[int] = Field(default=None, ge=1, le=5)
    speaker_rating: Optional[int] = Field(default=None, ge=1, le=5)
    catering_rating: Optional[int] = Field(default=None, ge=1, le=5)
    comments: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: int
    event_id: int
    attendee_id: int
    overall_rating: int
    venue_rating: Optional[int] = None
    organization_rating: Optional[int] = None
    speaker_rating: Optional[int] = None
    catering_rating: Optional[int] = None
    comments: Optional[str] = None
    submitted_at: datetime

    class Config:
        from_attributes = True

class FeedbackSummary(BaseModel):
    event_id: int
    total_submissions: int
    avg_overall: float
    avg_venue: float
    avg_organization: float
    avg_speaker: float
    avg_catering: float