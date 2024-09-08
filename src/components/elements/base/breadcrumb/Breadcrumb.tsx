import React, { type FC, memo } from "react";
import { Icon, type IconifyIcon } from "@iconify/react";

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: "slash" | "chevron" | "arrow" | "dot";
}

type BreadcrumbItem = {
  title: string;
  href?: string;
  icon?: IconifyIcon | string;
};

const Breadcrumb: FC<BreadcrumbProps> = ({ items, separator = "slash" }) => {
  return (
    <div>
      <ol
        className="flex min-w-0 items-center whitespace-nowrap"
        aria-label="Breadcrumb"
      >
        {items.map((item, index) => (
          <li
            key={index}
            className={`text-sm ${
              items.length - 1 === index
                ? "text-primary-500 dark:text-primary-400"
                : "text-muted"
            }`}
          >
            {items.length - 1 !== index ? (
              <span className="flex items-center pointer-events-none">
                {item.icon ? (
                  <Icon icon={item.icon} className="me-1 h-4 w-4 shrink-0" />
                ) : (
                  ""
                )}
                <span>{item.title}</span>

                {separator === "slash" ? (
                  <svg
                    className="mx-2 h-5 w-5 flex-shrink-0 text-muted-400 dark:text-muted-600"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 13L10 3"
                      stroke="currentColor"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  ""
                )}
                {separator === "chevron" ? (
                  <svg
                    className="mx-2 h-3 w-3 flex-shrink-0 text-muted-400 dark:text-muted-600"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  ""
                )}
                {separator === "dot" ? (
                  <svg
                    className="mx-2 h-3 w-3 flex-shrink-0 text-muted-400 dark:text-muted-600"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12.1"
                      cy="12.1"
                      r="1"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                ) : (
                  ""
                )}
                {separator === "arrow" ? (
                  <svg
                    className="mx-3 h-4 w-4 flex-shrink-0 text-muted-400 dark:text-muted-600"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 12h14m-7-7l7 7l-7 7"
                    />
                  </svg>
                ) : (
                  ""
                )}
              </span>
            ) : (
              <div className="flex items-center pointer-events-noned">
                {item.icon ? (
                  <Icon icon={item.icon} className="me-1 h-4 w-4 shrink-0" />
                ) : (
                  ""
                )}
                <span>{item.title}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default memo(Breadcrumb);
