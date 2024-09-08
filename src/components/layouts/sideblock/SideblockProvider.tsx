import React, { type FC } from "react";
import AppOverlay from "@/components/widgets/AppOverlay";
import { MenuContextProvider } from "@/context/MenuContext";
import { AppNavbar } from "../shared/sidebar/AppNavbar";
import { Menu } from "../shared/sidebar/Menu";
import { HeaderPanels } from "../shared/HeaderPanels";
interface ProviderProps {
  fullwidth?: boolean;
  horizontal?: boolean;
}
const SideblockProvider: FC<ProviderProps> = ({
  fullwidth = false,
  horizontal = false,
}) => {
  return (
    <>
      <MenuContextProvider>
        <Menu sideblock />
      </MenuContextProvider>

      <AppNavbar
        fullwidth={fullwidth ? fullwidth : false}
        horizontal={horizontal ? horizontal : false}
        sideblock
      />

      <HeaderPanels />

      <AppOverlay />
    </>
  );
};
export default SideblockProvider;
