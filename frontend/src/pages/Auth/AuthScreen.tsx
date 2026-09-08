import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User as UserIcon, Mail, Lock } from "lucide-react";
import { loginUser, registerUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import "./AuthScreen.css";

interface AuthScreenProps {
  initialMode: "login" | "signup";
}

const roles = ["Organizer", "Attendee", "Vendor"];

const roleRedirect: Record<string, string> = {
  Organizer: "/dashboard",
  Attendee: "/attendee",
  Vendor: "/vendor",
};

const AuthScreen = ({ initialMode }: AuthScreenProps) => {
  const [toggled, setToggled] = useState(initialMode === "signup");
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState("Attendee");
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await loginUser(loginEmail, loginPassword);
      login(res.access_token, res.user);
      navigate(roleRedirect[res.user.role] ?? "/");
    } catch (err: any) {
      setLoginError(err?.response?.data?.detail || "Login failed. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    setSignupLoading(true);
    try {
      const res = await registerUser(signupName, signupEmail, signupPassword, signupRole);
      login(res.access_token, res.user);
      navigate(roleRedirect[res.user.role] ?? "/");
    } catch (err: any) {
      setSignupError(err?.response?.data?.detail || "Signup failed. Please try again.");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="auth-page-bg">
      <img src="/eventsphere-logo.svg" alt="EventSphere" className="auth-brand-logo" />
      <div className={`auth-wrapper ${toggled ? "toggled" : ""}`}>
        <div className="background-shape" />
        <div className="secondary-shape" />

        <div className="credentials-panel signin">
          <h2 className="slide-element">Log In</h2>
          <p className="subtitle slide-element">Welcome back to EventSphere</p>
          <form onSubmit={handleLoginSubmit}>
            <div className="field-wrapper slide-element">
              <input type="email" placeholder=" " value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
              <label>Email</label>
              <Mail size={15} />
            </div>

            <div className="field-wrapper slide-element">
              <input type="password" placeholder=" " value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
              <label>Password</label>
              <Lock size={15} />
            </div>

            {loginError && (
              <p className="slide-element" style={{ color: "#fb7185", fontSize: 12, marginTop: 8 }}>{loginError}</p>
            )}

            <div className="field-wrapper slide-element">
              <button className="submit-button" type="submit" disabled={loginLoading}>
                {loginLoading ? "Logging in…" : "Log in"}
              </button>
            </div>

            <div className="switch-link slide-element">
              <p>
                Don't have an account?{" "}
                <a onClick={() => setToggled(true)}>Sign up</a>
              </p>
            </div>
          </form>
        </div>

        <div className="welcome-section signin">
          <h2 className="slide-element">Welcome back</h2>
          <p className="slide-element">Log in to manage your events, budgets, and analytics.</p>
        </div>

        <div className="credentials-panel signup">
          <h2 className="slide-element">Create account</h2>
          <p className="subtitle slide-element">Join EventSphere in seconds</p>
          <form onSubmit={handleSignupSubmit}>
            <div className="field-wrapper slide-element">
              <input type="text" placeholder=" " value={signupName} onChange={(e) => setSignupName(e.target.value)} required />
              <label>Full name</label>
              <UserIcon size={15} />
            </div>

            <div className="field-wrapper slide-element">
              <input type="email" placeholder=" " value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
              <label>Email</label>
              <Mail size={15} />
            </div>

            <div className="field-wrapper slide-element">
              <input type="password" placeholder=" " value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required minLength={6} />
              <label>Password</label>
              <Lock size={15} />
            </div>

            <div className="slide-element" style={{ marginTop: 22 }}>
              <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8 }}>I am joining as</label>
              <div style={{ display: "flex", gap: 8 }}>
                {roles.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSignupRole(r)}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      border: signupRole === r ? "1px solid #2dd4bf" : "1px solid rgba(255,255,255,0.15)",
                      background: signupRole === r ? "rgba(45,212,191,0.15)" : "transparent",
                      color: signupRole === r ? "#5eead4" : "rgba(255,255,255,0.6)",
                      cursor: "pointer",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {signupError && (
              <p className="slide-element" style={{ color: "#fb7185", fontSize: 12, marginTop: 8 }}>{signupError}</p>
            )}

            <div className="field-wrapper slide-element">
              <button className="submit-button" type="submit" disabled={signupLoading}>
                {signupLoading ? "Creating…" : "Create account"}
              </button>
            </div>

            <div className="switch-link slide-element">
              <p>
                Already have an account?{" "}
                <a onClick={() => setToggled(false)}>Log in</a>
              </p>
            </div>
          </form>
        </div>

        <div className="welcome-section signup">
          <h2 className="slide-element">Get started</h2>
          <p className="slide-element">Create your account to plan smarter events.</p>
        </div>
      </div>

      <div className="auth-footer">
        <p>
          <Link to="/">← Back to EventSphere</Link>
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;