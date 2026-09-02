import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import TopHeader from "../../components/layout/TopHeader";
import Overview from "../Overview/Overview";
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

const pageMeta: Record<string, { title: string; subtitle?: string }> = {
  Overview: { title: "Overview", subtitle: "Here's what's happening with your events today." },
  Events: { title: "Events" },
  Venues: { title: "Venues" },
  "Venue Map": { title: "Venue Map" },
  Resources: { title: "Resources" },
  Bookings: { title: "Bookings" },
  Allocations: { title: "Allocations" },
  Approvals: { title: "Approvals" },
  Attendees: { title: "Attendees" },
  Vendors: { title: "Vendors" },
  Assignments: { title: "Vendor Assignments" },
  Budget: { title: "Budget & Expenses" },
  Sponsorship: { title: "Sponsorship" },
  Analytics: { title: "Analytics Dashboard" },
  "Health Score": { title: "Event Health Score" },
  Risks: { title: "Risk Detection" },
  "Venue Match": { title: "Smart Venue Recommendation" },
  Simulator: { title: "What-If Simulator" },
  Forecast: { title: "Forecasting" },
  Feedback: { title: "Feedback & Evaluation" },
  Certificates: { title: "Certificates" },
  Report: { title: "Summary Report" },
  Export: { title: "Reports & Export" },
  Notifications: { title: "Notifications" },
  "Lost & Found": { title: "Lost & Found" },
  Incidents: { title: "Incident Management" },
};

const DashboardApp = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const meta = pageMeta[activeTab] ?? { title: activeTab };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      <Sidebar
        active={activeTab}
        onChange={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 min-w-0">
        <TopHeader
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
          onNotificationsClick={() => setActiveTab("Notifications")}
        />

        <div className="px-5 md:px-8 py-6">
          {activeTab === "Overview" && <Overview onNavigate={setActiveTab} />}

          {activeTab !== "Overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
              {activeTab === "Events" && (<><EventForm /><EventList /></>)}
              {activeTab === "Venues" && (<><VenueForm /><VenueList /></>)}
              {activeTab === "Resources" && (<><ResourceForm /><ResourceList /></>)}
              {activeTab === "Bookings" && (<><BookingForm /><BookingList /></>)}
              {activeTab === "Allocations" && (<><AllocationForm /><AllocationList /></>)}
              {activeTab === "Attendees" && (<><AttendeeForm /><AttendeeList /></>)}
              {activeTab === "Vendors" && (<><VendorForm /><VendorList /></>)}
              {activeTab === "Assignments" && (<><VendorAssignmentForm /><VendorAssignmentList /></>)}
              {activeTab === "Budget" && <Budget />}
              {activeTab === "Sponsorship" && <Sponsorship />}
              {activeTab === "Approvals" && <Approvals />}
              {activeTab === "Analytics" && <Analytics />}
              {activeTab === "Health Score" && <HealthScore />}
              {activeTab === "Risks" && <Risks />}
              {activeTab === "Venue Match" && <VenueRecommendations />}
              {activeTab === "Simulator" && <Simulator />}
              {activeTab === "Forecast" && <Forecast />}
              {activeTab === "Feedback" && <Feedback />}
              {activeTab === "Certificates" && <Certificates />}
              {activeTab === "Report" && <Report />}
              {activeTab === "Export" && <ReportExport />}
              {activeTab === "Notifications" && <Notifications />}
              {activeTab === "Venue Map" && <VenueMap />}
              {activeTab === "Lost & Found" && <LostFound />}
              {activeTab === "Incidents" && <Incidents />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardApp;