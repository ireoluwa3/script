"use client";
import React, { type FC, lazy } from "react";
import Head from "next/head";
import {
  layoutNotPushedClasses,
  layoutPushedClasses,
} from "@/components/layouts/styles";
import { useDashboardStore } from "@/stores/dashboard";
import PageTransition from "@/components/elements/PageTransition";
import TopNavigationProvider from "@/components/layouts/top-navigation/TopNavigationProvider";

type LayoutColors = "default" | "muted";
interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  color?: LayoutColors;
  fullwidth?: boolean;
  horizontal?: boolean;
  nopush?: boolean;
  fixed?: boolean;
  transparent?: boolean;
  darker?: boolean;
}

const siteTitle = process.env.NEXT_PUBLIC_SITE_NAME || "Default Site Title";
const siteDescription =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Default Site Description";

const Layout: FC<LayoutProps> = ({
  children,
  title = siteTitle,
  description = siteDescription,
  color = "default",
  fullwidth = false,
  horizontal = false,
  nopush = false,
  transparent = false,
  darker = false,
}) => {
  const { sidebarOpened, settings } = useDashboardStore();

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

        {[
          {
            size: "57x57",
            src: settings?.appleIcon57 || "/img/logo/apple-icon-57x57.webp",
          },
          {
            size: "60x60",
            src: settings?.appleIcon60 || "/img/logo/apple-icon-60x60.webp",
          },
          {
            size: "72x72",
            src: settings?.appleIcon72 || "/img/logo/apple-icon-72x72.webp",
          },
          {
            size: "76x76",
            src: settings?.appleIcon76 || "/img/logo/apple-icon-76x76.webp",
          },
          {
            size: "114x114",
            src: settings?.appleIcon114 || "/img/logo/apple-icon-114x114.webp",
          },
          {
            size: "120x120",
            src: settings?.appleIcon120 || "/img/logo/apple-icon-120x120.webp",
          },
          {
            size: "144x144",
            src: settings?.appleIcon144 || "/img/logo/apple-icon-144x144.webp",
          },
          {
            size: "152x152",
            src: settings?.appleIcon152 || "/img/logo/apple-icon-152x152.webp",
          },
          {
            size: "180x180",
            src: settings?.appleIcon180 || "/img/logo/apple-icon-180x180.webp",
          },
          {
            size: "192x192",
            src:
              settings?.androidIcon192 || "/img/logo/android-icon-192x192.webp",
          },
          {
            size: "256x256",
            src:
              settings?.androidIcon256 || "/img/logo/android-icon-256x256.webp",
          },
          {
            size: "384x384",
            src:
              settings?.androidIcon384 || "/img/logo/android-icon-384x384.webp",
          },
          {
            size: "512x512",
            src:
              settings?.androidIcon512 || "/img/logo/android-icon-512x512.webp",
          },
          {
            size: "32x32",
            src: settings?.favicon32 || "/img/logo/favicon-32x32.webp",
          },
          {
            size: "96x96",
            src: settings?.favicon96 || "/img/logo/favicon-96x96.webp",
          },
          {
            size: "16x16",
            src: settings?.favicon16 || "/img/logo/favicon-16x16.webp",
          },
        ].map((icon) => (
          <link
            key={icon.size}
            rel="icon"
            type="image/png"
            sizes={icon.size}
            href={icon.src}
          />
        ))}

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
        <TopNavigationProvider
          fullwidth={fullwidth}
          horizontal={horizontal}
          transparent={transparent}
          trading={true}
        />

        <div
          className={`top-navigation-wrapper relative min-h-screen transition-all duration-300 ${
            darker ? "dark:bg-muted-1000/[0.96]" : "dark:bg-muted-950/[0.96]"
          } pt-16 lg:pt-4 pb-20 ${
            sidebarOpened && !nopush
              ? "is-pushed " + layoutPushedClasses["top-navigation"]
              : layoutNotPushedClasses["top-navigation"]
          } ${color === "muted" ? "bg-muted-50/[0.96]" : "bg-white/[0.96]"} ${
            horizontal ? "!pb-0 !pe-0 !pt-0" : ""
          }`}
        >
          <div
            className={`${fullwidth ? "max-w-full" : "mx-auto"} ${
              horizontal
                ? "flex h-full min-h-screen flex-col [&>div]:h-full [&>div]:min-h-screen"
                : ""
            }`}
          >
            <div className={`${horizontal ? "" : "pb-20 pt-4"}`}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
