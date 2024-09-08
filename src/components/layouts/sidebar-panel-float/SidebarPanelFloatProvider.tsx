import React, { type FC } from "react";
import { Menu } from "../shared/sidebar/Menu";
import AppOverlay from "@/components/widgets/AppOverlay";
import { AppNavbar } from "../shared/sidebar/AppNavbar";
import IconSidebar from "../shared/sidebar/IconSidebar";
import { MenuContextProvider } from "@/context/MenuContext";
import { HeaderPanels } from "../shared/HeaderPanels";
interface ProviderProps {
  fullwidth?: boolean;
  horizontal?: boolean;
  nopush?: boolean;
}
const SidebarPanelFloatProvider: FC<ProviderProps> = ({
  fullwidth = false,
  horizontal = false,
  nopush = false,
}) => {
  return (
    <>
      <IconSidebar float />

      <MenuContextProvider>
        <Menu float />
      </MenuContextProvider>

      <AppNavbar
        fullwidth={fullwidth ? fullwidth : false}
        horizontal={horizontal ? horizontal : false}
        nopush={nopush ? nopush : false}
      />

      <HeaderPanels />

      <AppOverlay />
    </>
  );
};
export default SidebarPanelFloatProvider;
