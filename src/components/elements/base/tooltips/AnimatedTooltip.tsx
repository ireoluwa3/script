import React, { useState } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";

interface AnimatedTooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  position?: "top" | "bottom" | "start" | "end";
  classNames?: string;
}

export const AnimatedTooltip: React.FC<AnimatedTooltipProps> = ({
  children,
  content,
  position = "top",
  classNames,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(50); // Centered initial value

  const handleMouseMove = (event: any) => {
    const rect = event.currentTarget.getBoundingClientRect();
    // Reduce range to make the effect barely noticeable
    x.set(((event.clientX - rect.left) / rect.width) * 100);
  };

  return (
    <div
      className={`tooltip-wrapper ${classNames || ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.6 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
              },
            }}
            exit={{ opacity: 0, y: 18, scale: 0.6 }}
            className={`tooltip tooltip-${position} text-xs flex-col items-center justify-center rounded-md shadow-xl px-4 py-2 -translate-x-1/2 cursor-help`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
