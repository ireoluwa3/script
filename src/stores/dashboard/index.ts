import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { debounce } from "lodash";
import { adminMenu, userMenu } from "@/data/constants/menu";
import $fetch from "@/utils/api";

const defaultTheme = process.env.NEXT_PUBLIC_DEFAULT_THEME || "system";
export const THEME_KEY = "theme";
type User = {
  id: string;
  email: string;
  avatar: string | null;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  phone: string | null;
  roleId: number;
  profile?: string | null;
  metadata: {
    location: {
      address: string;
      country: string;
      city: string;
      zip: string;
    };
    social: {
      facebook: string;
      twitter: string;
      dribbble: string;
      instagram: string;
      github: string;
      gitlab: string;
    };
    bio: string | null;
  };
  lastLogin: string | null;
  lastFailedLogin: string | null;
  failedLoginAttempts: number;
  walletAddress: string | null;
  walletProvider: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  role: {
    id: number;
    name: string;
    permissions: string[];
  };
  twoFactor: string | null;
  kyc: {
    status: string;
    level: string;
  } | null;
  author: {
    id: string;
    status: string;
  } | null;
  providerUsers: {
    provider: string;
  }[];
};

const readMode = () => {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    const setting = localStorage.getItem(THEME_KEY) || `${defaultTheme}`;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return setting === "dark" || (prefersDark && setting !== "light");
  } catch {
    return false;
  }
};

type DashboardStore = {
  profile: User | null;
  settings: any | null;
  extensions: any | null;
  notifications: any[];
  announcements: any[];
  filteredMenu: any[];
  isFetched: boolean;
  isPanelOpened: boolean;
  sidebarOpened: boolean;
  panels: { [key: string]: boolean };
  isProfileOpen: boolean;
  isSidebarOpenedMobile: boolean;
  activeSidebar: string;
  isDark: boolean;
  isAdmin: boolean;
  activeMenuType: "user" | "admin";
  walletConnected: boolean;

  setIsFetched: (value: boolean) => void;
  setIsPanelOpened: (isOpen: boolean) => void;
  fetchProfile: () => void;
  fetchSettings: () => void;
  checkPermission: (permissions?: string[], rolePermissions?: any[]) => boolean;

  setFetchInitiated: (value: boolean) => void;
  setFilteredMenu: (menu: any[]) => void;
  setProfile: (profile: User | null) => void;
  setActiveSidebar: (s: string) => void;
  setPanelOpen: (title: string, isOpen: boolean) => void;
  setIsSidebarOpenedMobile: (b: boolean) => void;
  setSidebarOpened: (b: boolean) => void;
  setIsProfileOpen: (b: boolean) => void;
  toggleTheme: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: (type: string) => void;
  store: (stateKey: string, data: any) => void;
  update: (stateKey: string, id: string | string[], data: any) => void;
  delete: (stateKey: string, id: string | string[]) => void;
  updateProfile2FA: (status: boolean) => void;
  toggleMenuType: () => void;
  setWalletConnected: (value: boolean) => void;
  initializeMenu: () => void;

  getSetting: (key: string) => any;
  hasExtension: (name: string) => boolean;
  filterMenu: (menu: any[]) => any[];
};

