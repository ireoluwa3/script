import React, { useEffect, useState } from "react";
import Select from "@/components/elements/form/select/Select";
import Input from "@/components/elements/form/input/Input";
import Button from "@/components/elements/base/button/Button";
import { useTranslation } from "next-i18next";
import { capitalize } from "lodash";
import { toast } from "sonner";
import $fetch from "@/utils/api";

const OrderDownloadOptions = ({ order, orderItem, fetchOrder }) => {
  const { t } = useTranslation();
  const [downloadOption, setDownloadOption] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [licenseKey, setLicenseKey] = useState("");

  useEffect(() => {
    if (orderItem) {
      if (orderItem.key && orderItem.filePath) {
        setDownloadOption("both");
        setLicenseKey(orderItem.key);
        setDownloadLink(orderItem.filePath);
      } else if (orderItem.key) {
        setDownloadOption("license");
        setLicenseKey(orderItem.key);
      } else if (orderItem.filePath) {
        setDownloadOption("file");
        setDownloadLink(orderItem.filePath);
      }
    }
  }, [orderItem]);

  const handleDownloadOptionUpdate = async () => {
    if (!order) return;
    if (!downloadOption) {
      toast.error("Please select a download option");
      return;
    }
    if (
      downloadOption === "both" &&
      (licenseKey === "" || downloadLink === "")
    ) {
      toast.error("Please fill in both license key and download link");
      return;
    }
    if (downloadOption === "license" && licenseKey === "") {
      toast.error("Please fill in the license key");
      return;
    }
    if (downloadOption === "file" && downloadLink === "") {
      toast.error("Please fill in the download link");
      return;
    }

    const { data, error } = await $fetch({
      url: `/api/admin/ext/ecommerce/order/${order.id}/download`,
      method: "PUT",
      body: {
        orderItemId: orderItem.id,
        key: licenseKey !== "" ? licenseKey : undefined,
        filePath: downloadLink !== "" ? downloadLink : undefined,
      },
      silent: true,
    });

    if (!error) {
      fetchOrder();
    }
  };

  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-5 dark:text-white">
        {t("Download Options")}
      </h2>
      <Select
        value={downloadOption}
        onChange={(option) => setDownloadOption(option.target.value)}
        options={[
          { value: "", label: capitalize(t("Select Option")) },
          { value: "license", label: t("License Key") },
          { value: "file", label: t("Downloadable File") },
          { value: "both", label: t("Both") },
        ]}
      />
      {downloadOption && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {(downloadOption === "license" || downloadOption === "both") && (
            <Input
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              label={t("License Key")}
              type="text"
              placeholder={t("License Key")}
            />
          )}
          {(downloadOption === "file" || downloadOption === "both") && (
            <Input
              value={downloadLink}
              onChange={(e) => setDownloadLink(e.target.value)}
              label={t("Download Link")}
              type="text"
              placeholder={t("Download Link")}
            />
          )}
        </div>
      )}
      <div className="flex justify-end">
        <Button
          color="primary"
          onClick={handleDownloadOptionUpdate}
          className="mt-4"
        >
          {t("Update Order")}
        </Button>
      </div>
    </div>
  );
};

export default OrderDownloadOptions;
