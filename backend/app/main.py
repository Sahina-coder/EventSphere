from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import event, venue, resource, booking, allocation, attendee, ticket, vendor, vendor_assignment, expense, health_score, risk, feedback, certificate, recommendations, notification, venue_map, lost_found, simulator, incident, sponsor, approval, forecast, report_export

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
app.include_router(ticket.router)
app.include_router(vendor.router)
app.include_router(vendor_assignment.router)
app.include_router(expense.router)
app.include_router(health_score.router)
app.include_router(risk.router)
app.include_router(feedback.router)
app.include_router(certificate.router)
app.include_router(recommendations.router)
app.include_router(notification.router)
app.include_router(venue_map.router)
app.include_router(lost_found.router)
app.include_router(simulator.router)
app.include_router(incident.router)
app.include_router(sponsor.router)
app.include_router(approval.router)
app.include_router(forecast.router)
app.include_router(report_export.router)

@app.get("/")
def root():
    return {"message": "EventSphere API is running"}