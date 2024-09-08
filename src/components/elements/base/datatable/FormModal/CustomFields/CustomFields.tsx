import { useEffect, useState } from "react";
import { CustomFieldsProps } from "./CustomFields.types";
import Input from "@/components/elements/form/input/Input";
import Select from "@/components/elements/form/select/Select";
import ToggleSwitch from "@/components/elements/form/toggle-switch/ToggleSwitch";
import IconButton from "../../../button-icon/IconButton";
import { Icon } from "@iconify/react";
import { useTranslation } from "next-i18next";
const CustomFieldsBase = ({
  value = [],
  onFieldsChange,
}: CustomFieldsProps) => {
  const { t } = useTranslation();
  const [customFields, setCustomFields] = useState<CustomField[]>(value);
  useEffect(() => {
    if (Array.isArray(value)) {
      setCustomFields(value);
    }
  }, [value]);
  const addField = () => {
    const newField: CustomField = {
      title: "",
      type: "input",
      required: false,
    };
    const updatedFields = [...customFields, newField];
    setCustomFields(updatedFields);
    onFieldsChange?.(updatedFields);
  };
  const updateField = (
    index: number,
    field: keyof CustomField,
    value: string | boolean
  ) => {
    const newFields = [...customFields];
    newFields[index] = { ...newFields[index], [field]: value };
    setCustomFields(newFields);
    onFieldsChange?.(newFields);
  };
  const removeField = (index: number) => {
    const newFields = [...customFields];
    newFields.splice(index, 1);
    setCustomFields(newFields);
    onFieldsChange?.(newFields);
  };
  return (
    <div className="card-dashed space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm text-muted-400 dark:text-muted-600">
          {t("Custom Fields")}
        </label>
        <IconButton
          variant="pastel"
          color="success"
          onClick={addField}
          className="flex items-center"
          size={"sm"}
        >
          <Icon icon="ph:plus" className="h-5 w-5" />
        </IconButton>
      </div>
      {Array.isArray(customFields) &&
        customFields.map((field, index) => (
          <div key={index} className="flex gap-4">
            <Input
              type="text"
              placeholder={t("Field Name")}
              value={field.title}
              onChange={(e) => updateField(index, "title", e.target.value)}
            />
            <Select
              value={field.type}
              options={[
                { value: "input", label: "Input" },
                { value: "textarea", label: "Textarea" },
              ]}
              onChange={(e) => updateField(index, "type", e.target.value)}
            />
            <ToggleSwitch
              id={`required-${index}`}
              label={t("Required")}
              color="primary"
              checked={field.required}
              onChange={(e) => updateField(index, "required", e.target.checked)}
            />
            <IconButton
              variant="pastel"
              color="danger"
              onClick={() => removeField(index)}
            >
              <Icon icon="ph:x" className="h-5 w-5" />
            </IconButton>
          </div>
        ))}
    </div>
  );
};
export const CustomFields = CustomFieldsBase;
