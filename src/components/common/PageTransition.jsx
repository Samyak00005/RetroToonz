import { motion, useReducedMotion } from "framer-motion";

export default function PageTransition({ children }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return children;

  return (
    <motion.div
      id="main-content"
      tabIndex={-1}
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.14, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}
