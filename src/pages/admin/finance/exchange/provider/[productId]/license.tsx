import React, { useState, useEffect } from "react";
import Layout from "@/layouts/Default";
import { useTranslation } from "next-i18next";
import $fetch from "@/utils/api";
import Card from "@/components/elements/base/card/Card";
import Input from "@/components/elements/form/input/Input";
import Button from "@/components/elements/base/button/Button";
import IconBox from "@/components/elements/base/iconbox/IconBox";
import Alert from "@/components/elements/base/alert/Alert";
import { debounce } from "lodash";
import { BackButton } from "@/components/elements/base/button/BackButton";
import { useRouter } from "next/router";
const ExchangeProvider = () => {
  const { t } = useTranslation();
  const [updateData, setUpdateData] = useState({
    status: false,
    version: "",
    release_date: "",
    summary: "",
    changelog: null,
    update_id: "",
    message: "",
  });
  const router = useRouter();
  const { productId } = router.query as {
    productId: string;
  };
  const [isUpdating, setIsUpdating] = useState(false);
  const [purchaseCode, setPurchaseCode] = useState("");
  const [envatoUsername, setEnvatoUsername] = useState("");
  const [productName, setProductName] = useState(null);
  const [productTitle, setProductTitle] = useState(null);
  const [productVersion, setProductVersion] = useState("");
  const [licenseVerified, setLicenseVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fetchProductData = async () => {
    const { data, error } = await $fetch({
      url: `/api/admin/finance/exchange/provider/${productId}`,
      silent: true,
    });
    if (!error) {
      setProductVersion(data.exchange.version);
      setProductName(data.exchange.name);
      setProductTitle(data.exchange.title);
    }
  };
  const debouncedFetchProductData = debounce(fetchProductData, 100);
  useEffect(() => {
    if (router.isReady) {
      debouncedFetchProductData();
    }
  }, [router.isReady]);
  const reVerifyLicense = async () => {
    const { data, error } = await $fetch({
      url: `/api/admin/finance/exchange/provider/${productId}/verify`,
      method: "POST",
      silent: true,
    });
    if (!error) {
      setLicenseVerified(data.status);
    } else {
      setLicenseVerified(false);
    }
  };
  useEffect(() => {
    if (productId && productName) {
      reVerifyLicense();
    }
  }, [productId, productName]);
  const checkForUpdates = async () => {
    setIsLoading(true);
    const { data, error } = await $fetch({
      url: `/api/admin/system/update/check`,
      method: "POST",
      body: { productId, currentVersion: productVersion },
      silent: true,
    });
    if (!error) {
      setUpdateData(data);
      setUpdateData((prevState) => ({
        ...prevState,
        message: data.message,
      }));
    }
    setIsLoading(false);
  };
  useEffect(() => {
    if (licenseVerified) {
      checkForUpdates();
    }
  }, [licenseVerified, productVersion]);
  const updateSystem = async () => {
    setIsUpdating(true);
    const { error } = await $fetch({
      url: `/api/admin/system/update/download`,
      method: "POST",
      body: {
        productId,
        updateId: updateData.update_id,
        version: updateData.version,
        product: productName,
        type: "extension",
      },
    });
    if (!error) {
      setProductVersion(updateData.version);
    }
    setIsUpdating(false);
  };
  const activateLicenseAction = async () => {
    setIsSubmitting(true);
    const { data, error } = await $fetch({
      url: `/api/admin/finance/exchange/provider/${productId}/activate`,
      method: "POST",
      body: { purchaseCode, envatoUsername },
    });
    if (!error) {
      setLicenseVerified(data.status);
    }
    setIsSubmitting(false);
  };
  return (
    <Layout title={t("Extension Details")} color="muted">
      <div className="flex justify-between items-center w-full mb-5">
        <h1 className="text-xl">{productTitle}</h1>
        <BackButton href={`/admin/finance/exchange/provider/${productId}`} />
      </div>
      {!licenseVerified ? (
        <div className="flex justify-center items-center w-full h-[70vh]">
          <div className="flex flex-col justify-center items-center w-full max-w-5xl px-4 text-center">
            <h1>{t("Verify your license")}</h1>
            <Card className="mt-8 p-5 max-w-md space-y-5">
              <Input
                value={purchaseCode}
                onChange={(e) => setPurchaseCode(e.target.value)}
                type="text"
                label={t("Purchase Code")}
                placeholder={t("Enter your purchase code")}
              />
              <Input
                value={envatoUsername}
                onChange={(e) => setEnvatoUsername(e.target.value)}
                type="text"
                label={t("Envato Username")}
                placeholder={t("Enter your Envato username")}
              />
              <Button
                color="primary"
                className="w-full"
                onClick={activateLicenseAction}
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {t("Activate License")}
              </Button>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full">
          {isLoading ? (
            <div className="flex justify-center items-center w-full h-[70vh]">
              <div className="text-center space-y-5 flex flex-col gap-5 items-center justify-center">
                <IconBox
                  size="xl"
                  shape="full"
                  color="info"
                  icon="svg-spinners:blocks-shuffle-3"
                />
                <h1 className="text-2xl font-bold">
                  {t("Checking for updates")}...
                </h1>
                <p>{t("Please wait while we check for updates")}.</p>
              </div>
            </div>
          ) : (
            <div className="text-start max-w-2xl space-y-5">
              {updateData.status && (
                <Alert
                  color="info"
                  icon="material-symbols-light:info-outline"
                  canClose={false}
                  className="text-md"
                >
                  {t(
                    "Please backup your database and script files before upgrading"
                  )}
                  .
                </Alert>
              )}
              <Alert canClose={false} color={"success"} className="text-md">
                {updateData.message}
              </Alert>
              {updateData.status && (
                <Card className="p-5 space-y-5">
                  <span className="text-gray-800 dark:text-gray-200 font-semibold text-lg">
                    {t("Update Notes")}
                  </span>
                  <div
                    className="pl-5 prose"
                    dangerouslySetInnerHTML={{
                      __html: updateData.changelog || "",
                    }}
                  />
                  <Button
                    onClick={updateSystem}
                    color="success"
                    className="w-full"
                    type="submit"
                    disabled={updateData.update_id === "" || isUpdating}
                    loading={isUpdating}
                  >
                    {t("Update")}
                  </Button>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};
export default ExchangeProvider;
export const permission = "Access Exchange Provider Management";
