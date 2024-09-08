import React from "react";
import Input from "@/components/elements/form/input/Input";
import Button from "@/components/elements/base/button/Button";
import { useTranslation } from "next-i18next";

const SocialMediaSection = ({
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
            {t("Social Media")}
          </h3>
          <p className="max-w-xs text-sm text-muted-400">
            {t(
              "Add your social media profiles so that people can connect with you on other platforms."
            )}
          </p>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-7 ltablet:col-span-7">
        <div className="lg:max-w-xl">
          <div className="grid w-full grid-cols-12 gap-x-6 gap-y-4">
            <div className="col-span-12 md:col-span-6">
              <Input
                label={t("Facebook URL")}
                icon="fa6-brands:facebook-f"
                placeholder={t("Ex: facebook.com/johndoe")}
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <Input
                label={t("Twitter URL")}
                icon="fa6-brands:twitter"
                placeholder={t("Ex: twitter.com/johndoe")}
                name="twitter"
                value={formData.twitter}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <Input
                label={t("Dribbble URL")}
                icon="fa6-brands:dribbble"
                placeholder={t("Ex: dribbble.com/johndoe")}
                name="dribbble"
                value={formData.dribbble}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <Input
                label={t("Instagram URL")}
                icon="fa6-brands:instagram"
                placeholder={t("Ex: instagram.com/johndoe")}
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <Input
                label={t("Github URL")}
                icon="fa6-brands:github"
                placeholder={t("Ex: github.com/johndoe")}
                name="github"
                value={formData.github}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <Input
                label={t("Gitlab URL")}
                icon="fa6-brands:gitlab"
                placeholder={t("Ex: gitlab.com/johndoe")}
                name="gitlab"
                value={formData.gitlab}
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
export default SocialMediaSection;
