import { useEffect } from "react";
import { useRouter } from "next/router";
import { AppProps } from "next/app";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import { AppWebSocketProvider } from "@/context/WebSocketContext";
import { restoreLayoutFromStorage } from "@/stores/layout";
import { appWithTranslation } from "next-i18next";
import "../i18n";
import { useDashboardStore } from "@/stores/dashboard";
import { Icon } from "@iconify/react";

function MyApp({ Component, pageProps }: AppProps) {
  const { fetchProfile, settings } = useDashboardStore();
  const router = useRouter();

  useEffect(() => {
    restoreLayoutFromStorage();
  }, []);

  useEffect(() => {
    if (router.isReady && !settings) {
      fetchProfile();
    }
  }, [router.isReady, settings, fetchProfile]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_STATUS === "true") {
        const { gtag } = window as any;
        gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, {
          page_path: url,
        });
      }
      if (process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_STATUS === "true") {
        const { fbq } = window as any;
        fbq("track", "PageView");
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  if (!settings) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">
          <Icon
            icon="mingcute:loading-3-line"
            className="animate-spin mr-2 h-12 w-12"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toaster
        closeButton
        richColors
        theme="system"
        position="top-center"
        toastOptions={{
          duration: 3000,
        }}
      />
      <Component {...pageProps} />
    </div>
  );
}

const AppWithProviders = appWithTranslation(MyApp);

function WrappedApp(props: AppProps) {
  return (
    <AppWebSocketProvider>
      <AppWithProviders {...props} />
    </AppWebSocketProvider>
  );
}

export default WrappedApp;
