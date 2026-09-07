import { motion, useReducedMotion } from "framer-motion";

export default function PageTransition({ children }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return children;

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -2 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
