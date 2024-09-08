import React, { type FC } from "react";
import { Icon, type IconifyIcon } from "@iconify/react";
import type { VariantProps } from "class-variance-authority";
import { iconboxVariants } from "@/components/elements/variants/iconbox-variants";

interface IconBoxProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof iconboxVariants> {
  icon: IconifyIcon | string;
  iconClasses?: string;
  mask?: "hex" | "hexed" | "blob" | "deca" | "diamond";
  rotating?: boolean;
}

const IconBox: FC<IconBoxProps> = ({
  variant,
  color = "default",
  icon,
  shape = "full",
  size = "md",
  mask,
  shadow,
  className: classes = "",
  iconClasses = "",
  rotating = false,
  ...props
}) => {
  return (
    <div
      className={iconboxVariants({
        variant,
        color,
        shape,
        size,
        shadow,
        className: `relative flex items-center justify-center shrink-0 ${classes} 
        ${
          shape === "straight" && variant !== "outlined" && mask === "hex"
            ? "mask mask-hex"
            : ""
        } 
        ${
          shape === "straight" && variant !== "outlined" && mask === "hexed"
            ? "mask mask-hexed"
            : ""
        } 
        ${
          shape === "straight" && variant !== "outlined" && mask === "blob"
            ? "mask mask-blob"
            : ""
        } 
        ${
          shape === "straight" && variant !== "outlined" && mask === "deca"
            ? "mask mask-deca"
            : ""
        } 
        ${
          shape === "straight" && variant !== "outlined" && mask === "diamond"
            ? "mask mask-diamond"
            : ""
        }`,
      })}
      {...props}
    >
      <Icon
        icon={icon}
        className={`${iconClasses} ${rotating ? "rotating" : ""}`}
      />
    </div>
  );
};

export default IconBox;
