import React, { type FC } from "react";
import type { VariantProps } from "class-variance-authority";
import { tagVariants } from "@/components/elements/variants/tag-variants";

interface TagProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof tagVariants> {
  children: React.ReactNode;
}

const Tag: FC<TagProps> = ({
  children,
  variant,
  color,
  shape,
  shadow,
  className: classes = "",
  ...props
}) => {
  return (
    <span
      className={tagVariants({
        shape,
        variant,
        color,
        shadow,
        className: `${classes}`,
      })}
      {...props}
    >
      {children}
    </span>
  );
};

export default Tag;
