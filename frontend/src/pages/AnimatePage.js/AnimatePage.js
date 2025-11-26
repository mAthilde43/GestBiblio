import { motion } from "framer-motion";

export default function AnimatedPage({ children, direction = "right" }) {
  const variants = {
    initial: {
      opacity: 0,
      x: direction === "right" ? 100 : -100, // Slide depuis la droite OU la gauche
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
    exit: {
      opacity: 0,
      x: direction === "right" ? -100 : 100, // Slide inverse en sortie
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
}
