export interface TopBarProps {
  float?: boolean;
  sidebarOpened: boolean;
  isSidebarOpenedMobile: boolean;
  setIsSidebarOpenedMobile: (isOpen: boolean) => void;
  setSidebarOpened: (isOpen: boolean) => void;
}
