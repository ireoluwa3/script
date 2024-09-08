import React, { useState, useEffect, memo } from "react";
import path from "path";

export const sanitizePath = (inputPath) => {
  // Normalize the path to resolve any '..' sequences
  const normalizedPath = path.normalize(inputPath);

  // Check if the normalized path is still within the intended directory
  if (normalizedPath.includes("..")) {
    throw new Error("Invalid path: Path traversal detected");
  }

  return normalizedPath;
};

type MashImageBaseProps = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
};

const MashImageBase = ({
  src,
  alt,
  fill,
  width,
  height,
  className,
  ...props
}: MashImageBaseProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    if (src) {
      setImgSrc(src);
    } else {
      setImgSrc(
        src?.includes("uploads/avatar") || src?.includes("uploads/users")
          ? "/img/avatars/placeholder.webp"
          : "/img/placeholder.svg"
      );
    }
  }, [src]);

  // Separate imgProps for HTML img element
  const imgProps = { ...props, width, height, className };

  return <img src={imgSrc} alt={alt} {...imgProps} />;
};

export const MashImage = memo(MashImageBase);
