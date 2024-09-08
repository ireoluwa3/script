import React, { type ButtonHTMLAttributes, type FC } from "react";
import Link from "next/link";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/elements/variants/button-variants";
import Loader from "@/components/elements/base/loader/Loader";
import { motion } from "framer-motion";
import { buttonMotionVariants } from "@/utils/animations";

interface ButtonLinkProps
  extends Omit<ButtonHTMLAttributes<HTMLAnchorElement>, "color">,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
  href: string;
  loading?: boolean;
  animated?: boolean;
}

const ButtonLink: FC<ButtonLinkProps> = ({
  children,
  variant,
  color,
  shape,
  size = "md",
  shadow,
  className: classes,
  loading = false,
  animated = true,
  href,
  ...props
}) => {
  return (
    <motion.div
      variants={animated ? buttonMotionVariants : {}}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
    >
      <Link
        href={href}
        className={buttonVariants({
          variant,
          color,
          shape,
          size,
          shadow,
          className: `inline-flex items-center justify-center h-10 whitespace-nowrap px-4 py-2 text-center text-sm ${
            loading ? "relative !text-transparent pointer-events-none" : ""
          }  ${classes}`,
        })}
        {...props}
      >
        {children}
        {loading && (
          <Loader
            classNames={`absolute top-1/2 start-1/2 -translate-y-1/2 -translate-x-1/2`}
            size={20}
            thickness={4}
          />
        )}
      </Link>
    </motion.div>
  );
};

export default ButtonLink;
