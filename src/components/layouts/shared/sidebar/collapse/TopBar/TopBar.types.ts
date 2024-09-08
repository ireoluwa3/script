export interface TopBarProps {
  collapse: boolean;
  sidebarOpened: boolean;
  setIsSidebarOpenedMobile: (isOpen: boolean) => void;
  collapseSidebarToggle: () => void;
}
