import React, { type FC } from "react";
import { AppNavbar } from "../shared/sidebar/AppNavbar";
import AppOverlay from "@/components/widgets/AppOverlay";
import { Menu } from "../shared/sidebar/Menu";
import IconSidebar from "../shared/sidebar/IconSidebar";
import { MenuContextProvider } from "@/context/MenuContext";
import { HeaderPanels } from "../shared/HeaderPanels";

interface ProviderProps {
  fullwidth?: boolean;
  horizontal?: boolean;
  nopush?: boolean;
}
const SidebarPanelProvider: FC<ProviderProps> = ({
  fullwidth = false,
  horizontal = false,
  nopush = false,
}) => {
  return (
    <>
      <IconSidebar />

      <MenuContextProvider>
        <Menu />
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
export default SidebarPanelProvider;
