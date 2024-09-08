import React, { useEffect } from "react";
import Layout from "@/layouts/Minimal";
import { FormContent } from "@/components/pages/login/FormContent";
import WalletLogin from "@/components/pages/login/WalletLogin";
import WagmiProviderWrapper from "@/context/useWagmi";
import { Lottie } from "@/components/elements/base/lottie";
import { useTranslation } from "next-i18next";
import { HeaderSection } from "@/components/pages/login/HeaderSection";
import { useLoginStore } from "@/stores/auth/login";
import { useRouter } from "next/router";
import { useDashboardStore } from "@/stores/dashboard";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

const SideImage = () => (
  <div className="hidden h-screen w-full md:w-1/2 lg:flex xl:w-2/3 max-w-3xl mx-auto items-center justify-center bg-muted-50 dark:bg-muted-950">
    <Lottie category="cryptocurrency-3" path="mining" />
  </div>
);

export default function Login() {
  const { t } = useTranslation();
  const router = useRouter();
  const { script, setVerificationCode, handleVerificationSubmit } =
    useLoginStore();
  const { fetchProfile } = useDashboardStore();

  const { token } = router.query as { token: string };

  useEffect(() => {
    if (router.isReady && token) {
      setVerificationCode(token);
      handleVerificationSubmit(token);
    }
  }, [router.isReady]);

  useEffect(() => {
    useLoginStore.getState().initializeRecaptcha();
  }, []);

  useEffect(() => {
    // Fetch profile when component mounts
    fetchProfile();
  }, []);

  const handleRouteChange = () => {
    if (script && script.parentNode) {
      script.parentNode.removeChild(script);
    }
    const recaptchaContainer = document.querySelector(".grecaptcha-badge");
    if (recaptchaContainer && recaptchaContainer.parentNode) {
      recaptchaContainer.parentNode.removeChild(recaptchaContainer);
    }
  };

  useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      const recaptchaContainer = document.querySelector(".grecaptcha-badge");
      if (recaptchaContainer && recaptchaContainer.parentNode) {
        recaptchaContainer.parentNode.removeChild(recaptchaContainer);
      }
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  return (
    <Layout title={t("Login")} color="muted">
      <div id="recaptcha-container"></div>
      <div className="relative min-h-screen flex h-screen flex-col items-center bg-muted-50 dark:bg-muted-950 md:flex-row overflow-hidden">
        <SideImage />
        <div className="relative flex h-screen w-full items-center justify-center bg-white px-6 dark:bg-muted-900 md:mx-auto md:w-1/2 md:max-w-md lg:max-w-full lg:px-16 xl:w-1/3 xl:px-12">
          <HeaderSection />
          <div className="mx-auto w-full max-w-sm px-4">
            {projectId && (
              <WagmiProviderWrapper>
                <WalletLogin />
              </WagmiProviderWrapper>
            )}
            <FormContent />
          </div>
        </div>
      </div>
    </Layout>
  );
}
