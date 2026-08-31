import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import "./AuthScreen.css";

interface AuthScreenProps {
  initialMode: "login" | "signup";
}

const AuthScreen = ({ initialMode }: AuthScreenProps) => {
  const [toggled, setToggled] = useState(initialMode === "signup");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Login functionality coming soon.");
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Signup functionality coming soon.");
  };

  return (
    <div className="auth-page-bg">
      <div className={`auth-wrapper ${toggled ? "toggled" : ""}`}>
        <div className="background-shape" />
        <div className="secondary-shape" />

        <div className="credentials-panel signin">
          <h2 className="slide-element">Log In</h2>
          <p className="subtitle slide-element">Welcome back to EventSphere</p>
          <form onSubmit={handleLoginSubmit}>
            <div className="field-wrapper slide-element">
              <input type="text" placeholder=" " required />
              <label>Username</label>
              <User size={15} />
            </div>

            <div className="field-wrapper slide-element">
              <input type="password" placeholder=" " required />
              <label>Password</label>
              <Lock size={15} />
            </div>

            <div className="field-wrapper slide-element">
              <button className="submit-button" type="submit">Log in</button>
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
              <input type="text" placeholder=" " required />
              <label>Username</label>
              <User size={15} />
            </div>

            <div className="field-wrapper slide-element">
              <input type="email" placeholder=" " required />
              <label>Email</label>
              <Mail size={15} />
            </div>

            <div className="field-wrapper slide-element">
              <input type="password" placeholder=" " required />
              <label>Password</label>
              <Lock size={15} />
            </div>

            <div className="field-wrapper slide-element">
              <button className="submit-button" type="submit">Create account</button>
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