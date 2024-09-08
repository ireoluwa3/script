import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/layouts/Default";
import Button from "@/components/elements/base/button/Button";
import Card from "@/components/elements/base/card/Card";
import { Icon } from "@iconify/react";
import Link from "next/link";
import $fetch from "@/utils/api";
import { BackButton } from "@/components/elements/base/button/BackButton";
import Tag from "@/components/elements/base/tag/Tag";
import Alert from "@/components/elements/base/alert/Alert";
import { AnimatedTooltip } from "@/components/elements/base/tooltips/AnimatedTooltip";
import { useTranslation } from "next-i18next";

const ExchangeProviderPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { productId } = router.query;
  const [exchange, setExchange] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (productId) {
      fetchExchangeDetails(productId as string);
    }
  }, [productId]);
  const fetchExchangeDetails = async (id: string) => {
    setLoading(true);
    const { data, error } = await $fetch({
      url: `/api/admin/finance/exchange/provider/${id}`,
      silent: true,
    });
    if (!error) {
      setExchange(data.exchange);
      setResult(data.result);
    }
    setLoading(false);
  };
  const exchangeDetails: Record<string, any> = {
    binance: {
      imgSrc: "/img/exchanges/binance.svg",
      supportedCountries: "Countries and Regions",
      link: "https://www.binance.com/en/country-region-selector",
      description:
        "Binance Holdings Ltd., branded Binance, is a global company that operates the largest cryptocurrency exchange in terms of daily trading volume of cryptocurrencies. Binance was founded in 2017 by Changpeng Zhao, a developer who had previously created high-frequency trading software.",
    },
    kucoin: {
      imgSrc: "/img/exchanges/kucoin.svg",
      restrictedCountries:
        "The United States, North Korea, Singapore, Hong Kong, Iran, The Crimean region",
      description:
        "KuCoin is a large cryptocurrency exchange offering the ability to buy, sell, and trade cryptocurrencies. In addition to basic trading options, the platform offers margin, futures, and peer-to-peer (P2P) trading. Users can also choose to stake or lend their crypto to earn rewards.",
    },
  };
  const details = exchangeDetails[exchange?.name?.toLowerCase()];
  if (loading)
    return (
      <Layout title={t("Loading...")} color="muted">
        <div className="flex items-center justify-center h-96 flex-col gap-5">
          <Icon
            icon="line-md:loading-loop"
            className="h-8 w-8 animate-spin text-primary-500"
          />
          <span className="text-muted-600 dark:text-muted-400 ml-2">
            {t("Loading")} {t("Exchange")}...
          </span>
        </div>
      </Layout>
    );
  return (
    <Layout title={`${exchange?.title} Exchange`} color="muted">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 md:gap-10">
              <img
                src={details?.imgSrc}
                alt={exchange?.title}
                className="w-24 md:w-48"
              />
              <div className="text-md flex gap-2">
                <Tag>{exchange?.version}</Tag>
                <Tag color={exchange?.status ? "success" : "danger"}>
                  {exchange?.status ? "Active" : "Inactive"}
                </Tag>
              </div>
            </div>
            <div className="flex flex-col gap-4 text-md">
              {details?.supportedCountries && (
                <div>
                  <p className="text-muted-800 dark:text-muted-200">
                    {t("Supported Countries")}
                  </p>
                  <Link
                    href={details?.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 dark:text-primary-400 underline"
                  >
                    {details?.supportedCountries}
                  </Link>
                </div>
              )}
              {details?.restrictedCountries && (
                <p className="text-muted-600 dark:text-muted-400">
                  {t("Restricted Countries")} {details?.restrictedCountries}
                </p>
              )}
              <p className="text-muted-600 dark:text-muted-400">
                {details?.description}
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            {!exchange?.licenseStatus && (
              <Link
                href={`/admin/finance/exchange/provider/${exchange?.productId}/license`}
              >
                <Button color="primary" className="ml-2" shape={"rounded"}>
                  {t("Activate License")}
                </Button>
              </Link>
            )}
            <BackButton href="/admin/finance/exchange" />
          </div>
        </div>
        {result && (
          <Alert
            label={
              <div className="text-xl">
                {result.status ? "Success!" : "Error!"}{" "}
                <span className="text-muted-600 dark:text-muted-400">
                  {result.status
                    ? "Credentials are valid"
                    : "Credentials are invalid"}
                </span>
              </div>
            }
            sublabel={
              <div className="text-md">
                {result.message}
                {result.status === false && (
                  <>
                    <p className="text-primary-500 dark:text-primary-400 mt-4">
                      {t(
                        "Please check your credentials in the .env file and try again. Note that any changes to the .env file will require a server restart."
                      )}
                    </p>
                    <p className="text-muted-600 dark:text-muted-400 mt-4">
                      {t(
                        "If you don&apos;t have the credentials, please visit the exchange website to create an API key, secret, and passphrase (if required)."
                      )}
                    </p>
                    <p className="text-muted-600 dark:text-muted-400">
                      {t(
                        "Once you have the credentials, add them to your .env file as shown below"
                      )}
                    </p>
                    <div className="text-muted-600 dark:text-muted-400 mt-4 prose text-sm max-w-xl">
                      <pre>
                        <li>APP_{exchange?.name?.toUpperCase()}_API_KEY</li>
                        <li>APP_{exchange?.name?.toUpperCase()}_API_SECRET</li>
                        {exchange?.name?.toUpperCase() === "BINANCE" && (
                          <li>
                            APP_{exchange?.name?.toUpperCase()}_API_PASSPHRASE
                          </li>
                        )}
                      </pre>
                    </div>
                    <p className="text-muted-600 dark:text-muted-400 mt-4">
                      {t(
                        "If you&apos;re still having issues, please check the following"
                      )}
                    </p>
                    <ul className="list-disc list-inside mt-4 text-info-500 dark:text-info-400">
                      <li>
                        {t(
                          "You may also need to whitelist your server IP address in the exchange settings."
                        )}
                      </li>
                      <li>
                        {t(
                          "Make sure you enable all permissions except those that prevent withdrawals to unlisted addresses."
                        )}
                      </li>
                      <li>
                        {t(
                          "If this is your first time using this exchange, make sure your account is new and KYC is verified."
                        )}
                      </li>
                    </ul>
                  </>
                )}
              </div>
            }
            color={result.status ? "success" : "danger"}
            className="mt-6"
            canClose={false}
          />
        )}
        <hr className="my-6 border-t border-muted-300 dark:border-muted-700" />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <CardLink
            icon="mdi:chart-line"
            label={t("Markets")}
            href="/admin/finance/exchange/market"
          />
          <CardLink
            icon="mdi:currency-usd"
            label={t("Currencies")}
            href="/admin/finance/currency/spot"
          />
          <CardLink
            icon="mdi:wallet"
            label={t("Balances")}
            href="/admin/finance/exchange/balance"
            disabled={result?.status === false}
          />
          <CardLink
            icon="mdi:cash-multiple"
            label={t("Fees")}
            href="/admin/finance/exchange/fee"
            disabled={result?.status === false}
          />
        </div>
      </main>
    </Layout>
  );
};
const CardLink = ({
  icon,
  label,
  href,
  disabled,
}: {
  icon: string;
  label: string;
  href: string;
  disabled?: boolean;
}) => {
  const { t } = useTranslation();
  if (disabled) {
    return (
      <AnimatedTooltip
        content={t("Please check your credentials before proceeding")}
      >
        <Card className="flex items-center p-4 cursor-not-allowed bg-muted-100 dark:bg-muted-800">
          <Icon
            icon={icon}
            className="h-8 w-8 text-muted-400 dark:text-muted-400 mr-4"
          />
          <span className="text-muted-400 dark:text-muted-400">{label}</span>
        </Card>
      </AnimatedTooltip>
    );
  } else {
    return (
      <Link href={href}>
        <Card className="flex items-center p-4 cursor-pointer hover:bg-muted-100 dark:hover:bg-muted-800">
          <Icon
            icon={icon}
            className="h-8 w-8 text-muted-600 dark:text-muted-400 mr-4"
          />
          <span className="text-muted-800 dark:text-muted-100">{label}</span>
        </Card>
      </Link>
    );
  }
};
export default ExchangeProviderPage;
export const permission = "Access Exchange Provider Management";
