import Layout from "@/layouts/Default";
import React, { useEffect, useState } from "react";
import { useDashboardStore } from "@/stores/dashboard";
import { useRouter } from "next/router";
import $fetch from "@/utils/api";
import { HeaderCardImage } from "@/components/widgets/HeaderCardImage";
import Button from "@/components/elements/base/button/Button";
import Link from "next/link";
import Card from "@/components/elements/base/card/Card";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/elements/base/datatable";
import { statusOptions } from "@/utils/constants";
import { Faq } from "@/components/pages/knowledgeBase/Faq";
import { useTranslation } from "next-i18next";
import { debounce } from "lodash";
import ImagePortal from "@/components/elements/imagePortal";
import { toast } from "sonner";
const api = "/api/ext/forex/transaction";
const columnConfig: ColumnConfigType[] = [
  {
    field: "createdAt",
    label: "Date",
    type: "datetime",
    sortable: true,
    filterable: false,
  },
  {
    field: "type",
    label: "Type",
    type: "select",
    options: [
      {
        value: "FOREX_DEPOSIT",
        label: "Deposit",
        color: "success",
      },
      {
        value: "FOREX_WITHDRAW",
        label: "Withdrawal",
        color: "danger",
      },
    ],
    sortable: true,
  },
  {
    field: "amount",
    label: "Amount - Fee",
    sublabel: "fee",
    type: "number",
    precision: 8,
    sortable: true,
    getSubValue: (row) => row.fee,
  },
  {
    field: "status",
    label: "Status",
    type: "select",
    sortable: true,
    options: statusOptions,
  },
];
const ImageItem = ({ label, src, openLightbox }) => (
  <div>
    <div className="relative group">
      <a onClick={() => openLightbox(src)} className="block cursor-pointer">
        <img
          loading="lazy"
          src={src || "/img/placeholder.svg"}
          alt={label}
          className="rounded-lg"
          height="180"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
          <Icon icon="akar-icons:eye" className="text-white text-3xl" />
        </div>
      </a>
    </div>
  </div>
);
const ForexAccountsDashboard = () => {
  const { t } = useTranslation();
  const { profile, getSetting } = useDashboardStore();
  const router = useRouter();
  const [accounts, setAccounts] = useState<{
    [key: string]: ForexAccount;
  }>({});
  const [singals, setSignals] = useState<ForexSignal[]>([]);
  const [demoPasswordUnlocked, setDemoPasswordUnlocked] = useState(false);
  const [livePasswordUnlocked, setLivePasswordUnlocked] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const openLightbox = (image: string) => {
    setCurrentImage(image);
    setIsLightboxOpen(true);
  };
  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };
  const fetchForexAccounts = async () => {
    const url = "/api/ext/forex/account";
    const { data, error } = await $fetch({
      url,
      silent: true,
    });
    if (!error) {
      setAccounts(data);
      if (data["LIVE"] && data["LIVE"].accountSignals) {
        setSignals(data["LIVE"].accountSignals);
      }
    }
  };
  const debounceFetchForexAccounts = debounce(fetchForexAccounts, 100);
  useEffect(() => {
    if (router.isReady) {
      debounceFetchForexAccounts();
    }
  }, [router.isReady]);
  useEffect(() => {
    if (
      router.isReady &&
      getSetting("forexRestrictions") === "true" &&
      (!profile?.kyc?.status ||
        (parseFloat(profile?.kyc?.level || "0") < 2 &&
          profile?.kyc?.status !== "APPROVED"))
    ) {
      router.push("/user/profile?tab=kyc");
      toast.error(t("Please complete your KYC to access forex accounts"));
    }
  }, [router.isReady, profile?.kyc?.status]);
  return (
    <Layout title={t("Forex Accounts")} color="muted">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-12">
        <div className="col-span-12 lg:col-span-8 ltablet:col-span-8">
          <HeaderCardImage
            title={t("Forex")}
            description={
              getSetting("forexInvestment") === "true"
                ? "Choose from a variety of investment plans to grow your wealth."
                : "Trade forex with ease and confidence."
            }
            lottie={{
              category: "stock-market-2",
              path: "capital-funding",
              max: 2,
              height: getSetting("forexInvestment") === "true" ? 220 : 200,
            }}
            link={
              getSetting("forexInvestment") === "true"
                ? `/user/invest/forex/plan`
                : undefined
            }
            linkLabel="View Investment Plans"
            size="md"
          />

          <div className="mt-3">
            <DataTable
              title={t("Transactions")}
              postTitle={t("Forex")}
              endpoint={api}
              columnConfig={columnConfig}
              isCrud={false}
              hasStructure={false}
              paginationLocation="static"
              hasRotatingBackButton={false}
              hasBreadcrumb={false}
            />
          </div>
          {singals && singals.length > 0 && (
            <div className="mt-6">
              <div className="mb-4">
                <h2 className="text-xl text-muted-800 dark:text-muted-200">
                  {t("Signals")}
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-12">
                {singals.map((signal, index) => (
                  <Card
                    key={index}
                    className="relative text-md col-span-4"
                    color={"contrast"}
                  >
                    <ImageItem
                      label={signal.title}
                      src={signal.image}
                      openLightbox={openLightbox}
                    />
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="col-span-12 flex flex-col gap-6 lg:col-span-4 ltablet:col-span-4 mt-0 md:mt-6">
          {Object.values(accounts).map((account, index) => (
            <Card key={index} className="relative text-md" color={"contrast"}>
              {!account.accountId && (
                <div className="absolute h-full w-full bg-white bg-opacity-50 backdrop-blur-sm z-10 rounded-lg dark:bg-black dark:bg-opacity-50">
                  <div className="flex items-center justify-center h-full flex-col">
                    <Icon
                      icon="svg-spinners:blocks-shuffle-3"
                      className="h-10 w-10 text-info-500"
                    />
                    <span className="text-muted-500 text-sm mt-2">
                      {t("Account not ready yet")}
                    </span>
                  </div>
                </div>
              )}
              <div className="w-full h-full p-5">
                <div className="mb-5">
                  <Link href={`/user/forex/${account.id}`}>
                    <Button
                      disabled={!account.status || account.balance === 0}
                      type="button"
                      color="primary"
                      shape="rounded"
                      className="w-full"
                    >
                      {account.type} {t("Trade")}
                    </Button>
                  </Link>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-500">{t("Account ID")}</span>
                  <span className="text-muted-800 dark:text-muted-100">
                    {account.accountId}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-500">{t("Password")}</span>
                  <span className="flex items-center gap-2 text-muted-800 dark:text-muted-100">
                    <span>
                      {account.type === "DEMO"
                        ? !demoPasswordUnlocked
                          ? "*********"
                          : account.password
                        : account.type === "LIVE"
                        ? !livePasswordUnlocked
                          ? "*********"
                          : account.password
                        : "N/A"}
                    </span>
                    <Icon
                      className="cursor-pointer"
                      icon={
                        account.type === "DEMO"
                          ? demoPasswordUnlocked
                            ? "bi:eye"
                            : "bi:eye-slash"
                          : livePasswordUnlocked
                          ? "bi:eye"
                          : "bi:eye-slash"
                      }
                      onClick={() => {
                        if (account.type === "DEMO") {
                          setDemoPasswordUnlocked(!demoPasswordUnlocked);
                        } else if (account.type === "LIVE") {
                          setLivePasswordUnlocked(!livePasswordUnlocked);
                        }
                      }}
                    />
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-500">{t("Leverage")}</span>
                  <span className="text-muted-800 dark:text-muted-100">
                    x{account.leverage}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-500">{t("MetaTrader")}</span>
                  <span className="text-muted-800 dark:text-muted-100">
                    {account.mt}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-500">{t("Balance")}</span>
                  <span className="text-muted-800 dark:text-muted-100">
                    {account.balance}
                  </span>
                </div>
                {account.type === "LIVE" && (
                  <div className="flex gap-5 items-center justify-center mt-5">
                    <a
                      href={`/user/forex/${account.id}/deposit`}
                      className="w-full"
                    >
                      <Button
                        type="button"
                        color="success"
                        shape="rounded"
                        className="w-full"
                        disabled={!account.status}
                      >
                        <span>{t("Deposit")}</span>
                      </Button>
                    </a>
                    <a
                      href={`/user/forex/${account.id}/withdraw`}
                      className="w-full"
                    >
                      <Button
                        type="button"
                        color="danger"
                        shape="rounded"
                        className="w-full"
                        disabled={!account.status || account.balance === 0}
                      >
                        <span>{t("Withdraw")}</span>
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Faq category="FOREX" />
      {isLightboxOpen && (
        <ImagePortal src={currentImage} onClose={closeLightbox} />
      )}
    </Layout>
  );
};
export default ForexAccountsDashboard;
