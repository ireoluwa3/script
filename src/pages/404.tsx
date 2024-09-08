import { useTranslation } from "next-i18next";
import React from "react";
import { useRouter } from "next/router";
import { MashImage } from "@/components/elements/MashImage";
import ButtonLink from "@/components/elements/base/button-link/ButtonLink";
import Button from "@/components/elements/base/button/Button";
import Layout from "@/layouts/Minimal";
export default function NotFound() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Layout title={`${t("Page not found")}`}>
      <main className="flex min-h-screen flex-col items-stretch justify-between bg-muted-100 dark:bg-muted-900">
        {/* <MinimalHeader /> */}

        <div className="hero-body flex flex-shrink-0 flex-grow items-center px-6 py-12 md:px-12 md:py-0">
          <div className="container">
            <div className="error-wrapper relative flex flex-col items-center justify-center overflow-hidden py-12">
              <div className="error-wrapper-inner relative isolate w-full">
                <div className="underlay absolute start-1/2 top-[36%] -z-[1] -translate-x-1/2 -translate-y-1/2 font-sans text-[8rem] font-extrabold text-muted-800 dark:text-muted-300 opacity-10 md:top-[38%] md:text-[20rem] ltablet:text-[23rem] lg:text-[26rem]">
                  <span>404</span>
                </div>
                <div className="relative z-[1]">
                  <MashImage
                    className="mx-auto block w-full max-w-xl dark:hidden"
                    width={510}
                    height={341}
                    src="/img/illustrations/404.svg"
                    alt="Error image"
                  />
                  <MashImage
                    className="mx-auto hidden w-full max-w-xl dark:block"
                    width={510}
                    height={341}
                    src="/img/illustrations/404-dark.svg"
                    alt="Error image"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h2 className="mb-2 font-sans text-3xl font-normal leading-tight text-muted-800 dark:text-muted-100">
                    <span>{`${t("Page Not Found")}`}</span>
                  </h2>
                  <p className="mx-auto mb-4 max-w-lg text-base text-muted-500 dark:text-muted-400">{`${t(
                    "Oops, something went wrong and we couldn't find that page, Please try again later or contact support"
                  )}`}</p>
                  <div className="flex items-center justify-center gap-2">
                    <ButtonLink
                      href="/"
                      variant="solid"
                      color="primary"
                      shape="smooth"
                      className="min-w-[130px]"
                    >
                      {t("Homepage")}
                    </ButtonLink>

                    <Button
                      onClick={() => router.back()}
                      className="!min-w-[130px]"
                    >
                      {t("Back")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
