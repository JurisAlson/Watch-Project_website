import { motion } from "framer-motion";

const pageVariants = {
  initial: {
    opacity: 0,
    x: 40,
  },

  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },

  exit: {
    opacity: 0,
    x: -40,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 1, 1],
    },
  },
};

function PageTransition({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        width: "100%",
        minHeight: "100vh",
      }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;