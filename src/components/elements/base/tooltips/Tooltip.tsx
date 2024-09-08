import { type FC, type ReactNode, useState } from "react";

interface Props {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom" | "start" | "end";
  classNames?: string;
}

const ToolTip: FC<Props> = ({
  children,
  content,
  position = "top",
  classNames,
}): JSX.Element => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={"tooltip-wrapper"}>
      <div
        className={"tooltip-children"}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </div>

      {isHovered && (
        <div
          className={`tooltip tooltip-${position} ${
            classNames ? classNames : ""
          }`}
        >
          <div className={"tooltip-content"}>{content}</div>
        </div>
      )}
    </div>
  );
};

export default ToolTip;
