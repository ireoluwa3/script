import React from "react";
import { useDashboardStore } from "@/stores/dashboard";
import { ReferralTree } from "@/components/pages/affiliate/ReferralTree";

const AffiliateDashboard = () => {
  const { profile } = useDashboardStore();

  return <ReferralTree id={profile?.id} />;
};

export default AffiliateDashboard;
