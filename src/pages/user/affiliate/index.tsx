import Layout from "@/layouts/Default";
import React, { useEffect } from "react";
import { useDashboardStore } from "@/stores/dashboard";
import { ReferralTree } from "@/components/pages/affiliate/ReferralTree";
import { HeaderCardImage } from "@/components/widgets/HeaderCardImage";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { toast } from "sonner";
import Alert from "@/components/elements/base/alert/Alert";
import copy from "copy-to-clipboard"; // Import copy-to-clipboard
import Button from "@/components/elements/base/button/Button";

const AffiliateDashboard = () => {
  const { t } = useTranslation();
  const { profile, getSetting } = useDashboardStore();
  const router = useRouter();

  useEffect(() => {
    if (
      router.isReady &&
      getSetting("icoRestrictions") === "true" &&
      (!profile?.kyc?.status ||
        (parseFloat(profile?.kyc?.level || "0") < 2 &&
          profile?.kyc?.status !== "APPROVED"))
    ) {
      router.push("/user/profile?tab=kyc");
      toast.error(t("Please complete your KYC to access affiliate dashboard"));
    }
  }, [router.isReady, profile?.kyc?.status]);

  const referralLink = `${process.env.NEXT_PUBLIC_SITE_URL}/register?ref=${profile?.id}`;

  const handleCopyLink = () => {
    copy(referralLink);
    toast.success(t("Referral link copied to clipboard!"));
  };

  return (
    <Layout title={t("Affiliate")} color="muted">
      <div className="mb-5">
        <HeaderCardImage
          title={t("Earn More With Our Referral Program")}
          description="Invite your friends and earn a commission for every trade they make."
          lottie={{
            category: "communications",
            path: "referral-marketing",
            max: 2,
            height: 220,
          }}
          link={`/user/affiliate/program`}
          linkLabel="Learn More"
          size="lg"
        />
      </div>
      <Alert
        color="info"
        canClose={false}
        className="mb-5"
        icon="mdi-information-outline"
        label={t("Referral Link")}
        sublabel={
          <>
            {t(
              "Share this link with your friends and earn a commission. Your referral link"
            )}
            :{" "}
            <a
              href={referralLink}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              {referralLink}
            </a>
          </>
        }
        button={
          <Button
            animated={false}
            onClick={handleCopyLink}
            size={"sm"}
            color="primary"
          >
            {t("Copy Link")}
          </Button>
        }
      />
      <ReferralTree id={profile?.id} />
    </Layout>
  );
};

export default AffiliateDashboard;
