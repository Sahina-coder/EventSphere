import { useLocation } from "react-router-dom";
import GlowCursor from "./GlowCursor";

const glowRoutes = ["/", "/login", "/signup", "/forgot-password"];

const GlobalCursorGlow = () => {
  const location = useLocation();
  if (!glowRoutes.includes(location.pathname)) return null;
  return <GlowCursor />;
};

export default GlobalCursorGlow;