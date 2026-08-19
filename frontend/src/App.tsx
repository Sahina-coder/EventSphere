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

function App() {
  const [activeTab, setActiveTab] = useState("Events");

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <AppHeader />
      <Tabs active={activeTab} onChange={setActiveTab} />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-8">
        {activeTab === "Events" && (
          <>
            <EventForm />
            <EventList />
          </>
        )}
        {activeTab === "Venues" && (
          <>
            <VenueForm />
            <VenueList />
          </>
        )}
        {activeTab === "Resources" && (
          <>
            <ResourceForm />
            <ResourceList />
          </>
        )}
        {activeTab === "Bookings" && (
          <>
            <BookingForm />
            <BookingList />
          </>
        )}
      </div>
    </div>
  );
}

export default App;