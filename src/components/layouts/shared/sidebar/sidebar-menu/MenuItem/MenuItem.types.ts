import { IconifyIcon } from "@iconify/react";

export interface MenuItemProps {
  href?: string;
  title: string;
  icon: string | IconifyIcon;
  children?: React.ReactNode;
  collapse?: boolean;
  active?: boolean;
  sideblock?: boolean;
  description?: string;
}
