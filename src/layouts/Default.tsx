import React, { type FC, useMemo } from "react";
import Head from "next/head";
import {
  layoutWrapperClasses,
  layoutNotPushedClasses,
  layoutPushedClasses,
} from "@/components/layouts/styles";
import TopNavigationProvider from "@/components/layouts/top-navigation/TopNavigationProvider";
import SidebarPanelProvider from "@/components/layouts/sidebar-panel/SidebarPanelProvider";
import SidebarPanelFloatProvider from "@/components/layouts/sidebar-panel-float/SidebarPanelFloatProvider";
import { useDashboardStore } from "@/stores/dashboard";
import { useLayoutStore } from "@/stores/layout";
import LayoutSwitcher from "@/components/layouts/LayoutSwitcher";
import PageTransition from "@/components/elements/PageTransition";

type LayoutColors = "default" | "muted";
interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  color?: LayoutColors;
  fullwidth?: boolean;
  horizontal?: boolean;
  nopush?: boolean;
}

const siteTitle = process.env.NEXT_PUBLIC_SITE_NAME;
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION;

const Layout: FC<LayoutProps> = ({
  children,
  title = siteTitle,
  description = siteDescription,
  color = "default",
  fullwidth = false,
  horizontal = false,
  nopush = false,
}) => {
  const { sidebarOpened, settings } = useDashboardStore();
  const { activeLayout } = useLayoutStore();

  const wrapperClass = useMemo(
    () => `${activeLayout.toLowerCase()}-wrapper`,
    [activeLayout]
  );

  const layoutProvider = useMemo(() => {
    switch (activeLayout) {
      case "sidebar-panel":
        return (
          <SidebarPanelProvider
            fullwidth={fullwidth}
            horizontal={horizontal}
            nopush={nopush}
          />
        );
      case "sidebar-panel-float":
        return (
          <SidebarPanelFloatProvider
            fullwidth={fullwidth}
            horizontal={horizontal}
            nopush={nopush}
          />
        );
      case "top-navigation":
        return (
          <TopNavigationProvider
            fullwidth={fullwidth}
            horizontal={horizontal}
          />
        );
      default:
        return null;
    }
  }, [activeLayout, fullwidth, horizontal, nopush]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="locale" content="en US" />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <meta name="twitter:card" content="summary large image" />
        <meta property="og:height" content="630" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:type" content="website" />

        <link rel="manifest" href="/manifest.json" />

        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href={settings?.appleIcon57 || "/img/logo/apple-icon-57x57.webp"}
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href={settings?.appleIcon60 || "/img/logo/apple-icon-60x60.webp"}
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href={settings?.appleIcon72 || "/img/logo/apple-icon-72x72.webp"}
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href={settings?.appleIcon76 || "/img/logo/apple-icon-76x76.webp"}
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href={settings?.appleIcon114 || "/img/logo/apple-icon-114x114.webp"}
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href={settings?.appleIcon120 || "/img/logo/apple-icon-120x120.webp"}
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href={settings?.appleIcon144 || "/img/logo/apple-icon-144x144.webp"}
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href={settings?.appleIcon152 || "/img/logo/apple-icon-152x152.webp"}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={settings?.appleIcon180 || "/img/logo/apple-icon-180x180.webp"}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href={
            settings?.androidIcon192 || "/img/logo/android-icon-192x192.webp"
          }
        />
        <link
          rel="icon"
          type="image/png"
          sizes="256x256"
          href={
            settings?.androidIcon256 || "/img/logo/android-icon-256x256.webp"
          }
        />
        <link
          rel="icon"
          type="image/png"
          sizes="384x384"
          href={
            settings?.androidIcon384 || "/img/logo/android-icon-384x384.webp"
          }
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href={
            settings?.androidIcon512 || "/img/logo/android-icon-512x512.webp"
          }
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={settings?.favicon32 || "/img/logo/favicon-32x32.webp"}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href={settings?.favicon96 || "/img/logo/favicon-96x96.webp"}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={settings?.favicon16 || "/img/logo/favicon-16x16.webp"}
        />
        <meta
          name="msapplication-TileImage"
          content={settings?.msIcon144 || "/img/logo/ms-icon-144x144.webp"}
        />

        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <div
        className={`min-h-screen overflow-hidden transition-all duration-300 dark:bg-muted-900 ${
          color === "muted" ? "bg-muted-50" : "bg-white"
        }`}
      >
        {layoutProvider}

        <div
          className={`${wrapperClass} relative min-h-screen transition-all duration-300 dark:bg-muted-950/[0.96] ${
            layoutWrapperClasses[activeLayout]
          } ${
            sidebarOpened && !nopush
              ? "is-pushed " + layoutPushedClasses[activeLayout]
              : layoutNotPushedClasses[activeLayout]
          } ${color === "muted" ? "bg-muted-50/[0.96]" : "bg-white/[0.96]"}
    ${horizontal ? "!pb-0 !pe-0 !pt-0" : ""}`}
        >
          <LayoutSwitcher />
          <div
            className={`${fullwidth ? "max-w-full" : "mx-auto max-w-7xl"} ${
              horizontal
                ? "flex h-full min-h-screen flex-col [&>div]:h-full [&>div]:min-h-screen"
                : ""
            }`}
          >
            <div className={`${horizontal ? "" : "pb-20 pt-4"}`}>
              <PageTransition>{children}</PageTransition>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
