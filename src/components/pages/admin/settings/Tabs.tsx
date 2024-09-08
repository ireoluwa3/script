import React from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

interface TabProps {
  label: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabName: string;
}

const Tab: React.FC<TabProps> = ({
  label,
  activeTab,
  setActiveTab,
  tabName,
}) => {
  const router = useRouter();

  const handleTabClick = () => {
    setActiveTab(tabName);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, tab: tabName.toLowerCase() },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <button
      type="button"
      className={`shrink-0 border-b-2 px-6 py-2 text-sm transition-colors duration-300
          ${
            activeTab === tabName
              ? "border-primary-500 text-primary-500 dark:text-primary-400"
              : "border-transparent text-muted"
          }
        `}
      onClick={handleTabClick}
    >
      {label}
    </button>
  );
};

interface TabsProps {
  mainTab: string;
  setMainTab: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ mainTab, setMainTab }) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2 border-b border-muted-200 dark:border-muted-800 overflow-x-auto">
      <Tab
        label={t("KYC Restrictions")}
        activeTab={mainTab}
        setActiveTab={setMainTab}
        tabName="RESTRICTIONS"
      />
      <Tab
        label={t("Wallet")}
        activeTab={mainTab}
        setActiveTab={setMainTab}
        tabName="WALLET"
      />
      <Tab
        label={t("Logos")}
        activeTab={mainTab}
        setActiveTab={setMainTab}
        tabName="LOGOS"
      />
      <Tab
        label={t("Investments")}
        activeTab={mainTab}
        setActiveTab={setMainTab}
        tabName="INVEST"
      />
      <Tab
        label={t("P2P")}
        activeTab={mainTab}
        setActiveTab={setMainTab}
        tabName="P2P"
      />
      <Tab
        label={t("Affiliate")}
        activeTab={mainTab}
        setActiveTab={setMainTab}
        tabName="AFFILIATE"
      />
      <Tab
        label={t("Social")}
        activeTab={mainTab}
        setActiveTab={setMainTab}
        tabName="SOCIAL"
      />
    </div>
  );
};

export default Tabs;
