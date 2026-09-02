import { useLocation } from "react-router-dom";
import PillNav from "./PillNav";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Attendee", href: "/attendee" },
  { label: "Vendor", href: "/vendor" },
  { label: "Login", href: "/login" },
];

const pillNavRoutes = ["/", "/login", "/signup", "/forgot-password"];

const GlobalNav = () => {
  const location = useLocation();

  if (!pillNavRoutes.includes(location.pathname)) return null;

  const activeHref = location.pathname === "/" ? "/" : undefined;

  return (
    <PillNav
      logo="/eventsphere-logo.svg"
      logoAlt="EventSphere"
      brandName="EventSphere"
      items={navItems}
      activeHref={activeHref}
      baseColor="#0b1615"
      pillColor="#0f1f1c"
      hoveredPillTextColor="#ffffff"
      pillTextColor="#5eead4"
    />
  );
};

export default GlobalNav;