import React, { type FC } from "react";
import { useTranslation } from "next-i18next";
interface InputFileFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  value?: string;
  acceptedFileTypes?: string[] | null;
  label: string;
  maxFileSize?: number;
  color?: "default" | "contrast" | "muted" | "mutedContrast";
  shape?: "smooth" | "rounded" | "curved" | "full";
  error?: string;
}
const InputFileField: FC<InputFileFieldProps> = ({
  id,
  value,
  acceptedFileTypes,
  label,
  maxFileSize = 5,
  color = "default",
  shape = "smooth",
  error,
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <div className="relative w-full">
      {!!label && (
        <label className="font-sans text-[0.68rem] text-muted-400">
          {label}
        </label>
      )}
      <div
        className={`relative flex items-center justify-between border-2 px-4 py-3 transition duration-150 ease-in-out
        ${
          color === "default"
            ? "border-muted-200 bg-white hover:border-primary-500 dark:border-muted-700 dark:bg-muted-800 dark:hover:border-primary-500"
            : ""
        }
        ${
          color === "contrast"
            ? "bg-white hover:border-primary-500 dark:border-muted-800 dark:bg-muted-950 dark:hover:border-primary-500"
            : ""
        }
        ${
          color === "muted"
            ? "border-muted-200 bg-muted-100 hover:border-primary-500 dark:border-muted-700 dark:bg-muted-800 dark:hover:border-primary-500"
            : ""
        }
        ${
          color === "mutedContrast"
            ? "border-muted-200 bg-muted-100 hover:border-primary-500 dark:border-muted-800 dark:bg-muted-950 dark:hover:border-primary-500"
            : ""
        }
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
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <div className="flex items-center">
          <svg
            className="h-6 w-6 text-muted-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          <div className="ms-2">
            <span className="text-sm text-muted-600 dark:text-muted-400 line-clamp-1">
              {value ? value : "Choose a file"}
            </span>
          </div>
        </div>
        {!!value ? (
          ""
        ) : (
          <span className="hidden sm:block text-sm text-muted-500">
            {t("Max file size")} {maxFileSize} {t("MB")}
          </span>
        )}
      </div>
      {!!error && (
        <span className="text-sm text-danger-500 mt-1 px-6 pt-3">{error}</span>
      )}
    </div>
  );
};
export default InputFileField;
