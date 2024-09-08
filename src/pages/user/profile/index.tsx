import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/layouts/Default";
import $fetch from "@/utils/api";
import { useDashboardStore } from "@/stores/dashboard";
import { imageUploader } from "@/utils/upload";
import PictureSection from "@/components/pages/user/profile/PictureSection";
import PersonalSection from "@/components/pages/user/profile/PersonalSection";
import AddressSection from "@/components/pages/user/profile/AddressSection";
import SocialMediaSection from "@/components/pages/user/profile/SocialMediaSection";
import { KycStatus } from "@/components/pages/user/profile/KycStatus";
import { TwoFactor } from "@/components/pages/user/profile/2fa";
import { BackButton } from "@/components/elements/base/button/BackButton";
import WalletConnectButton from "@/components/pages/user/profile/WalletConnectButton";
import WagmiProviderWrapper from "@/context/useWagmi";
import { useTranslation } from "next-i18next";

const kycStatus = process.env.NEXT_PUBLIC_KYC_STATUS === "true" || false;
const twoFactorStatus = process.env.NEXT_PUBLIC_2FA_STATUS === "true" || false;
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

const Tab = ({ label, activeTab, setActiveTab, tabName }) => {
  const router = useRouter();
  const handleTabClick = () => {
    setActiveTab(tabName);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, tab: tabName.toLowerCase() },
    });
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

const Tabs = ({ mainTab, setMainTab }) => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-2 border-b border-muted-200 dark:border-muted-800 overflow-x-auto">
      {kycStatus ? (
        <Tab
          label={t("Verification")}
          activeTab={mainTab}
          setActiveTab={setMainTab}
          tabName="KYC"
        />
      ) : (
        <>
          <Tab
            label={t("Personal")}
            activeTab={mainTab}
            setActiveTab={setMainTab}
            tabName="PERSONAL"
          />
          <Tab
            label={t("Address")}
            activeTab={mainTab}
            setActiveTab={setMainTab}
            tabName="ADDRESS"
          />
        </>
      )}
      {twoFactorStatus && (
        <Tab
          label={t("2FA")}
          activeTab={mainTab}
          setActiveTab={setMainTab}
          tabName="2FA"
        />
      )}
      <Tab
        label={t("Picture")}
        activeTab={mainTab}
        setActiveTab={setMainTab}
        tabName="PICTURE"
      />
      <Tab
        label={t("Social Media")}
        activeTab={mainTab}
        setActiveTab={setMainTab}
        tabName="SOCIAL_MEDIA"
      />
    </div>
  );
};

const UserSettings = () => {
  const { t } = useTranslation();
  const { profile } = useDashboardStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    setFormData({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      email: profile?.email || "",
      bio: profile?.metadata?.bio || "",
      avatar: profile?.avatar || "",
      address: profile?.metadata?.location?.address || "",
      city: profile?.metadata?.location?.city || "",
      country: profile?.metadata?.location?.country || "",
      zip: profile?.metadata?.location?.zip || "",
      facebook: profile?.metadata?.social?.facebook || "",
      twitter: profile?.metadata?.social?.twitter || "",
      dribbble: profile?.metadata?.social?.dribbble || "",
      instagram: profile?.metadata?.social?.instagram || "",
      github: profile?.metadata?.social?.github || "",
      gitlab: profile?.metadata?.social?.gitlab || "",
    });
  }, [profile]);

  const [originalData, setOriginalData] = useState(formData);
  const [changes, setChanges] = useState({});
  const [mainTab, setMainTab] = useState("PICTURE");

  useEffect(() => {
    const { tab } = router.query as { tab: string };
    if (tab) {
      setMainTab(tab.toUpperCase());
    } else {
      setMainTab(kycStatus ? "KYC" : "PERSONAL");
    }
  }, [router.query]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    setChanges((prevChanges) => ({
      ...prevChanges,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = async (files) => {
    if (files.length > 0) {
      const file = files[0];
      const uploadResult = await imageUploader({
        file,
        dir: "avatars",
        size: {
          width: 64,
          height: 64,
          maxWidth: 64,
          maxHeight: 64,
        },
        oldPath: formData.avatar,
      });
      if (uploadResult.success) {
        setFormData((prevData) => ({
          ...prevData,
          avatar: uploadResult.url,
        }));
        setChanges((prevChanges) => ({
          ...prevChanges,
          avatar: uploadResult.url,
        }));
      }
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setChanges({});
  };

  const handleSave = async () => {
    setIsLoading(true);
    const payload = {
      ...changes,
      profile: {
        bio: formData.bio,
        location: {
          address: formData.address,
          city: formData.city,
          country: formData.country,
          zip: formData.zip,
        },
        social: {
          facebook: formData.facebook,
          twitter: formData.twitter,
          dribbble: formData.dribbble,
          instagram: formData.instagram,
          github: formData.github,
          gitlab: formData.gitlab,
        },
      },
    };
    const { data, error } = await $fetch({
      url: "/api/user/profile",
      method: "PUT",
      body: payload,
    });
    if (!error) {
      setOriginalData(formData);
      setChanges({});
      console.log(data);
    }
    setIsLoading(false);
  };

  const hasChanges = Object.keys(changes).length > 0;

  return (
    <Layout title={t("User Profile")} color="muted">
      <main className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="font-sans text-2xl font-light leading-[1.125] text-muted-800 dark:text-muted-100">
              {t("Welcome")} {profile?.firstName},
            </h2>
            <span className="text-muted-500 dark:text-muted-400 text-sm">
              {profile?.id}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {projectId && (
              <WagmiProviderWrapper>
                <WalletConnectButton />
              </WagmiProviderWrapper>
            )}
            <BackButton href="/user" />
          </div>
        </div>

        <div className="w-full h-full flex flex-col">
          <Tabs mainTab={mainTab} setMainTab={setMainTab} />
          <div className="w-full flex p-4 flex-col h-full">
            {kycStatus ? (
              mainTab === "KYC" && <KycStatus />
            ) : (
              <>
                {mainTab === "PERSONAL" && (
                  <PersonalSection
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleCancel={handleCancel}
                    handleSave={handleSave}
                    hasChanges={hasChanges}
                    isLoading={isLoading}
                  />
                )}
                {mainTab === "ADDRESS" && (
                  <AddressSection
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleCancel={handleCancel}
                    handleSave={handleSave}
                    hasChanges={hasChanges}
                    isLoading={isLoading}
                  />
                )}
              </>
            )}
            {twoFactorStatus && mainTab === "2FA" && <TwoFactor />}
            {mainTab === "PICTURE" && (
              <PictureSection
                formData={formData}
                handleFileChange={handleFileChange}
                handleCancel={handleCancel}
                handleSave={handleSave}
                hasChanges={hasChanges}
                setFormData={setFormData}
                setChanges={setChanges}
                isLoading={isLoading}
              />
            )}
            {mainTab === "SOCIAL_MEDIA" && (
              <SocialMediaSection
                formData={formData}
                handleInputChange={handleInputChange}
                handleCancel={handleCancel}
                handleSave={handleSave}
                hasChanges={hasChanges}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default UserSettings;
