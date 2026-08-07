import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(255,255,255,0.06), transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-3xl text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-1.5 text-xs text-[#a1a1a1] mb-8"
        >
          Plan · Manage · Execute
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-[64px] font-semibold leading-[1.08] tracking-tight text-white"
        >
          Run every event
          <br />
          <span className="text-[#666666]">on one platform.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mx-auto mt-6 max-w-lg text-base leading-7 text-[#a1a1a1]"
        >
          EventSphere automates venue booking, resource allocation, attendee
          registration and reporting — all in one centralized system.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-9 flex flex-wrap justify-center gap-3"
        >
          <button className="group flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-[#e5e5e5] transition-colors duration-200">
            Get started
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
          </button>

          <button className="rounded-md border border-white/[0.12] px-5 py-2.5 text-sm font-medium text-[#ededed] hover:bg-white/[0.04] transition-colors duration-200">
            Explore modules
          </button>
        </motion.div>
      </div>
    </section>
  );
}