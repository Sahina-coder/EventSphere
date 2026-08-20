from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import event, venue, resource, booking, allocation, attendee

Base.metadata.create_all(bind=engine)

app = FastAPI(title="EventSphere API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(event.router)
app.include_router(venue.router)
app.include_router(resource.router)
app.include_router(booking.router)
app.include_router(allocation.router)
app.include_router(attendee.router)

@app.get("/")
def root():
    return {"message": "EventSphere API is running"}