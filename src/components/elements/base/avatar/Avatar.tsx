import React, { type FC } from "react";
import { MashImage } from "@/components/elements/MashImage";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  overlaps?: boolean;
  src?: string;
  alt?: string;
  size?: Sizes;
  text?: string;
  shape?: "straight" | "rounded" | "smooth" | "curved" | "full";
  mask?: "hex" | "hexed" | "blob" | "deca" | "diamond";
  color?:
    | "default"
    | "primary"
    | "info"
    | "success"
    | "warning"
    | "danger"
    | "yellow"
    | "violet";
  children?: React.ReactNode;
}

export type Sizes = keyof typeof sizes;

export const sizes = {
  xl: 96,
  lg: 80,
  md: 64,
  sm: 48,
  xs: 40,
  xxs: 32,
  xxxs: 24,
};

export const styles: Record<Sizes, string> = {
  xl: "h-24 w-24",
  lg: "h-20 w-20",
  md: "h-16 w-16",
  sm: "h-12 w-12",
  xs: "h-10 w-10",
  xxs: "h-8 w-8",
  xxxs: "h-6 w-6",
};

const Avatar: FC<AvatarProps> = ({
  src,
  alt = "",
  size = "md",
  shape = "full",
  color = "default",
  mask,
  overlaps = false,
  text = "?",
  className: classes = "",
  children,
}) => {
  return (
    <div
      className={`${styles[size]} relative shrink-0 ${
        src
          ? " block text-[.64rem]"
          : "flex items-center justify-center font-sans"
      }
      ${
        overlaps && shape === "full" && size === "xxxs"
          ? "-ms-1.5 border-2 border-white first:ms-0 dark:border-muted-800"
          : ""
      }
      ${
        overlaps && shape === "full" && size === "xxs"
          ? "-ms-2.5 border-2 border-white first:ms-0 dark:border-muted-800"
          : ""
      }
      ${
        overlaps && shape === "full" && size === "xs"
          ? "-ms-3.5 border-4 border-white first:ms-0 dark:border-muted-800"
          : ""
      }
      ${
        overlaps && shape === "full" && size === "sm"
          ? "-ms-3.5 border-4 border-white first:ms-0 dark:border-muted-800"
          : ""
      } 
      ${
        overlaps && shape === "full" && size === "md"
          ? "-ms-5 border-[5px] border-white first:ms-0 dark:border-muted-800"
          : ""
      } 
      ${
        overlaps && shape === "full" && size === "lg"
          ? "-ms-6 border-[6px] border-white first:ms-0 dark:border-muted-800"
          : ""
      }  
      ${
        overlaps && shape === "full" && size === "xl"
          ? "-ms-8 border-8 border-white first:ms-0 dark:border-muted-800"
          : ""
      } 
      ${shape === "rounded" ? "rounded-md" : ""}
      ${shape === "smooth" ? "rounded-lg" : ""}
      ${shape === "curved" && size !== "xxxs" ? "rounded-xl" : ""}
      ${shape === "curved" && size === "xxxs" ? "rounded-lg" : ""}
      ${shape === "full" && "rounded-full"}
      ${shape === "straight" && mask === "hex" ? "mask mask-hex" : ""}
      ${shape === "straight" && mask === "hexed" ? "mask mask-hexed" : ""}
      ${shape === "straight" && mask === "blob" ? "mask mask-blob" : ""}
      ${shape === "straight" && mask === "deca" ? "mask mask-deca" : ""}
      ${shape === "straight" && mask === "diamond" ? "mask mask-diamond" : ""}
      ${
        color === "default"
          ? "bg-muted-100 text-muted-500 dark:bg-muted-700/60 dark:text-muted-200"
          : ""
      }
      ${
        color === "primary"
          ? "bg-primary-500/10 text-primary-500 dark:bg-primary-500/20"
          : ""
      }
      ${
        color === "info"
          ? "bg-info-500/10 text-info-500 dark:bg-info-500/20"
          : ""
      }
      ${
        color === "success"
          ? "bg-success-500/10 text-success-500 dark:bg-success-500/20"
          : ""
      }
      ${
        color === "warning"
          ? "bg-warning-500/10 text-warning-500 dark:bg-warning-500/20"
          : ""
      }
      ${
        color === "danger"
          ? "bg-danger-500/10 text-danger-500 dark:bg-danger-500/20"
          : ""
      }
      ${
        color === "yellow"
          ? "bg-yellow-400/10 text-yellow-500 dark:bg-yellow-400/20"
          : ""
      }
      
      ${
        color === "violet"
          ? "bg-violet-500/10 text-violet-500 dark:bg-violet-500/20"
          : ""
      }
      ${classes}`}
    >
      {src ? (
        <MashImage
          height={sizes[size]}
          width={sizes[size]}
          src={src}
          className={`
            block w-full
            ${shape === "rounded" ? "rounded-md" : ""}
            ${shape === "smooth" ? "rounded-lg" : ""}
            ${shape === "curved" && size !== "xxxs" ? "rounded-xl" : ""}
            ${shape === "curved" && size === "xxxs" ? "rounded-lg" : ""}
            ${shape === "full" ? "rounded-full" : ""}
            ${shape === "straight" && mask === "hex" ? "mask mask-hex" : ""}
            ${shape === "straight" && mask === "hexed" ? "mask mask-hexed" : ""}
            ${shape === "straight" && mask === "blob" ? "mask mask-blob" : ""}
            ${shape === "straight" && mask === "deca" ? "mask mask-deca" : ""}
            ${
              shape === "straight" && mask === "diamond"
                ? "mask mask-diamond"
                : ""
            }
          `}
          alt={alt}
        />
      ) : (
        <span
          className={`relative font-sans font-normal
            ${size === "xxxs" ? "text-[0.56rem]" : ""}
            ${size === "xxs" ? "text-xs" : ""}
            ${size === "xs" ? "text-sm" : ""}
            ${size === "sm" ? "text-base" : ""}
            ${size === "md" ? "text-lg" : ""}
            ${size === "lg" ? "text-lg" : ""}
            ${size === "xl" ? "text-xl" : ""}
          `}
        >
          {text}
        </span>
      )}
      {children}
    </div>
  );
};

export default Avatar;
