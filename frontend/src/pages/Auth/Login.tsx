import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarRange } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Auth not yet connected — placeholder for now
    alert("Login functionality coming soon.");
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white mb-3">
            <CalendarRange size={20} />
          </div>
          <span className="font-logo text-2xl font-bold">EventSphere</span>
        </div>

        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-7">
          <h1 className="font-display text-xl font-semibold mb-1">Welcome back</h1>
          <p className="text-sm text-[var(--text-muted)] mb-6">Log in to your EventSphere account.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-slate-600">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-[var(--accent)] font-medium hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--accent)] text-white font-medium text-sm rounded-lg px-4 py-2.5 hover:brightness-110 active:scale-[0.99] transition"
            >
              Log in
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <button
            type="button"
            className="w-full border border-slate-200 text-slate-700 font-medium text-sm rounded-lg px-4 py-2.5 hover:bg-slate-50 transition"
          >
            Continue with Google
          </button>

          <p className="text-center text-sm text-[var(--text-muted)] mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[var(--accent)] font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;