import React, { type ButtonHTMLAttributes, type FC } from "react";
import type { VariantProps } from "class-variance-authority";
import { buttonIconVariants } from "@/components/elements/variants/button-icon-variants";
import Loader from "@/components/elements/base/loader/Loader";
import { motion } from "framer-motion";
import { buttonMotionVariants } from "@/utils/animations";

interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof buttonIconVariants> {
  children?: React.ReactNode;
  loading?: boolean;
}

const IconButton: FC<IconButtonProps> = ({
  variant,
  color,
  shape,
  size = "md",
  shadow,
  className: classes,
  children,
  loading = false,
  ...props
}) => {
  return (
    <motion.div
      variants={buttonMotionVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
    >
      <button
        className={buttonIconVariants({
          variant,
          shape,
          color,
          size,
          shadow,
          className: `shrink-0 ${
            loading ? "pointer-events-none relative !text-transparent" : ""
          } ${classes}`,
        })}
        {...props}
      >
        {children}
        {loading ? (
          <Loader
            classNames="absolute top-1/2 start-1/2 -translate-y-1/2 -translate-x-1/2"
            size={20}
            thickness={4}
          />
        ) : (
          ""
        )}
      </button>
    </motion.div>
  );
};

export default IconButton;
