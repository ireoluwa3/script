import React from "react";
import Input from "@/components/elements/form/input/Input";
import Textarea from "@/components/elements/form/textarea/Textarea";
import Button from "@/components/elements/base/button/Button";
import { useTranslation } from "next-i18next";

const PersonalSection = ({
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
            {t("Personal")}
          </h3>
          <p className="max-w-xs text-sm text-muted-400">
            {t(
              "Help us to know more about you by adding your personal information, like your name and at least an email address."
            )}
          </p>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-7 ltablet:col-span-7">
        <div className="lg:max-w-xl">
          <div className="grid w-full grid-cols-12 gap-x-6 gap-y-4">
            <div className="col-span-12 md:col-span-6">
              <Input
                label={t("First Name")}
                placeholder={t("Ex: John")}
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <Input
                label={t("Last Name")}
                placeholder={t("Ex: Doe")}
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-12">
              <Input
                label={t("Email Address")}
                placeholder={t("Ex: johndoe@gmail.com")}
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-12">
              <Textarea
                label={t("Short Bio")}
                placeholder={t("Write a few words about yourself...")}
                rows={6}
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-12">
              <Input
                label={t("Phone")}
                placeholder={t("Ex: 1234567890")}
                name="phone"
                value={formData.phone}
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
export default PersonalSection;
