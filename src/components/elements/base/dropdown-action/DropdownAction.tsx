import React, { type FC } from "react";
import { Icon, type IconifyIcon } from "@iconify/react";
import Dropdown from "@/components/elements/base/dropdown/Dropdown";

interface DropdownActionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showAll?: string;
  orientation?: "start" | "end";
  toggleIcon?: string | IconifyIcon;
  toggleImage?: React.ReactNode;
  canRotate?: boolean;
  width?: number;
}

const DropdownAction: FC<DropdownActionProps> = ({
  title,
  orientation,
  showAll,
  toggleIcon = "lucide:more-horizontal",
  toggleImage,
  children,
  className: classes = "",
  canRotate = false,
  width = 240,
}) => {
  return (
    <Dropdown
      title={title ?? ""}
      indicator={false}
      showAll={showAll ?? ""}
      orientation={orientation}
      canRotate={canRotate}
      toggleIcon={toggleIcon}
      toggleClassNames="border-muted-200 dark:border-transparent shadow-lg shadow-muted-300/30 dark:shadow-muted-800/30 dark:hover:bg-muted-900 border dark:hover:border-muted-800 rounded-full"
      toggleImage={
        toggleImage ? (
          <>{toggleImage}</>
        ) : (
          <Icon
            icon={toggleIcon}
            className="h-5 w-5 text-muted-400 transition-colors duration-300 group-hover:text-primary-500"
          />
        )
      }
      className={`${classes}`}
      width={width}
    >
      {children}
    </Dropdown>
  );
};

export default DropdownAction;