export const useDashboardStore = create<DashboardStore>()(
  immer((set, get) => {
    const loadMenuTypeFromStorage = () => {
      if (typeof window !== "undefined") {
        try {
          const storedMenuType = localStorage.getItem("menuType");
          return storedMenuType === "admin" ? "admin" : "user";
        } catch (error) {
          console.error("Error loading menu type from localStorage:", error);
          return "user";
        }
      }
      return "user";
    };

    const saveMenuTypeToStorage = (menuType: string) => {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("menuType", menuType);
        } catch (error) {
          console.error("Error saving menu type to localStorage:", error);
        }
      }
    };

    const initialMenuType: "user" | "admin" = loadMenuTypeFromStorage();
    const initialFilteredMenu = [];

    return {
      profile: null,
      settings: null,
      extensions: null,
      notifications: [],
      announcements: [],
      filteredMenu: initialFilteredMenu,
      isFetched: false,
      isPanelOpened: false,
      sidebarOpened: false,
      panels: {},
      isProfileOpen: false,
      isSidebarOpenedMobile: false,
      activeSidebar: "",
      isDark: readMode(),
      isAdmin: false,
      activeMenuType: initialMenuType,
      walletConnected: false,

      toggleMenuType: () => {
        set((state) => {
          const newMenuType =
            state.activeMenuType === "user" ? "admin" : "user";
          const menuToFilter = newMenuType === "admin" ? adminMenu : userMenu;
          const newFilteredMenu = state.filterMenu(menuToFilter);
          state.activeMenuType = newMenuType;
          state.filteredMenu = newFilteredMenu;
          saveMenuTypeToStorage(newMenuType);
        });
      },

      filterMenu: (menu) => {
        const {
          profile,
          checkPermission,
          hasExtension,
          getSetting,
          settings,
          extensions,
        } = get();
        if (!settings || !extensions) return []; // Ensure settings and extensions are available

        return menu
          .filter((menuItem) => {
            const hasPermission =
              menuItem.auth === false
                ? !profile
                : menuItem.auth
                ? profile &&
                  checkPermission(menuItem.permission, profile.role.permissions)
                : true;
            const hasRequiredExtension =
              !menuItem.extension || hasExtension(menuItem.extension);
            const hasRequiredSetting =
              !menuItem.settings ||
              menuItem.settings.every(
                (setting) => getSetting(setting) === "true"
              );
            const isEnvValid = !menuItem.env || menuItem.env === "true";

            return (
              hasPermission &&
              hasRequiredExtension &&
              hasRequiredSetting &&
              isEnvValid
            );
          })
          .map((menuItem) => ({
            ...menuItem,
            menu: menuItem.menu
              ?.filter((subItem) => {
                const hasSubPermission =
                  subItem.auth === false
                    ? !profile
                    : subItem.auth
                    ? profile &&
                      checkPermission(
                        subItem.permission,
                        profile.role.permissions
                      )
                    : true;
                const hasSubExtension =
                  !subItem.extension || hasExtension(subItem.extension);
                const hasSubSetting =
                  !subItem.settings ||
                  subItem.settings.every(
                    (setting) => getSetting(setting) === "true"
                  );
                const isSubEnvValid = !subItem.env || subItem.env === "true";

                return (
                  hasSubPermission &&
                  hasSubExtension &&
                  hasSubSetting &&
                  isSubEnvValid
                );
              })
              .map((subItem) => ({
                ...subItem,
                subMenu: subItem.subMenu?.filter((subMenuItem) => {
                  const hasSubMenuPermission =
                    subMenuItem.auth === false
                      ? !profile
                      : subMenuItem.auth
                      ? profile &&
                        checkPermission(
                          subMenuItem.permission,
                          profile.role.permissions
                        )
                      : true;
                  const hasSubMenuExtension =
                    !subMenuItem.extension ||
                    hasExtension(subMenuItem.extension);
                  const hasSubMenuSetting =
                    !subMenuItem.settings ||
                    subMenuItem.settings.every(
                      (setting) => getSetting(setting) === "true"
                    );
                  const isSubMenuEnvValid =
                    !subMenuItem.env || subMenuItem.env === "true";

                  return (
                    hasSubMenuPermission &&
                    hasSubMenuExtension &&
                    hasSubMenuSetting &&
                    isSubMenuEnvValid
                  );
                }),
              })),
          }));
      },

      fetchProfile: debounce(async () => {
        const {
          setProfile,
          checkPermission,
          setFetchInitiated,
          setFilteredMenu,
          filterMenu,
          activeMenuType,
          fetchSettings,
          settings,
        } = get();

        setFetchInitiated(true);

        if (!settings) {
          await fetchSettings();
        }

        const { data, error } = await $fetch({
          url: "/api/user/profile",
          method: "GET",
          silent: true,
        });

        if (!error && data) {
          const { profile, ...rest } = data;
          setProfile({
            ...rest,
            metadata: profile ? JSON.parse(profile) : null,
          });

          const walletProvider = rest.providerUsers.find(
            (provider) => provider.provider === "WALLET"
          );

          const hasAdminAccess = adminMenu.some((menuItem: IMenu) =>
            checkPermission(menuItem.permission, data.role.permissions)
          );

          const newFilteredMenu = filterMenu(
            hasAdminAccess && activeMenuType === "admin" ? adminMenu : userMenu
          );

          set((state) => {
            state.isAdmin = hasAdminAccess;
            state.walletConnected = !!walletProvider;
            state.isFetched = true;
          });

          setFilteredMenu(newFilteredMenu);
        } else {
          const newFilteredMenu = filterMenu(userMenu);
          setFilteredMenu(newFilteredMenu);
          set((state) => {
            state.isFetched = true;
          });
        }
      }, 5),

      fetchSettings: async () => {
        const { data, error } = await $fetch({
          url: "/api/settings",
          silent: true,
        });

        if (data && !error) {
          set((state) => {
            state.extensions = data.extensions;
            state.settings = data.settings.reduce((acc, setting) => {
              acc[setting.key] = setting.value;
              return acc;
            }, {}); // Provide an initial value of an empty object
          });

          // Initialize menu after settings are fetched
          get().initializeMenu();
        }
      },

      initializeMenu: () => {
        const { filterMenu, activeMenuType } = get();
        const menuToFilter = activeMenuType === "admin" ? adminMenu : userMenu;
        const filteredMenu = filterMenu(menuToFilter);
        set({ filteredMenu });
      },

      setWalletConnected: (value) => {
        set((state) => {
          state.walletConnected = value;
        });
      },

      getSetting: (key) => {
        const { settings } = get();
        if (!settings) return null;
        return settings[key];
      },

      hasExtension: (name) => {
        const { extensions } = get();
        if (!extensions) return false;
        return extensions.includes(name);
      },

      setIsPanelOpened: (isOpen) => {
        set((state) => {
          state.isPanelOpened = isOpen;
        });
      },

      setIsFetched: (value) => {
        set((state) => {
          state.isFetched = value;
        });
      },

      updateProfile2FA: async (status) => {
        const { profile } = get();
        if (!profile || !profile.twoFactor) return;
        const { error } = await $fetch({
          url: "/api/auth/otp/toggle",
          method: "POST",
          body: { status },
          silent: true,
        });

        if (!error) {
          set((state: any) => {
            state.profile.twoFactor.enabled = status;
          });
        }
      },

      toggleTheme: () => {
        const { isDark } = get();
        const currentTheme = isDark;
        const newTheme = !currentTheme;
        localStorage.setItem(THEME_KEY, newTheme ? "dark" : "light");
        set({ isDark: newTheme });

        const rootClass = document.documentElement.classList;
        rootClass.add("no-transition");
        if (newTheme) {
          rootClass.add("dark");
        } else {
          rootClass.remove("dark");
        }
        setTimeout(() => {
          rootClass.remove("no-transition");
        }, 0);
      },

      checkPermission: (permissions, rolePermissions) => {
        const { profile } = get();

        if (!profile) return false;
        if (profile.role.name === "Super Admin") return true;
        if (!permissions || permissions.length === 0) return true;

        return permissions.every((perm) =>
          rolePermissions?.some((rp) => rp.name === perm)
        );
      },

      setFetchInitiated: (value) => {
        set((state) => {
          state.isFetched = value;
        });
      },

      setFilteredMenu: (menu) => {
        set((state) => {
          state.filteredMenu = menu;
        });
      },

      setProfile: (profile) => {
        set((state) => {
          state.profile = profile;
        });
      },

      setActiveSidebar: (s) => {
        set((state) => {
          state.activeSidebar = s;
        });
      },

      setPanelOpen: (title, isOpen) => {
        set((state) => {
          state.panels[title] = isOpen;
        });
      },

      setIsSidebarOpenedMobile: (b) => {
        set((state) => {
          state.isSidebarOpenedMobile = b;
        });
      },

      setSidebarOpened: (b) => {
        set((state) => {
          state.sidebarOpened = b;
        });
      },

      setIsProfileOpen: (b) => {
        set((state) => {
          state.isProfileOpen = b;
        });
      },

      removeNotification: async (id) => {
        const { error } = await $fetch({
          url: `/api/user/notification/${id}`,
          method: "DELETE",
          silent: true,
        });

        if (!error) {
          set((state) => {
            state.notifications = state.notifications.filter(
              (n) => n.id !== id
            );
          });
        }
      },

      clearNotifications: async (type) => {
        const { error } = await $fetch({
          url: "/api/user/notification/clean",
          method: "DELETE",
          silent: true,
          params: { type },
        });

        if (!error) {
          set((state) => ({
            notifications: state.notifications.filter(
              (notification) =>
                notification.type.toLowerCase() !== type.toLowerCase()
            ),
          }));
        }
      },

      store: (stateKey, data) => {
        set((state) => {
          state[stateKey] = Array.isArray(data)
            ? [...state[stateKey], ...data]
            : [...state[stateKey], data];
        });
      },

      update: (stateKey, id, data) => {
        set((state) => {
          const ids = Array.isArray(id) ? id : [id];
          state[stateKey] = state[stateKey].map((item) =>
            ids.includes(item.id) ? { ...item, ...data } : item
          );
        });
      },

      delete: (stateKey, id) => {
        set((state) => {
          const ids = Array.isArray(id) ? id : [id];
          state[stateKey] = state[stateKey].filter(
            (item) => !ids.includes(item.id)
          );
        });
      },
    };
  })
);
