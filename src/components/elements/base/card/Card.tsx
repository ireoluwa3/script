import React, { type FC } from "react";
import type { VariantProps } from "class-variance-authority";
import { cardVariants } from "@/components/elements/variants/card-variants";

interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
}

const Card: FC<CardProps> = ({
  children,
  color = "default",
  className: classes = "",
  shape = "smooth",
  shadow = "none",
  ...props
}) => {
  return (
    <div
      className={cardVariants({
        color,
        shape,
        shadow,
        className: `${classes}`,
      })}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
