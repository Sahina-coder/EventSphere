import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import EventForm from "../Events/EventForm";
import EventList from "../Events/EventList";
import VenueForm from "../Venues/VenueForm";
import VenueList from "../Venues/VenueList";
import ResourceForm from "../Resources/ResourceForm";
import ResourceList from "../Resources/ResourceList";
import BookingForm from "../Bookings/BookingForm";
import BookingList from "../Bookings/BookingList";
import AllocationForm from "../Allocations/AllocationForm";
import AllocationList from "../Allocations/AllocationList";
import AttendeeForm from "../Attendees/AttendeeForm";
import AttendeeList from "../Attendees/AttendeeList";
import VendorForm from "../Vendors/VendorForm";
import VendorList from "../Vendors/VendorList";
import VendorAssignmentForm from "../VendorAssignments/VendorAssignmentForm";
import VendorAssignmentList from "../VendorAssignments/VendorAssignmentList";
import Budget from "../Budget/Budget";
import Analytics from "../Analytics/Analytics";
import HealthScore from "../HealthScore/HealthScore";
import Risks from "../Risks/Risks";
import Feedback from "../Feedback/Feedback";
import Certificates from "../Certificates/Certificates";
import VenueRecommendations from "../Recommendations/VenueRecommendations";
import Report from "../Report/Report";
import Notifications from "../Notifications/Notifications";
import VenueMap from "../VenueMap/VenueMap";
import LostFound from "../LostFound/LostFound";
import Simulator from "../Simulator/Simulator";
import Incidents from "../Incidents/Incidents";
import Sponsorship from "../Sponsorship/Sponsorship";
import Approvals from "../Approvals/Approvals";
import Forecast from "../Forecast/Forecast";
import ReportExport from "../ReportExport/ReportExport";


const pageTitles: Record<string, string> = {
  Events: "Events",
  Venues: "Venues",
  Resources: "Resources",
  Bookings: "Bookings",
  Allocations: "Allocations",
  Attendees: "Attendees",
  Vendors: "Vendors",
  Assignments: "Vendor Assignments",
  Budget: "Budget & Expenses",
  Analytics: "Analytics Dashboard",
  "Health Score": "Event Health Score",
  Risks: "Risk Detection",
  "Venue Match": "Smart Venue Recommendation",
  Feedback: "Feedback & Evaluation",
  Certificates: "Certificates",
  Report: "Summary Report",
};

const DashboardApp = () => {
  const [activeTab, setActiveTab] = useState("Events");

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      <Sidebar active={activeTab} onChange={setActiveTab} />

      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-[var(--border)] px-8 py-4 sticky top-0 z-10">
          <h2 className="font-display text-lg font-semibold">{pageTitles[activeTab] ?? activeTab}</h2>
        </header>

        <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 px-8 py-8">
          {activeTab === "Events" && (<><EventForm /><EventList /></>)}
          {activeTab === "Venues" && (<><VenueForm /><VenueList /></>)}
          {activeTab === "Venue Map" && <VenueMap />}
          {activeTab === "Resources" && (<><ResourceForm /><ResourceList /></>)}
          {activeTab === "Bookings" && (<><BookingForm /><BookingList /></>)}
          {activeTab === "Allocations" && (<><AllocationForm /><AllocationList /></>)}
          {activeTab === "Attendees" && (<><AttendeeForm /><AttendeeList /></>)}
          {activeTab === "Vendors" && (<><VendorForm /><VendorList /></>)}
          {activeTab === "Assignments" && (<><VendorAssignmentForm /><VendorAssignmentList /></>)}
          {activeTab === "Budget" && <Budget />}
          {activeTab === "Sponsorship" && <Sponsorship />}
          {activeTab === "Analytics" && <Analytics />}
          {activeTab === "Simulator" && <Simulator />}
          {activeTab === "Health Score" && <HealthScore />}
          {activeTab === "Incidents" && <Incidents />}
          {activeTab === "Risks" && <Risks />}
          {activeTab === "Venue Match" && <VenueRecommendations />}
          {activeTab === "Feedback" && <Feedback />}
          {activeTab === "Certificates" && <Certificates />}
          {activeTab === "Approvals" && <Approvals />}
          {activeTab === "Forecast" && <Forecast />}
          {activeTab === "Lost & Found" && <LostFound />}
          {activeTab === "Report" && <Report />}
          {activeTab === "Report Export" && <ReportExport />}
          {activeTab === "Notifications" && <Notifications />}
        </div>
      </div>
    </div>
  );
};

export default DashboardApp;