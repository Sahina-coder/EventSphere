import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import DashboardApp from "./pages/Dashboard/DashboardApp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard/*" element={<DashboardApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;