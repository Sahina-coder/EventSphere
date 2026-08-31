from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.event import Event
from app.models.attendee import Attendee
from app.models.expense import Expense
from app.models.vendor_assignment import VendorAssignment
from app.models.vendor import Vendor
from app.models.booking import Booking
from app.models.venue import Venue
import csv
import io
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

router = APIRouter(prefix="/reports", tags=["Reports & Export"])

def gather_event_data(event_id: int, db: Session):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    attendees = db.query(Attendee).filter(Attendee.event_id == event_id).all()
    expenses = db.query(Expense).filter(Expense.event_id == event_id).all()
    assignments = db.query(VendorAssignment).filter(VendorAssignment.event_id == event_id).all()
    booking = db.query(Booking).filter(Booking.event_id == event_id).first()
    venue = db.query(Venue).filter(Venue.id == booking.venue_id).first() if booking else None

    total_expenses = sum(e.amount for e in expenses)
    checked_in = len([a for a in attendees if a.attendance_status == "Checked In"])
    attendance_rate = round((checked_in / len(attendees)) * 100, 1) if attendees else 0

    vendor_names = []
    for a in assignments:
        v = db.query(Vendor).filter(Vendor.id == a.vendor_id).first()
        if v:
            vendor_names.append(f"{v.name} ({a.service}) - {a.status}")

    return {
        "event": event,
        "venue": venue,
        "attendees": attendees,
        "expenses": expenses,
        "total_expenses": total_expenses,
        "checked_in": checked_in,
        "attendance_rate": attendance_rate,
        "vendor_names": vendor_names,
    }

@router.get("/event/{event_id}/csv")
def export_event_csv(event_id: int, db: Session = Depends(get_db)):
    data = gather_event_data(event_id, db)
    event = data["event"]

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(["EVENT SUMMARY REPORT"])
    writer.writerow([])
    writer.writerow(["Event Name", event.name])
    writer.writerow(["Type", event.event_type])
    writer.writerow(["Date", str(event.date)])
    writer.writerow(["Status", event.status])
    writer.writerow(["Venue", data["venue"].name if data["venue"] else "Not booked"])
    writer.writerow(["Budget", event.budget or 0])
    writer.writerow(["Total Expenses", data["total_expenses"]])
    writer.writerow(["Remaining Budget", (event.budget or 0) - data["total_expenses"]])
    writer.writerow([])

    writer.writerow(["REGISTRATIONS"])
    writer.writerow(["Total Registered", len(data["attendees"])])
    writer.writerow(["Checked In", data["checked_in"]])
    writer.writerow(["Attendance Rate (%)", data["attendance_rate"]])
    writer.writerow([])
    writer.writerow(["Name", "Email", "Phone", "Status"])
    for a in data["attendees"]:
        writer.writerow([a.name, a.email, a.phone, a.attendance_status])
    writer.writerow([])

    writer.writerow(["EXPENSES"])
    writer.writerow(["Category", "Description", "Amount"])
    for e in data["expenses"]:
        writer.writerow([e.category, e.description or "", e.amount])
    writer.writerow([])

    writer.writerow(["VENDORS"])
    for v in data["vendor_names"]:
        writer.writerow([v])

    output.seek(0)
    filename = f"{event.name.replace(' ', '_')}_report.csv"
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )

@router.get("/event/{event_id}/pdf")
def export_event_pdf(event_id: int, db: Session = Depends(get_db)):
    data = gather_event_data(event_id, db)
    event = data["event"]

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=20 * mm, bottomMargin=20 * mm)
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("TitleStyle", parent=styles["Heading1"], textColor=colors.HexColor("#4F46E5"))
    heading_style = ParagraphStyle("HeadingStyle", parent=styles["Heading2"], spaceBefore=14, textColor=colors.HexColor("#1E293B"))

    elements = []
    elements.append(Paragraph("EventSphere — Event Report", title_style))
    elements.append(Paragraph(event.name, styles["Heading3"]))
    elements.append(Spacer(1, 10))

    overview_data = [
        ["Type", event.event_type],
        ["Date", str(event.date)],
        ["Status", event.status],
        ["Venue", data["venue"].name if data["venue"] else "Not booked"],
        ["Budget", f"₹{event.budget or 0:,.2f}"],
        ["Total Expenses", f"₹{data['total_expenses']:,.2f}"],
        ["Remaining Budget", f"₹{(event.budget or 0) - data['total_expenses']:,.2f}"],
    ]
    overview_table = Table(overview_data, colWidths=[150, 300])
    overview_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#EEF2FF")),
        ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#4F46E5")),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    elements.append(overview_table)

    elements.append(Paragraph("Registration & Attendance", heading_style))
    reg_data = [
        ["Total Registered", str(len(data["attendees"]))],
        ["Checked In", str(data["checked_in"])],
        ["Attendance Rate", f"{data['attendance_rate']}%"],
    ]
    reg_table = Table(reg_data, colWidths=[150, 300])
    reg_table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    elements.append(reg_table)

    if data["expenses"]:
        elements.append(Paragraph("Expenses", heading_style))
        expense_rows = [["Category", "Description", "Amount"]]
        for e in data["expenses"]:
            expense_rows.append([e.category, e.description or "-", f"₹{e.amount:,.2f}"])
        expense_table = Table(expense_rows, colWidths=[120, 230, 100])
        expense_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#4F46E5")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ]))
        elements.append(expense_table)

    if data["vendor_names"]:
        elements.append(Paragraph("Vendors", heading_style))
        for v in data["vendor_names"]:
            elements.append(Paragraph(f"• {v}", styles["Normal"]))

    doc.build(elements)
    buffer.seek(0)
    filename = f"{event.name.replace(' ', '_')}_report.pdf"
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )