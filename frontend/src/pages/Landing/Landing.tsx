import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery, useQueries } from "@tanstack/react-query";
import {
  CalendarRange, ArrowRight, Users, Building2, Wallet, BarChart3,
  ShieldAlert, Sparkles, ChevronDown, Star, Link2,
} from "lucide-react";
import { getEvents } from "../../services/eventService";
import { getAttendees } from "../../services/attendeeService";
import { getVendors } from "../../services/vendorService";
import { getFeedbackSummary } from "../../services/feedbackService";
import Reveal from "../../components/Reveal";
import AnimatedCounter from "../../components/AnimatedCounter";
import GradientButton from "../../components/GradientButton";
import Hero3D from "../../components/Hero3D";
import TiltCard from "../../components/TiltCard";
import "./Landing.css";

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
    : 0;

  const stats = [
    { value: events?.length ?? 0, suffix: "+", label: "Events Managed" },
    { value: attendees?.length ?? 0, suffix: "+", label: "Attendees" },
    { value: vendors?.length ?? 0, suffix: "+", label: "Vendors Onboarded" },
    { value: avgSatisfactionPct, suffix: "%", label: "Satisfaction" },
  ];

  return (
    <div className="landing-dark min-h-screen">
      
      {/* Hero with 3D scene */}
      <section className="relative pt-20">
        <div className="absolute inset-0 z-0">
          <Hero3D />
        </div>
        <div className="ld-glow-blob ld-blob-1" />
        <div className="ld-glow-blob ld-blob-2" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="ld-chip inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full mb-5"
            >
              <Sparkles size={12} /> Intelligent Event Decision Support
            </motion.span>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight ld-gradient-text">
              Plan Smarter. Manage Better. Create Events That Perform.
            </h1>
            <p className="ld-muted mt-5 text-base leading-relaxed max-w-md">
              EventSphere is an intelligent event management and decision-support platform that helps organizers plan, manage, analyze, and optimize events from one unified platform.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <GradientButton to="/signup" label="Get Started" />
              <a href="#features" className="text-sm font-medium text-white/80 hover:text-white transition">
                Explore Platform
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <TiltCard className="ld-card ld-shimmer rounded-2xl p-6 cursor-pointer">
              <Link to="/dashboard" style={{ transform: "translateZ(30px)" }} className="block">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <motion.div whileHover={{ scale: 1.03 }} className="bg-indigo-500/10 border border-indigo-400/20 rounded-xl p-4">
                    <BarChart3 size={18} className="text-indigo-300 mb-2" />
                    <p className="text-xl font-semibold text-white">{attendees?.length ?? 0}</p>
                    <p className="text-xs ld-muted">Registrations</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} className="bg-purple-500/10 border border-purple-400/20 rounded-xl p-4">
                    <Users size={18} className="text-purple-300 mb-2" />
                    <p className="text-xl font-semibold text-white">{events?.length ?? 0}</p>
                    <p className="text-xs ld-muted">Events Managed</p>
                  </motion.div>
                </div>
                <div className="h-24 bg-white/5 rounded-xl flex items-end gap-1.5 p-3">
                  {[40, 65, 45, 80, 60, 90, 70].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.6, delay: 0.5 + i * 0.06, ease: "easeOut" }}
                      className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-400 rounded-t"
                    />
                  ))}
                </div>
              </Link>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="ld-border-y py-12 relative z-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div>
                <p className="font-display text-3xl font-bold ld-gradient-text">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </p>
                <p className="text-xs ld-muted mt-1">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <Reveal><h2 className="font-display text-3xl font-bold text-center mb-12 text-white">Everything You Need to Run Smarter Events</h2></Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06} direction={i % 2 === 0 ? "left" : "right"}>
              <TiltCard className="ld-card rounded-xl p-6">
                <div style={{ transform: "translateZ(20px)" }}>
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/15 text-indigo-300 flex items-center justify-center mb-4">
                    <f.icon size={20} />
                  </div>
                  <h3 className="font-display text-base font-semibold mb-1.5 text-white">{f.title}</h3>
                  <p className="text-sm ld-muted">{f.desc}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Intelligence Section */}
      <section className="ld-section-bg py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <Reveal direction="left">
            <div>
              <h2 className="font-display text-3xl font-bold mb-4 text-white">Don't Just Manage Your Events. Understand Them.</h2>
              <p className="ld-muted leading-relaxed">
                EventSphere uses your event data to generate intelligent insights and decision-support recommendations — surfacing risks and opportunities before they become problems.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15} direction="right">
            <TiltCard className="ld-card rounded-xl p-6">
              <div style={{ transform: "translateZ(20px)" }}>
                <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold mb-2">
                  <ShieldAlert size={16} /> Attendance Risk Detected
                </div>
                <p className="text-sm ld-muted mb-4">
                  Registration patterns indicate a potential increase in attendee no-shows.
                </p>
                <div className="bg-white/5 rounded-lg p-3 mb-4">
                  <p className="text-xs font-medium text-white/60 mb-1">Recommended Action</p>
                  <p className="text-sm text-white/90">Send reminder notifications 24 hours before the event.</p>
                </div>
                <Link to="/dashboard" className="text-sm font-medium text-indigo-300 flex items-center gap-1 hover:text-indigo-200 transition">
                  Take Action <ArrowRight size={14} />
                </Link>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <Reveal><h2 className="font-display text-3xl font-bold text-center mb-12 text-white">How It Works</h2></Reveal>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={i * 0.08}>
              <div className="text-center md:text-left">
                <p className="font-display text-2xl font-bold ld-gradient-text mb-2">{s.num}</p>
                <h3 className="font-display text-base font-semibold mb-1.5 text-white">{s.title}</h3>
                <p className="text-sm ld-muted">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Role-Based Platform */}
      <section className="ld-border-y py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal><h2 className="font-display text-3xl font-bold text-center mb-12 text-white">One Platform. Three Experiences.</h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.08} direction={i === 0 ? "left" : i === 2 ? "right" : "up"}>
                <TiltCard className="ld-card rounded-xl p-6">
                  <div id={r.title.toLowerCase() + "s"} style={{ transform: "translateZ(20px)" }}>
                    <h3 className="font-display text-lg font-semibold mb-2 text-white">{r.title}</h3>
                    <p className="text-sm ld-muted mb-5">{r.desc}</p>
                    <Link to={r.to} className="text-sm font-medium text-indigo-300 flex items-center gap-1 hover:text-indigo-200 transition">
                      {r.cta} <ArrowRight size={14} />
                    </Link>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center relative z-10">
        <Reveal>
          <h2 className="font-display text-3xl font-bold mb-4 text-white">Everything Your Event Needs. One Intelligent Dashboard.</h2>
          <p className="ld-muted max-w-xl mx-auto mb-10">
            KPI cards, real-time analytics, risk indicators, and recommendations — all in one place.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="max-w-4xl mx-auto">
            <TiltCard className="ld-card ld-shimmer rounded-2xl p-3 cursor-pointer">
              <Link to="/dashboard" style={{ transform: "translateZ(25px)" }} className="block">
                <div className="flex gap-1.5 px-2 py-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                </div>
                <div className="bg-white/5 rounded-xl h-64 flex items-center justify-center text-white/30 text-sm">
                  Dashboard preview — click to open
                </div>
              </Link>
            </TiltCard>
          </div>
          <div className="mt-8 inline-block">
            <GradientButton to="/dashboard" label="Explore Dashboard" />
          </div>
        </Reveal>
      </section>

      {/* Testimonials */}
      <section className="ld-section-bg py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-bold text-center mb-3 text-white">Trusted by Event Teams</h2>
            <p className="text-center text-xs text-white/30 mb-12">Demo testimonials for illustration</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08} direction={i === 0 ? "left" : i === 2 ? "right" : "up"}>
                <TiltCard className="ld-card rounded-xl p-6">
                  <div style={{ transform: "translateZ(15px)" }}>
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={14} fill={j < t.rating ? "#facc15" : "none"} color={j < t.rating ? "#facc15" : "rgba(255,255,255,0.2)"} />
                      ))}
                    </div>
                    <p className="text-sm ld-muted mb-4">"{t.review}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-semibold text-white">
                        {t.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{t.name}</p>
                        <p className="text-xs ld-muted">{t.role}, {t.org}</p>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <Reveal><h2 className="font-display text-3xl font-bold text-center mb-12 text-white">Built by Team EventSphere</h2></Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {team.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.06}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-lg font-semibold text-white mx-auto mb-3">
                  {m.name[0]}
                </div>
                <p className="text-sm font-medium text-white">{m.name}</p>
                <p className="text-xs ld-muted mb-2">{m.role}</p>
                <div className="flex justify-center gap-2 text-white/30">
                  <Link2 size={14} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="ld-border-y py-20 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal><h2 className="font-display text-3xl font-bold text-center mb-12 text-white">Frequently Asked Questions</h2></Reveal>
          <div className="space-y-2">
            {faqs.map((f, i) => (
              <div key={i} className="ld-card rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left text-sm font-medium text-white"
                >
                  {f.q}
                  <ChevronDown size={16} className={`text-white/40 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.25 }}
                    className="px-4 pb-3.5 text-sm ld-muted overflow-hidden"
                  >
                    {f.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center relative z-10">
        <div className="ld-glow-blob ld-blob-3" />
        <Reveal>
          <h2 className="font-display text-3xl font-bold mb-4 ld-gradient-text relative z-10">Ready to Make Your Next Event Smarter?</h2>
          <p className="ld-muted mb-8 relative z-10">
            Bring event management, analytics, and intelligent decision-making together in one platform.
          </p>
          <div className="flex items-center justify-center gap-4 relative z-10">
            <GradientButton to="/signup" label="Get Started" />
            <Link to="/dashboard" className="text-sm font-medium text-white/80 hover:text-white transition">
              Explore EventSphere
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="bg-black py-14 relative z-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <span className="font-logo text-xl font-bold text-white">EventSphere</span>
            <p className="text-xs text-white/30 mt-2">Intelligent Event Management & Decision Support.</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/30 mb-3">Platform</p>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#features" className="hover:text-white transition">Features</a></li>
              <li><Link to="/dashboard" className="hover:text-white transition">Organizers</Link></li>
              <li><Link to="/attendee" className="hover:text-white transition">Attendees</Link></li>
              <li><Link to="/vendor" className="hover:text-white transition">Vendors</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/30 mb-3">Company</p>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#about" className="hover:text-white transition">About</a></li>
              <li><a href="#about" className="hover:text-white transition">Team</a></li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/30 mb-3">Legal</p>
            <ul className="space-y-2 text-sm text-white/60">
              <li>Privacy</li><li>Terms</li>
            </ul>
          </div>
        </div>
        <p className="text-center text-xs text-white/20 mt-10">© 2026 EventSphere. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
