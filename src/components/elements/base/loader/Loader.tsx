import React, { type FC } from "react";

interface LoaderProps {
  thickness?: number;
  classNames?: string;
  size?: number;
}

const Loader: FC<LoaderProps> = ({ thickness = 5, classNames, size = 50 }) => {
  return (
    <span className={classNames}>
      <svg className={`loader`} viewBox="0 0 50 50" height={size} width={size}>
        <circle
          className="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth={thickness}
        ></circle>
      </svg>
    </span>
  );
};

export default Loader;
