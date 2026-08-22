import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import DashboardApp from "./pages/Dashboard/DashboardApp";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AttendeeLayout from "./pages/AttendeePortal/AttendeeLayout";
import AttendeeDashboardHome from "./pages/AttendeePortal/AttendeeDashboardHome";
import DiscoverEvents from "./pages/AttendeePortal/DiscoverEvents";
import MyTickets from "./pages/AttendeePortal/MyTickets";
import Schedule from "./pages/AttendeePortal/Schedule";
import Feedback from "./pages/Feedback/Feedback";
import { AttendeeProvider } from "./context/AttendeeContext";

function App() {
  return (
    <BrowserRouter>
      <AttendeeProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard/*" element={<DashboardApp />} />
          <Route path="/attendee" element={<AttendeeLayout />}>
            <Route index element={<AttendeeDashboardHome />} />
            <Route path="discover" element={<DiscoverEvents />} />
            <Route path="tickets" element={<MyTickets />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="feedback" element={<Feedback />} />
          </Route>
        </Routes>
      </AttendeeProvider>
    </BrowserRouter>
  );
}

export default App;