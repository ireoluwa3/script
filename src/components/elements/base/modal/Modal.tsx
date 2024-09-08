import React, { type FC } from "react";
import { motion } from "framer-motion";

interface ModalProps {
  open?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  classes?: {
    wrapper?: string | string[];
    backdrop?: string | string[];
    dialog?: string | string[];
  };
  children?: React.ReactNode;
  onBackdropClick?: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 150, damping: 20 },
  },
  exit: { scale: 0.8, opacity: 0, transition: { duration: 0.5 } },
};

const Modal: FC<ModalProps> = ({
  open,
  size = "md",
  classes,
  children,
  onBackdropClick,
}) => {
  if (!open) return null;

  return (
    <motion.div
      className={`fixed inset-0 z-[9999] flex items-center justify-center ${classes?.wrapper}`}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <motion.div
        role="button"
        className={`fixed inset-0 cursor-default bg-muted-800/70 dark:bg-muted-900/80 ${classes?.backdrop}`}
        variants={backdropVariants}
        onClick={onBackdropClick}
      ></motion.div>
      <div
        className={`fixed inset-0 mx-auto
          ${size === "sm" ? "max-w-sm" : ""}
          ${size === "md" ? "max-w-md" : ""}
          ${size === "lg" ? "max-w-xl" : ""}
          ${size === "xl" ? "max-w-2xl" : ""}
          ${size === "2xl" ? "max-w-3xl" : ""}
          ${size === "3xl" ? "max-w-5xl" : ""}
        `}
      >
        <div
          className={`flex min-h-full items-center justify-center p-4 text-center ${classes?.dialog}`}
        >
          <motion.div className="w-full text-start" variants={modalVariants}>
            {children}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Modal;
