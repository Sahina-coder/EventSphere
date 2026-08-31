import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right";
}

const Reveal = ({ children, delay = 0, direction = "up" }: RevealProps) => {
  const initial =
    direction === "left"
      ? { opacity: 0, x: -40, rotateY: -12 }
      : direction === "right"
      ? { opacity: 0, x: 40, rotateY: 12 }
      : { opacity: 0, y: 28, rotateX: 8 };

  return (
    <motion.div
      initial={{ ...initial, transformPerspective: 1000 }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotateX: 0, rotateY: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;