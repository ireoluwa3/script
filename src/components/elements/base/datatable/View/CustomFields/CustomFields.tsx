import { CustomFieldsProps } from "./CustomFields.types";
import Input from "@/components/elements/form/input/Input";
import ToggleSwitch from "@/components/elements/form/toggle-switch/ToggleSwitch";
import { useTranslation } from "next-i18next";
const CustomFieldsBase = ({ value = [] }: CustomFieldsProps) => {
  const { t } = useTranslation();
  return (
    <div className="card-dashed space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm text-muted-400 dark:text-muted-600">
          {t("Custom Fields")}
        </label>
      </div>
      {value?.map((field, index) => (
        <div key={index} className="flex gap-4">
          <Input
            type="text"
            placeholder={t("Field Name")}
            value={field.title}
            readOnly={true}
          />
          <Input
            type="text"
            placeholder={t("Field Type")}
            value={field.type}
            readOnly={true}
          />
          <ToggleSwitch
            id={`required-${index}`}
            label={t("Required")}
            color="primary"
            checked={field.required}
          />
        </div>
      ))}
    </div>
  );
};
export const CustomFields = CustomFieldsBase;
