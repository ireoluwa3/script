import React, { type FC } from "react";
import AppNavbar from "./AppNavbar";
import TopNavbar from "./TopNavbar";
import MediaQuery from "react-responsive";
import { breakpoints } from "@/utils/breakpoints";
import { HeaderPanels } from "../shared/HeaderPanels";

interface ProviderProps {
  fullwidth?: boolean;
  horizontal?: boolean;
  trading?: boolean;
  transparent?: boolean;
}

const TopNavigationProvider: FC<ProviderProps> = ({
  fullwidth = false,
  horizontal = false,
  trading = false,
  transparent = false,
}) => {
  return (
    <>
      <TopNavbar trading={trading} transparent={transparent} />
      {!trading && (
        <MediaQuery maxWidth={parseInt(breakpoints.lg) - 1}>
          <AppNavbar fullwidth={fullwidth} horizontal={horizontal} />
        </MediaQuery>
      )}
      <HeaderPanels />
    </>
  );
};

export default TopNavigationProvider;
