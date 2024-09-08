import Layout from "@/layouts/Default";
import React from "react";
import FuturesMarketsList from "@/components/pages/futures/marketsList";
import { useTranslation } from "next-i18next";
const FuturesMarkets = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Futures")} color="muted">
      <FuturesMarketsList />
    </Layout>
  );
};
export default FuturesMarkets;
