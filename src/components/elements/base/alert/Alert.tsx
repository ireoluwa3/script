import React, { type FC, useState } from "react";
import { Icon, type IconifyIcon } from "@iconify/react";
import { motion } from "framer-motion";

interface AlertProps {
  children?: React.ReactNode;
  icon?: string | IconifyIcon;
  label?: string | React.ReactNode;
  sublabel?: string | React.ReactNode;
  color?:
    | "default"
    | "contrast"
    | "muted"
    | "mutedContrast"
    | "primary"
    | "info"
    | "success"
    | "warning"
    | "danger"
    | undefined
    | null;
  shape?: "straight" | "rounded" | "rounded-sm" | "smooth" | "curved";
  className?: string;
  iconClassName?: string;
  style?: React.CSSProperties;
  canClose?: boolean;
  onClose?: () => void;
  button?: React.ReactNode;
}

const Alert: FC<AlertProps> = ({
  children,
  icon,
  label,
  sublabel,
  color = "default",
  shape = "smooth",
  className,
  iconClassName,
  style,
  canClose = true,
  onClose,
  button,
}) => {
  const [visible, setVisible] = useState(true);
  const removeAlert = () => {
    setVisible((prev) => !prev);
    if (onClose) {
      onClose();
    }
  };
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full`}
    >
      <div style={style}>
        {visible ? (
          <div
            className={`${className} flex items-center gap-2 border py-3 pe-2 ps-4
        ${shape === "rounded-sm" ? "rounded-sm" : ""}
        ${shape === "rounded" ? "rounded-md" : ""}
        ${shape === "smooth" ? "rounded-lg" : ""}
        ${shape === "curved" ? "rounded-xl" : ""}
        ${
          color === "default"
            ? "border-muted-300 bg-white text-muted-800 dark:border-muted-700 dark:bg-muted-800 dark:text-muted-100"
            : ""
        }
        ${
          color === "contrast"
            ? "border-muted-300 bg-white text-muted-800 dark:border-muted-800 dark:bg-muted-900 dark:text-muted-100"
            : ""
        }
        ${
          color === "muted"
            ? "border-muted-300 bg-muted-200 text-muted-800 dark:border-muted-700 dark:bg-muted-800 dark:text-muted-100"
            : ""
        }
        ${
          color === "mutedContrast"
            ? "border-muted-300 bg-muted-200 text-muted-800 dark:border-muted-800 dark:bg-muted-900 dark:text-muted-100"
            : ""
        }
        ${
          color === "primary"
            ? "border-primary-500 bg-primary-500/10 text-primary-500"
            : ""
        }
        ${
          color === "info" ? "border-info-500 bg-info-500/10 text-info-500" : ""
        }
        ${
          color === "success"
            ? "border-success-500 bg-success-500/10 text-success-500"
            : ""
        }
        ${
          color === "warning"
            ? "border-warning-500 bg-warning-500/10 text-warning-500"
            : ""
        }
        ${
          color === "danger"
            ? "border-danger-500 bg-danger-500/10 text-danger-500"
            : ""
        }
      `}
          >
            {children ? (
              <>{children}</>
            ) : (
              <div className="flex items-center gap-3 w-full ">
                {icon ? (
                  <Icon
                    height={24}
                    width={24}
                    icon={icon}
                    className={iconClassName}
                  />
                ) : (
                  ""
                )}
                <div className="w-full">
                  {label ? (
                    <div
                      className={`font-semibold text-sm mb-1
                    ${
                      color === "default"
                        ? "text-muted-900 dark:text-muted-100"
                        : ""
                    }
                    ${
                      color === "contrast"
                        ? "text-muted-900 dark:text-muted-100"
                        : ""
                    }
                    ${
                      color === "muted"
                        ? "text-muted-900 dark:text-muted-100"
                        : ""
                    }
                    ${
                      color === "mutedContrast"
                        ? "text-muted-900 dark:text-muted-100"
                        : ""
                    }
                    ${color === "primary" ? "text-primary-500" : ""}
                    ${color === "info" ? "text-info-500" : ""}
                    ${color === "success" ? "text-success-500" : ""}
                    ${color === "warning" ? "text-warning-500" : ""}
                    ${color === "danger" ? "text-danger-500" : ""}
                  `}
                    >
                      {label}
                    </div>
                  ) : (
                    ""
                  )}
                  {sublabel ? (
                    <div
                      className={`text-xs
                    ${
                      color === "default"
                        ? "text-muted-700 dark:text-muted-200"
                        : ""
                    }
                    ${
                      color === "contrast"
                        ? "text-muted-700 dark:text-muted-200"
                        : ""
                    }
                    ${
                      color === "muted"
                        ? "text-muted-700 dark:text-muted-200"
                        : ""
                    }
                    ${
                      color === "mutedContrast"
                        ? "text-muted-700 dark:text-muted-200"
                        : ""
                    }
                    ${color === "primary" ? "text-primary-500" : ""}
                    ${color === "info" ? "text-info-500" : ""}
                    ${color === "success" ? "text-success-500" : ""}
                    ${color === "warning" ? "text-warning-500" : ""}
                    ${color === "danger" ? "text-danger-500" : ""}
                  `}
                    >
                      {sublabel}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 ms-auto">
              <div className={canClose ? "" : "me-2"}>{button}</div>
              {canClose && (
                <button
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-none bg-none transition-colors duration-300
            ${
              color === "default"
                ? "text-muted-500 hover:bg-muted-100 dark:text-muted-200 dark:hover:bg-muted-700"
                : ""
            }
            ${
              color === "contrast"
                ? "text-muted-500 hover:bg-muted-100 dark:text-muted-100 dark:hover:bg-muted-800"
                : ""
            }
            ${
              color === "muted"
                ? "text-muted-700 hover:bg-muted-100 dark:text-muted-200 dark:hover:bg-muted-700"
                : ""
            }
            ${
              color === "mutedContrast"
                ? "text-muted-700 hover:bg-muted-100 dark:text-muted-200 dark:hover:bg-muted-800"
                : ""
            }
            ${
              color === "primary"
                ? "text-primary-500 hover:bg-primary-500/20"
                : ""
            }
            ${color === "info" ? "text-info-500 hover:bg-info-500/20" : ""}
            ${
              color === "success"
                ? "text-success-500 hover:bg-success-500/20"
                : ""
            }
            ${
              color === "warning"
                ? "text-warning-500 hover:bg-warning-500/20"
                : ""
            }
            ${
              color === "danger" ? "text-danger-500 hover:bg-danger-500/20" : ""
            }
        `}
                  onClick={removeAlert}
                >
                  <Icon height={14} width={14} icon="lucide:x" />
                </button>
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </motion.div>
  );
};

export default Alert;
