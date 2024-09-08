export const buttonMotionVariants = {
  hover: {
    scale: 1.01, // Reduced scale transformation for a subtler effect
    textShadow: "0px 0px 8px rgb(255, 255, 255)",
    transition: { type: "spring", stiffness: 200, damping: 20 }, // Adjusted stiffness and added damping for a smoother transition
  },
  tap: {
    scale: 0.98, // Reduced scale transformation to make it less noticeable
    textShadow: "0px 0px 8px rgb(34, 34, 34)",
    transition: { duration: 0.1 }, // Added a transition duration to control speed
  },
  initial: {
    scale: 1,
    textShadow: "0px 0px 0px transparent",
  },
};

export const messageVariants = {
  initial: { y: 100, scale: 0.5, opacity: 0 },
  animate: {
    y: 0,
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: "backOut" },
  },
  exit: {
    y: -100,
    scale: 0.5,
    opacity: 0,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

const panelTransition = {
  type: "spring",
  stiffness: 120,
  damping: 20,
};

export const panelVariants = (side) => ({
  panel: {
    hidden: {
      x: side === "right" ? 500 : side === "left" ? -500 : 0,
      y: side === "top" ? -500 : side === "bottom" ? 500 : 0,
      opacity: 0,
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: panelTransition,
    },
  },
  backdrop: {
    hidden: { opacity: 0, transition: { duration: 0.3 } },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  },
});
