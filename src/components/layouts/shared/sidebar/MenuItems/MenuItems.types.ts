export interface MenuItemsProps {
  menuId: string;
  activeMenuKey: string;
  menuItems?: {
    title: string;
    icon: string;
    href?: string;
    subMenu?: Array<{
      title: string;
      href: string;
    }>;
  }[];
  specialRender?: () => JSX.Element;
  collapse?: boolean;
  sideblock?: boolean;
}
