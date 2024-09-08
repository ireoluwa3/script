import React from "react";
import Input from "@/components/elements/form/input/Input";
import Button from "@/components/elements/base/button/Button";
import { useTranslation } from "next-i18next";

const AddressSection = ({
  formData,
  handleInputChange,
  handleCancel,
  handleSave,
  hasChanges,
  isLoading,
}) => {
  const { t } = useTranslation();
  return (
    <div className="grid w-full grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4 ltablet:col-span-4">
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-medium tracking-wide text-muted-800 dark:text-muted-100">
            {t("Address")}
          </h3>
          <p className="max-w-xs text-sm text-muted-400">
            {t("Provide your address details.")}
          </p>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-7 ltablet:col-span-7">
        <div className="lg:max-w-xl">
          <div className="grid w-full grid-cols-12 gap-x-6 gap-y-4">
            <div className="col-span-12 md:col-span-6">
              <Input
                label={t("Address")}
                placeholder={t("Enter address")}
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <Input
                label={t("City")}
                placeholder={t("Enter city")}
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <Input
                label={t("Country")}
                placeholder={t("Enter country")}
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <Input
                label={t("Zip")}
                placeholder={t("Enter zip")}
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
              />
            </div>
            {hasChanges && (
              <div className="col-span-12 flex justify-end space-x-4">
                <Button color="default" onClick={handleCancel}>
                  {t("Cancel")}
                </Button>
                <Button
                  color="primary"
                  onClick={handleSave}
                  loading={isLoading}
                >
                  {t("Save Changes")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddressSection;
