import DatePicker from "@/components/elements/form/datepicker/DatePicker";
import InputFile from "@/components/elements/form/input-file/InputFile";
import Input from "@/components/elements/form/input/Input";
import Select from "@/components/elements/form/select/Select";
import ToggleSwitch from "@/components/elements/form/toggle-switch/ToggleSwitch";

const renderField = ({
  field,
  formData,
  handleInputChange,
  handleFileChange,
}: {
  field: any;
  formData: any;
  handleInputChange: any;
  handleFileChange?: any;
}) => {
  const commonProps = {
    label: field.label,
    placeholder: field.placeholder,
    name: field.name,
  };
  if (field.showIf && !field.showIf(formData)) {
    return null;
  }
  switch (field.type) {
    case "select":
      return (
        <div key={field.name} className="col-span-12">
          <Select
            {...commonProps}
            value={formData[field.name] || ""}
            options={
              field.options || [
                { label: "Disabled", value: false },
                { label: "Enabled", value: true },
              ]
            }
            onChange={(e) =>
              handleInputChange({ name: field.name, value: e.target.value })
            }
          />
          <span className="text-xs text-muted-400">{field.description}</span>
        </div>
      );
    case "date":
      return (
        <div key={field.name} className="col-span-12">
          <DatePicker
            {...commonProps}
            value={formData[field.name] || new Date()}
            onChange={(e: any) =>
              handleInputChange({
                name: field.name,
                value: new Date(e.target.value),
              })
            }
          />
          <span className="text-xs text-muted-400">{field.description}</span>
        </div>
      );
    case "switch":
      const value =
        typeof formData[field.name] === "boolean"
          ? formData[field.name]
          : formData[field.name] === "true"
          ? true
          : false;
      return (
        <div key={field.name} className="col-span-12">
          <ToggleSwitch
            {...commonProps}
            checked={value}
            sublabel={field.description}
            color={"success"}
            onChange={(e) =>
              handleInputChange({
                name: field.name,
                value: e.target.checked,
                save: true,
              })
            }
          />
        </div>
      );
    case "file":
      return (
        <div key={field.name} className="col-span-12">
          <InputFile
            color={"contrast"}
            id={field.name}
            acceptedFileTypes={[
              "image/png",
              "image/jpeg",
              "image/jpg",
              "image/gif",
              "image/svg+xml",
              "image/webp",
            ]}
            preview={formData[field.name] || ""}
            previewPlaceholder="/img/placeholder.svg"
            maxFileSize={16}
            label={`${field.label}`}
            labelAlt={`Size: ${field.size.width}x${field.size.height}px, Max File Size: 16 MB`}
            bordered
            onChange={(files) => handleFileChange(files, field)}
            onRemoveFile={() =>
              handleInputChange({ name: field.name, value: null, save: true })
            }
          />
        </div>
      );
    default:
      return (
        <div key={field.name} className="col-span-12">
          <Input
            {...commonProps}
            type={field.type}
            min={field.min}
            max={field.max}
            step={field.step}
            value={formData[field.name] || ""}
            onChange={(e) =>
              handleInputChange({
                name: field.name,
                value: e.target.value,
              })
            }
          />
        </div>
      );
  }
};

export default renderField;
