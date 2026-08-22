import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarRange, CheckCircle2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
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
          {!sent ? (
            <>
              <h1 className="font-display text-xl font-semibold mb-1">Reset your password</h1>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                Enter your email and we'll send you a reset link.
              </p>
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
                <button
                  type="submit"
                  className="w-full bg-[var(--accent)] text-white font-medium text-sm rounded-lg px-4 py-2.5 hover:brightness-110 active:scale-[0.99] transition"
                >
                  Send reset link
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={24} />
              </div>
              <h2 className="font-display text-lg font-semibold mb-1.5">Check your email</h2>
              <p className="text-sm text-[var(--text-muted)]">
                If an account exists for {email}, a reset link has been sent.
              </p>
            </div>
          )}

          <p className="text-center text-sm text-[var(--text-muted)] mt-6">
            <Link to="/login" className="text-[var(--accent)] font-medium hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;