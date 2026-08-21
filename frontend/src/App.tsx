import { useState } from "react";
import AppHeader from "./components/layout/AppHeader";
import Tabs from "./components/layout/Tabs";
import EventForm from "./pages/Events/EventForm";
import EventList from "./pages/Events/EventList";
import VenueForm from "./pages/Venues/VenueForm";
import VenueList from "./pages/Venues/VenueList";
import ResourceForm from "./pages/Resources/ResourceForm";
import ResourceList from "./pages/Resources/ResourceList";
import BookingForm from "./pages/Bookings/BookingForm";
import BookingList from "./pages/Bookings/BookingList";
import AllocationForm from "./pages/Allocations/AllocationForm";
import AllocationList from "./pages/Allocations/AllocationList";
import AttendeeForm from "./pages/Attendees/AttendeeForm";
import AttendeeList from "./pages/Attendees/AttendeeList";
import VendorForm from "./pages/Vendors/VendorForm";
import VendorList from "./pages/Vendors/VendorList";
import VendorAssignmentForm from "./pages/VendorAssignments/VendorAssignmentForm";
import VendorAssignmentList from "./pages/VendorAssignments/VendorAssignmentList";
import Report from "./pages/Report/Report";
import Budget from "./pages/Budget/Budget";

function App() {
  const [activeTab, setActiveTab] = useState("Events");

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <AppHeader />
      <Tabs active={activeTab} onChange={setActiveTab} />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-8">
        {activeTab === "Events" && (<><EventForm /><EventList /></>)}
        {activeTab === "Venues" && (<><VenueForm /><VenueList /></>)}
        {activeTab === "Resources" && (<><ResourceForm /><ResourceList /></>)}
        {activeTab === "Bookings" && (<><BookingForm /><BookingList /></>)}
        {activeTab === "Allocations" && (<><AllocationForm /><AllocationList /></>)}
        {activeTab === "Attendees" && (<><AttendeeForm /><AttendeeList /></>)}
        {activeTab === "Vendors" && (<><VendorForm /><VendorList /></>)}
        {activeTab === "Assignments" && (<><VendorAssignmentForm /><VendorAssignmentList /></>)}
        {activeTab === "Report" && <Report />}
        {activeTab === "Budget" && <Budget />}
      </div>
    </div>
  );
}

export default App;