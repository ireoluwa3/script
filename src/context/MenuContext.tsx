import React, { createContext, useContext, useState } from "react";

type MenuContextType = ReturnType<typeof useMenu>;

const useMenu = () => {
  const [activeSidebarMenu, setActiveSidebarMenu] = useState("");

  return {
    activeSidebarMenu,
    setActive: (menu: string) => setActiveSidebarMenu(menu),
  };
};

export const MenuContext = createContext<MenuContextType | null>(null);

export const MenuContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <MenuContext.Provider value={useMenu()}>{children}</MenuContext.Provider>
  );
};

export const useMenuContext = () => {
  const menuContext = useContext(MenuContext);
  if (!menuContext) {
    throw new Error(
      "Ensure useMenuContext is used within <MenuContextProvider>"
    );
  }

  return menuContext;
};
