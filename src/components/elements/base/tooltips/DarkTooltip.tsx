import { type FC, type ReactNode, useState } from "react";

interface Props {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom" | "start" | "end";
  classNames?: string;
}

const DarkToolTip: FC<Props> = ({
  children,
  content,
  position = "top",
  classNames,
}): JSX.Element => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={"z-50 dark-tooltip-wrapper"}>
      <div
        className={"dark-tooltip-children"}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </div>

      {isHovered && (
        <div
          className={`dark-tooltip dark-tooltip-${position} ${
            classNames ? classNames : ""
          }`}
        >
          <div className={"dark-tooltip-content text-black dark:text-white"}>
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

export default DarkToolTip;
