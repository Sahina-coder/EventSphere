import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueries } from "@tanstack/react-query";
import {
  CalendarRange, ArrowRight, Users, Building2, Wallet, BarChart3,
  ShieldAlert, Sparkles, ChevronDown, Star, Link2,
} from "lucide-react";
import { getEvents } from "../../services/eventService";
import { getAttendees } from "../../services/attendeeService";
import { getVendors } from "../../services/vendorService";
import { getFeedbackSummary } from "../../services/feedbackService";

const navLinks = ["Features", "How It Works", "Organizers", "Attendees", "Vendors", "About"];

const features = [
  { icon: CalendarRange, title: "Event Management", desc: "Create, organize, monitor, and manage events from one centralized platform." },
  { icon: Users, title: "Attendee Management", desc: "Manage registrations, attendance, participant information, and engagement." },
  { icon: Building2, title: "Vendor Management", desc: "Connect organizers with vendors and manage opportunities, applications, and bookings." },
  { icon: Wallet, title: "Financial Management", desc: "Track budgets, expenses, revenue, and financial performance." },
  { icon: Sparkles, title: "Intelligent Insights", desc: "Analyze event data and surface useful patterns and recommendations." },
  { icon: ShieldAlert, title: "Risk Detection", desc: "Identify potential event problems and risks before they become major issues." },
];

const steps = [
  { num: "01", title: "Create", desc: "Create your event and configure the necessary details." },
  { num: "02", title: "Manage", desc: "Manage attendees, vendors, finances, schedules, and event operations." },
  { num: "03", title: "Analyze", desc: "Monitor real-time event metrics and performance." },
  { num: "04", title: "Optimize", desc: "Use intelligent insights and recommendations to make better decisions." },
];

const roles = [
  { title: "Organizer", desc: "Plan, manage, analyze, and optimize events.", cta: "Explore Organizer Platform", to: "/dashboard" },
  { title: "Attendee", desc: "Discover events, register, manage tickets, follow schedules, and provide feedback.", cta: "Explore Attendee Experience", to: "/attendee" },
  { title: "Vendor", desc: "Discover opportunities, apply for events, manage bookings, payments, and reviews.", cta: "Explore Vendor Platform", to: "/vendor" },
];

const testimonials = [
  { name: "Priya Nair", role: "Event Organizer", org: "Jeppiaar University", review: "EventSphere cut our planning time in half and caught a venue conflict we'd have missed.", rating: 5 },
  { name: "Arjun Mehta", role: "Fest Coordinator", org: "TechFest Committee", review: "The risk detection flagged a vendor issue two days before the event. Genuinely useful.", rating: 5 },
  { name: "Sara Fernandes", role: "Operations Lead", org: "Campus Events Club", review: "Budget tracking alone justified switching. The analytics dashboard is a nice bonus.", rating: 4 },
];

const team = [
  { name: "Sahina", role: "Full-Stack Developer" },
  { name: "Team Member 2", role: "Backend Developer" },
  { name: "Team Member 3", role: "Frontend Developer" },
  { name: "Team Member 4", role: "Product Design" },
  { name: "Team Member 5", role: "QA & Testing" },
];

const faqs = [
  { q: "What is EventSphere?", a: "EventSphere is an intelligent event management and decision-support platform that helps organizers plan, manage, analyze, and optimize events from one unified platform." },
  { q: "Who can use EventSphere?", a: "Organizers, attendees, and vendors each get a tailored experience within the same platform." },
  { q: "What can event organizers manage?", a: "Events, venues, resources, bookings, attendees, vendors, budgets, and analytics — the full event lifecycle." },
  { q: "How does the intelligence system work?", a: "EventSphere analyzes real event data — registrations, budgets, resources, vendors — to calculate health scores, detect risks, and suggest recommendations." },
  { q: "Can attendees register for events?", a: "Yes, attendees can browse events, register, receive digital tickets with QR codes, and submit feedback." },
  { q: "Can vendors apply for event opportunities?", a: "Yes, vendors can be assigned to events and track their service status." },
  { q: "Is EventSphere suitable for different types of events?", a: "Yes — workshops, seminars, fests, conferences, and more." },
  { q: "How does EventSphere analyze event performance?", a: "Through dashboards covering registrations, attendance, venue and resource utilization, budgets, and feedback ratings." },
];

