import React from "react";
import InputFile from "@/components/elements/form/input-file/InputFile";
import Button from "@/components/elements/base/button/Button";
import { useTranslation } from "next-i18next";

const PictureSection = ({
  formData,
  handleFileChange,
  handleCancel,
  handleSave,
  hasChanges,
  setFormData,
  setChanges,
  isLoading,
}) => {
  const { t } = useTranslation();
  return (
    <div className="grid w-full grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4 ltablet:col-span-4">
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-medium tracking-wide text-muted-800 dark:text-muted-100">
            {t("Picture")}
          </h3>
          <p className="max-w-xs text-sm text-muted-400">
            {t(
              "Manage your profile picture or upload a new one. Having a nice profile picture helps your network to grow."
            )}
          </p>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-7 ltablet:col-span-7">
        <div className="lg:max-w-xl">
          <div className="grid w-full grid-cols-12 gap-x-6 gap-y-4">
            <div className="col-span-12 gap-5">
              <InputFile
                id="profile-picture"
                acceptedFileTypes={[
                  "image/png",
                  "image/jpeg",
                  "image/jpg",
                  "image/gif",
                  "image/svg+xml",
                  "image/webp",
                ]}
                preview={formData.avatar || ""}
                previewPlaceholder="/img/avatars/placeholder.webp"
                maxFileSize={16}
                label={`${t("Max File Size")}: ${16} MB`}
                bordered
                color="contrast"
                onChange={(files) => handleFileChange(files)}
                onRemoveFile={() => {
                  setFormData({ ...formData, avatar: "" });
                  setChanges((prevChanges) => ({
                    ...prevChanges,
                    avatar: null,
                  }));
                }}
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
export default PictureSection;
