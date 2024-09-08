import React, { useState, useEffect, useRef, FC, type ReactNode } from "react";
import { Icon, type IconifyIcon } from "@iconify/react";
import { navItemBaseStyles } from "./NavbarItem";
import { useTranslation } from "next-i18next";

interface NavDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: IconifyIcon | string;
  title: string;
  children?: ReactNode;
  isActive?: boolean;
  nested?: boolean;
  description?: string;
}

const NavDropdown: FC<NavDropdownProps> = ({
  icon,
  title,
  children,
  className: classes = "",
  isActive = false,
  nested = false, // Defaults to false if not specified
  description,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Listen for clicks outside of the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <div
      className={`relative flex-shrink-0 flex-grow-0 items-stretch space-x-1 lg:flex ${
        nested && isOpen ? "lg:relative" : ""
      }`}
      ref={dropdownRef}
    >
      <a
        className={`${navItemBaseStyles} relative flex w-full cursor-pointer items-center justify-between ${
          isOpen ? "bg-muted-100 text-primary-500 dark:bg-muted-800" : ""
        } ${isActive ? "rounded-none lg:rounded-lg" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <Icon icon={icon} className={`h-5 w-5`} />
          <div className="ml-3 flex flex-col">
            <span className="text-sm">{t(title)}</span>
            {description && (
              <span className="text-xs text-muted-400 dark:text-muted-500 leading-none">
                {t(description)}
              </span>
            )}
          </div>
        </div>
        <Icon
          icon="mdi:chevron-down"
          className={`h-5 w-5 transition-transform ${
            isOpen
              ? nested
                ? "lg:rotate-[-90deg] rotate-180"
                : "rotate-180"
              : nested
              ? "lg:rotate-90 rotate-0"
              : "rotate-0"
          }`}
        />
      </a>
      <div
        className={`z-20 ${
          isOpen ? "block" : "hidden"
        } min-w-[220px] rounded-md py-2 text-[.7rem] shadow-lg transition-[opacity,transform] duration-[86ms] lg:absolute ${
          nested ? "lg:start-full lg:top-0" : "lg:start-0 lg:top-full"
        } lg:border lg:border-muted-200 lg:bg-white lg:dark:border-muted-800 lg:dark:bg-muted-950 [&>*]:mx-2.5 ${classes}`}
      >
        {children}
      </div>
    </div>
  );
};

export default NavDropdown;