const Landing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: attendees } = useQuery({ queryKey: ["attendees"], queryFn: getAttendees });
  const { data: vendors } = useQuery({ queryKey: ["vendors"], queryFn: getVendors });

    const satisfactionSamples = events?.slice(0, 3) ?? [];
  const satisfactionQueries = useQueries({
    queries: satisfactionSamples.map((e) => ({
      queryKey: ["landingFeedback", e.id],
      queryFn: () => getFeedbackSummary(e.id),
      enabled: !!e.id,
    })),
  });
  const ratedSummaries = satisfactionQueries.map((q) => q.data).filter((d) => d && d.total_submissions > 0);
  const avgSatisfactionPct = ratedSummaries.length > 0
    ? Math.round((ratedSummaries.reduce((s, d) => s + (d?.avg_overall ?? 0), 0) / ratedSummaries.length / 5) * 100)
    : null;

  const stats = [
    { value: `${events?.length ?? 0}+`, label: "Events Managed" },
    { value: `${attendees?.length ?? 0}+`, label: "Attendees" },
    { value: `${vendors?.length ?? 0}+`, label: "Vendors Onboarded" },
    { value: avgSatisfactionPct !== null ? `${avgSatisfactionPct}%` : "—", label: "Satisfaction" },
  ];

  return (
    <div className="bg-[var(--bg)] text-[var(--text)]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white">
              <CalendarRange size={16} />
            </div>
            <span className="font-logo text-xl font-bold">EventSphere</span>
          </div>
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a key={link} href={`#${link.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm text-slate-600 hover:text-slate-900 transition">
                {link}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition">Log In</Link>
            <Link to="/signup" className="bg-[var(--accent)] text-white text-sm font-medium px-4 py-2 rounded-lg hover:brightness-110 transition">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            Plan Smarter. Manage Better. Create Events That Perform.
          </h1>
          <p className="text-[var(--text-muted)] mt-5 text-base leading-relaxed">
            EventSphere is an intelligent event management and decision-support platform that helps organizers plan, manage, analyze, and optimize events from one unified platform.
          </p>
          <div className="flex items-center gap-4 mt-8">
            <Link to="/signup" className="bg-[var(--accent)] text-white font-medium px-5 py-3 rounded-lg hover:brightness-110 transition flex items-center gap-2">
              Get Started <ArrowRight size={16} />
            </Link>
            <a href="#features" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition">
              Explore Platform
            </a>
          </div>
        </div>
        <Link to="/dashboard" className="block bg-white rounded-xl border border-[var(--border)] shadow-md p-6 hover:shadow-lg transition">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-indigo-50 rounded-lg p-4">
              <BarChart3 size={18} className="text-[var(--accent)] mb-2" />
              <p className="text-xl font-semibold">{attendees?.length ?? 0}</p>
              <p className="text-xs text-[var(--text-muted)]">Registrations</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <Users size={18} className="text-emerald-600 mb-2" />
              <p className="text-xl font-semibold">{events?.length ?? 0}</p>
              <p className="text-xs text-[var(--text-muted)]">Events Managed</p>
            </div>
          </div>
          <div className="h-24 bg-slate-50 rounded-lg flex items-end gap-1.5 p-3">
            {[40, 65, 45, 80, 60, 90, 70].map((h, i) => (
              <div key={i} className="flex-1 bg-[var(--accent)] rounded-t" style={{ height: `${h}%`, opacity: 0.7 + i * 0.04 }} />
            ))}
          </div>
        </Link>
      </section>

      {/* Stats */}
      <section className="bg-white border-y border-[var(--border)] py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl font-bold text-[var(--accent)]">{s.value}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="font-display text-3xl font-bold text-center mb-12">Everything You Need to Run Smarter Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-[var(--accent)] flex items-center justify-center mb-4">
                <f.icon size={20} />
              </div>
              <h3 className="font-display text-base font-semibold mb-1.5">{f.title}</h3>
              <p className="text-sm text-[var(--text-muted)]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Intelligence Section */}
      <section className="bg-indigo-50/50 py-20">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold mb-4">Don't Just Manage Your Events. Understand Them.</h2>
            <p className="text-[var(--text-muted)] leading-relaxed">
              EventSphere uses your event data to generate intelligent insights and decision-support recommendations — surfacing risks and opportunities before they become problems.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-[var(--border)] shadow-md p-6">
            <div className="flex items-center gap-2 text-amber-600 text-sm font-semibold mb-2">
              <ShieldAlert size={16} /> Attendance Risk Detected
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Registration patterns indicate a potential increase in attendee no-shows.
            </p>
            <div className="bg-slate-50 rounded-lg p-3 mb-4">
              <p className="text-xs font-medium text-slate-500 mb-1">Recommended Action</p>
              <p className="text-sm text-slate-700">Send reminder notifications 24 hours before the event.</p>
            </div>
            <Link to="/dashboard" className="text-sm font-medium text-[var(--accent)] flex items-center gap-1">
              Take Action <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="font-display text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.num} className="text-center md:text-left">
              <p className="font-display text-2xl font-bold text-indigo-200 mb-2">{s.num}</p>
              <h3 className="font-display text-base font-semibold mb-1.5">{s.title}</h3>
              <p className="text-sm text-[var(--text-muted)]">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Role-Based Platform */}
      <section className="bg-white border-y border-[var(--border)] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-3xl font-bold text-center mb-12">One Platform. Three Experiences.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((r) => (
              <div key={r.title} id={r.title.toLowerCase() + "s"} className="rounded-xl border border-[var(--border)] p-6 hover:shadow-md transition-all duration-200">
                <h3 className="font-display text-lg font-semibold mb-2">{r.title}</h3>
                <p className="text-sm text-[var(--text-muted)] mb-5">{r.desc}</p>
                <Link to={r.to} className="text-sm font-medium text-[var(--accent)] flex items-center gap-1">
                  {r.cta} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="font-display text-3xl font-bold mb-4">Everything Your Event Needs. One Intelligent Dashboard.</h2>
        <p className="text-[var(--text-muted)] max-w-xl mx-auto mb-10">
          KPI cards, real-time analytics, risk indicators, and recommendations — all in one place.
        </p>
        <Link to="/dashboard" className="block bg-white rounded-xl border border-[var(--border)] shadow-lg p-3 max-w-4xl mx-auto hover:shadow-xl transition">
          <div className="flex gap-1.5 px-2 py-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
          </div>
          <div className="bg-slate-50 rounded-lg h-64 flex items-center justify-center text-slate-300 text-sm">
            Dashboard preview — click to open
          </div>
        </Link>
        <Link to="/dashboard" className="inline-flex items-center gap-2 mt-8 bg-[var(--accent)] text-white font-medium px-5 py-3 rounded-lg hover:brightness-110 transition">
          Explore Dashboard <ArrowRight size={16} />
        </Link>
      </section>

      {/* Testimonials */}
      <section className="bg-white border-y border-[var(--border)] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-3xl font-bold text-center mb-3">Trusted by Event Teams</h2>
          <p className="text-center text-xs text-slate-400 mb-12">Demo testimonials for illustration</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl border border-[var(--border)] p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill={i < t.rating ? "#F59E0B" : "none"} color={i < t.rating ? "#F59E0B" : "#E2E8F0"} />
                  ))}
                </div>
                <p className="text-sm text-slate-600 mb-4">"{t.review}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-[var(--accent)] flex items-center justify-center text-sm font-semibold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{t.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{t.role}, {t.org}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="font-display text-3xl font-bold text-center mb-12">Built by Team EventSphere</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {team.map((m) => (
            <div key={m.name} className="text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-[var(--accent)] flex items-center justify-center text-lg font-semibold mx-auto mb-3">
                {m.name[0]}
              </div>
              <p className="text-sm font-medium text-slate-800">{m.name}</p>
              <p className="text-xs text-[var(--text-muted)] mb-2">{m.role}</p>
              <div className="flex justify-center gap-2 text-slate-400">
                <Link2 size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border-y border-[var(--border)] py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqs.map((f, i) => (
              <div key={i} className="border border-[var(--border)] rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left text-sm font-medium text-slate-800"
                >
                  {f.q}
                  <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-3.5 text-sm text-[var(--text-muted)]">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="font-display text-3xl font-bold mb-4">Ready to Make Your Next Event Smarter?</h2>
        <p className="text-[var(--text-muted)] mb-8">
          Bring event management, analytics, and intelligent decision-making together in one platform.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/signup" className="bg-[var(--accent)] text-white font-medium px-5 py-3 rounded-lg hover:brightness-110 transition">
            Get Started
          </Link>
          <Link to="/dashboard" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition">
            Explore EventSphere
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-14">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <span className="font-logo text-xl font-bold text-white">EventSphere</span>
            <p className="text-xs text-slate-400 mt-2">Intelligent Event Management & Decision Support.</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Platform</p>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white transition">Features</a></li>
              <li><Link to="/dashboard" className="hover:text-white transition">Organizers</Link></li>
              <li><Link to="/attendee" className="hover:text-white transition">Attendees</Link></li>
              <li><Link to="/vendor" className="hover:text-white transition">Vendors</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Company</p>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="hover:text-white transition">About</a></li>
              <li><a href="#about" className="hover:text-white transition">Team</a></li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Legal</p>
            <ul className="space-y-2 text-sm">
              <li>Privacy</li><li>Terms</li>
            </ul>
          </div>
        </div>
        <p className="text-center text-xs text-slate-500 mt-10">© 2026 EventSphere. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;