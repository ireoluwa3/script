import React, { type FC } from "react";
import Head from "next/head";
import { useDashboardStore } from "@/stores/dashboard";
import PageTransition from "@/components/elements/PageTransition";

type LayoutColors = "default" | "muted";
interface LayoutProps {
  children: React.ReactNode;
  color?: LayoutColors;
  title?: string;
  description?: string;
}

const siteTitle = process.env.NEXT_PUBLIC_SITE_NAME;
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION;

const Layout: FC<LayoutProps> = ({
  children,
  title = siteTitle,
  description = siteDescription,
  color = "default",
}) => {
  const { settings } = useDashboardStore();

  return (
    <main>
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <div
        className={`min-h-screen transition-all duration-300 ${
          color === "muted" ? "bg-muted-50" : "bg-white"
        } dark:bg-muted-900`}
      >
        <PageTransition>{children}</PageTransition>
      </div>
    </main>
  );
};

export default Layout;
