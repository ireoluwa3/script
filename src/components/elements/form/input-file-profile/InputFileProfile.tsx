import React, { type FC } from "react";
import { Icon, type IconifyIcon } from "@iconify/react";
import Avatar from "@/components/elements/base/avatar/Avatar";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import Tooltip from "@/components/elements/base/tooltips/Tooltip";
import { useTranslation } from "next-i18next";
interface InputFileProfileProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  id: string;
  value?: string;
  preview?: string;
  previewSize?: "lg" | "xl";
  previewIcon?: string | IconifyIcon;
  acceptedFileTypes?: string[] | null;
  color?:
    | "default"
    | "contrast"
    | "muted"
    | "primary"
    | "info"
    | "success"
    | "warning"
    | "danger";
  shape?: "smooth" | "rounded" | "curved" | "full";
  onRemoveFile?: () => void;
}
const InputFileProfile: FC<InputFileProfileProps> = ({
  id,
  value,
  preview,
  previewSize = "lg",
  previewIcon = "fluent:person-24-filled",
  acceptedFileTypes = ["image/*"],
  color = "default",
  shape = "full",
  onRemoveFile,
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={`relative inline-flex items-center justify-center border-2 border-muted-300 dark:border-muted-700
          ${shape === "rounded" ? "rounded-md" : ""}
          ${shape === "smooth" ? "rounded-lg" : ""}
          ${shape === "curved" ? "rounded-xl" : ""}
          ${shape === "full" ? "rounded-full" : ""}
      `}
    >
      <input
        type="file"
        id={id}
        name={id}
        accept={acceptedFileTypes ? acceptedFileTypes.join(",") : undefined}
        {...props}
        className={`absolute inset-0 z-[2] h-full w-full cursor-pointer opacity-0 ${
          value ? "pointer-events-none" : ""
        }`}
      />
      <Avatar size={previewSize} shape={shape} src={preview} text="">
        {value || preview ? (
          ""
        ) : (
          <div className="absolute start-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-muted-500 dark:text-muted-600">
            <Icon
              icon={previewIcon}
              className={`
              ${previewSize === "lg" ? "h-8 w-8" : ""} 
              ${previewSize === "xl" ? "h-10 w-10" : ""}
            `}
            />
          </div>
        )}
      </Avatar>

      {value ? (
        <div
          className={`absolute 
            ${previewSize === "lg" ? "bottom-0 end-0" : ""}
            ${previewSize === "xl" ? "bottom-0.5 end-0.5" : ""}
          `}
          onClick={() => {
            onRemoveFile?.();
          }}
        >
          <Tooltip content={t("Remove file")} position="top">
            <IconButton shape="full" size="sm">
              <Icon icon="lucide:x" className="h-3 w-3" />
            </IconButton>
          </Tooltip>
        </div>
      ) : (
        ""
      )}

      {!value ? (
        <label
          htmlFor={id}
          className={`absolute 
            ${previewSize === "lg" ? "bottom-0 end-0" : ""}
            ${previewSize === "xl" ? "bottom-0.5 end-0.5" : ""}
          `}
        >
          <Tooltip content={t("Add picture")} position="top">
            <IconButton color={color} shape="full" size="sm">
              <Icon icon="lucide:plus" className="h-4 w-4" />
            </IconButton>
          </Tooltip>
        </label>
      ) : (
        ""
      )}
    </div>
  );
};
export default InputFileProfile;
