import { cn } from "@/utils/cn";
import { memo } from "react";

type HeadingProps = {
  as?: keyof JSX.IntrinsicElements;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  weight?: "light" | "normal" | "medium" | "bold";
  className?: string;
  children: React.ReactNode;
};

const Heading: React.FC<HeadingProps> = ({
  as: Tag = "h2",
  size = "md",
  weight = "normal",
  className,
  children,
}) => {
  const classes = cn(
    {
      "text-xs": size === "xs",
      "text-sm": size === "sm",
      "text-md": size === "md",
      "text-lg": size === "lg",
      "text-xl": size === "xl",
      "font-light": weight === "light",
      "font-normal": weight === "normal",
      "font-medium": weight === "medium",
      "font-bold": weight === "bold",
    },
    className
  );

  return <Tag className={classes}>{children}</Tag>;
};

export default memo(Heading);
