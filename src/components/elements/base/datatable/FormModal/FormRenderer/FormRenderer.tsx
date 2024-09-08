import { useDataTable } from "@/stores/datatable";
import { FormRendererProps } from "./FormRenderer.types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Input from "@/components/elements/form/input/Input";
import Select from "@/components/elements/form/select/Select";
import InputFileField from "@/components/elements/form/input-file-field/InputFileField";
import InputFileProfile from "@/components/elements/form/input-file-profile/InputFileProfile";
import ToggleSwitch from "@/components/elements/form/toggle-switch/ToggleSwitch";
import Textarea from "@/components/elements/form/textarea/Textarea";
import DatePicker from "@/components/elements/form/datepicker/DatePicker";
import {
  evaluateCondition,
  filterFormItemsByCondition,
  getNestedValue,
  isEditable,
  parseMultipleSelect,
  safeJSONParse,
  setNestedValue,
} from "@/utils/datatable";
import { CustomFields } from "../CustomFields";
import InputFile from "@/components/elements/form/input-file/InputFile";
import Checkbox from "@/components/elements/form/checkbox/Checkbox";
import Button from "../../../button/Button";
import ListBox from "@/components/elements/form/listbox/Listbox";
import { useTranslation } from "next-i18next";

const FormRendererBase = ({ formValues, setFormValues }: FormRendererProps) => {
  const { t } = useTranslation();
  const { modalItem, modalAction, formErrors } = useDataTable((state) => state);

  const isNew = modalAction?.topic === "create";
  const [filePreviews, setFilePreviews] = useState({});

  const initializeValues = useCallback(
    (formItems) => {
      const initialValues = {};
      const initialPreviews = {};

      if (isNew) return { initialValues, initialPreviews };

      const deepParseObject = (obj) => {
        if (typeof obj !== "object" || obj === null) return obj;
        const parsedObj = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
          if (typeof obj[key] === "string" && key !== "customFields") {
            try {
              parsedObj[key] = safeJSONParse(obj[key]);
            } catch (error) {
              parsedObj[key] = obj[key];
            }
          } else {
            parsedObj[key] = deepParseObject(obj[key]);
          }
        }
        return parsedObj;
      };

      const parsedModalItem = modalItem ? deepParseObject(modalItem) : {};

      const parseItemValue = (itemValue, formItem) => {
        switch (formItem.ts) {
          case "number":
            itemValue = parseFloat(itemValue);
            return isNaN(itemValue) ? formItem.defaultValue || 0 : itemValue;
          case "boolean":
            return itemValue === true || itemValue === "true";
          case "object":
            if (typeof itemValue === "string") {
              try {
                itemValue = safeJSONParse(itemValue);
              } catch (error) {
                itemValue = {};
              }
            }
            return itemValue || formItem.defaultValue || {};
          case "string":
          default:
            return itemValue || formItem.defaultValue || null;
        }
      };

      const setInitialValue = (path, itemValue, formItem) => {
        if (path) {
          const value = parseItemValue(itemValue, formItem);
          setNestedValue(initialValues, path, value);
        }
      };

      const handleFileValue = (path, value) => {
        if (value instanceof File) {
          initialPreviews[path] = URL.createObjectURL(value);
        } else if (typeof value === "string") {
          initialPreviews[path] = value;
        }
      };

      const parseFormItems = (items, pathPrefix = "") => {
        if (!items) return;

        items.forEach((item) => {
          if (!item) return;

          if (Array.isArray(item)) {
            item.forEach((nestedItem) =>
              parseFormItems([nestedItem], pathPrefix)
            );
            return;
          }

          const path = pathPrefix ? `${pathPrefix}.${item.name}` : item.name;
          let value;

          switch (item.type) {
            case "tags":
              value = parsedModalItem?.[item.name];
              break;
            case "select":
              value = parsedModalItem
                ? getNestedValue(parsedModalItem, path)
                : item.defaultValue;
              if (
                item.multiple &&
                item.structure &&
                Array.isArray(parsedModalItem?.[item.name])
              ) {
                value = parseMultipleSelect(
                  parsedModalItem[item.name],
                  item.structure
                );
              }
              break;
            case "object":
              value = parsedModalItem
                ? getNestedValue(parsedModalItem, path)
                : undefined;
              if (typeof value === "string") {
                value = safeJSONParse(value);
              }
              break;
            case "file":
              value = parsedModalItem
                ? getNestedValue(parsedModalItem, path)
                : undefined;
              handleFileValue(path, value);
              break;
            case "customFields":
              value = parsedModalItem?.customFields || item.defaultValue;
              break;
            default:
              value = parsedModalItem
                ? getNestedValue(parsedModalItem, path)
                : undefined;
              break;
          }

          setInitialValue(path, value, item);

          if (item.type === "object" && item.fields) {
            parseFormItems(item.fields, path);
          } else if (Array.isArray(item.fields)) {
            item.fields.forEach((subItem) => {
              if (Array.isArray(subItem)) {
                subItem.forEach((nestedSubItem) =>
                  parseFormItems([nestedSubItem], path)
                );
              } else {
                parseFormItems([subItem], path);
              }
            });
          }
        });
      };

      parseFormItems(formItems);
      return { initialValues, initialPreviews };
    },
    [modalItem, isNew]
  );

  const { initialValues, initialPreviews } = useMemo(
    () => initializeValues(modalAction?.formItems),
    [initializeValues, modalAction?.formItems]
  );

  useEffect(() => {
    setFormValues((prevValues) => ({
      ...prevValues,
      ...initialValues,
    }));
    setFilePreviews(initialPreviews);
  }, [initialValues, initialPreviews, setFormValues]);

  const selectAllTags = (tagName, options) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [tagName]: [...options],
    }));
  };

  const clearAllTags = (tagName) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [tagName]: [],
    }));
  };

  const handleChange = useCallback(
    (name, values, type, ts = "string", multiple = false) => {
      if (type === "file") {
        if (!values.length) return;

        const formItem = modalAction?.formItems
          .flat()
          .find((item) => item.name === name);
        const { maxSize } = formItem;
        const maxSizeBytes = (maxSize ? maxSize : 16) * 1024 * 1024;

        const files = multiple ? Array.from(values) : [values[0]];
        files.forEach((file) => {
          if (maxSizeBytes && file.size > maxSizeBytes) {
            alert(`File size should not exceed ${maxSize} MB`);
            if (filePreviews[name]) {
              URL.revokeObjectURL(filePreviews[name]);
            }
            return;
          }
          setFilePreviews((prev) => ({
            ...prev,
            [name]: URL.createObjectURL(file),
          }));
          setFormValues((prev) => ({
            ...prev,
            [name]: {
              data: file,
              width: formItem.width,
              height: formItem.height,
            },
          }));
        });
      } else {
        let formattedValue = values;
        switch (ts) {
          case "number":
            const decimalPart = values.toString().split(".")[1];
            if (decimalPart) {
              const firstDecimalDigit = decimalPart[0];
              const significantPart = decimalPart.slice(1);
              if (!(firstDecimalDigit === "0" && !significantPart)) {
                formattedValue = parseFloat(values);
              }
            } else {
              formattedValue = parseFloat(values);
            }
            break;
          case "boolean":
            formattedValue = Boolean(values);
            break;
          case "object":
            formattedValue = values || {};
            break;
          default:
            formattedValue = values || null;
        }
        if (type === "select" && multiple) {
          return setFormValues((prevValues) => ({
            ...prevValues,
            [name]: values,
          }));
        } else if (type === "select") {
          return setFormValues((prevValues) => ({
            ...prevValues,
            [name]: values,
          }));
        }

        setFormValues((prevValues) => {
          const newValues = { ...prevValues };
          setNestedValue(newValues, name, formattedValue);
          return newValues;
        });

        // Update dependent fields based on the conditions
        if (modalAction?.formItems) {
          const formItems = modalAction.formItems.flat();
          formItems.forEach((item) => {
            if (item.conditions && item.conditions[name]) {
              const conditionValue = item.conditions[name][formattedValue];
              setFormValues((prevValues) => ({
                ...prevValues,
                [item.name]: conditionValue,
              }));
            }
          });
        }
      }
    },
    [setFormValues, filePreviews, modalAction?.formItems]
  );

  const renderFormField = useCallback(
    (formItem, parentPath = "") => {
      if (!formItem) return null;

      const path = parentPath
        ? `${parentPath}.${formItem.name}`
        : formItem.name;
      const value = getFormItemValue(formItem, path);
      const error = getNestedValue(formErrors, path);
      const filePreview = filePreviews[path];

      if (formItem.notNull && !value) {
        return null;
      }
      if (
        formItem.condition &&
        !evaluateCondition(formItem.condition, formValues)
      ) {
        return null;
      }

      const editable = isEditable(formItem.editable, formValues);

      // Update options based on conditions
      let options = formItem.options || [];
      let isDisabled = false;
      let defaultOptionLabel = t("Select an option");

      if (formItem.conditions) {
        const conditionKey = Object.keys(formItem.conditions)[0];
        const conditionValue = formValues[conditionKey];
        if (!conditionValue) {
          isDisabled = true;
          defaultOptionLabel = t(`Please select a ${conditionKey}`);
        } else {
          options = formItem.conditions[conditionKey][conditionValue] || [];
        }
      }

      // Add the default "Select an option" value
      if (options.length > 0 || isDisabled) {
        options = [{ value: null, label: defaultOptionLabel }, ...options];
      }

      const commonProps = {
        name: path,
        label: formItem.label,
        placeholder: formItem.placeholder,
        readOnly: !editable,
        disabled: !editable,
        onChange: (e) =>
          handleChange(path, e.target.value, formItem.type, formItem.ts),
        setFirstErrorInputRef: (inputRef) =>
          setFirstErrorInputRef(inputRef, error),
      };

      switch (formItem.type) {
        case "input":
          return (
            <Input
              key={path}
              value={value}
              {...commonProps}
              error={error}
              icon={formItem.icon}
              type={formItem.ts === "number" ? "number" : "text"}
              step={formItem.ts === "number" ? "any" : undefined}
            />
          );
        case "select":
          return renderSelectField(
            formItem,
            path,
            value,
            error,
            commonProps,
            options,
            isDisabled,
            editable
          );
        case "datetime":
          return renderDateTimeField(formItem, path, value, error, commonProps);
        case "tags":
          return renderTagsField(formItem, value);
        case "file":
          return renderFileField(formItem, path, value, filePreview, error);
        case "switch":
          return renderSwitchField(formItem, path, value, error);
        case "textarea":
          return (
            <Textarea key={path} {...commonProps} value={value} error={error} />
          );
        case "date":
          return <DatePicker key={path} {...commonProps} value={value} />;
        case "customFields":
          return (
            <CustomFields
              key={path}
              value={
                typeof value === "string" ? safeJSONParse(value) : value || {}
              }
              onFieldsChange={(fields) =>
                handleChange(path, fields, "customFields")
              }
            />
          );
        case "object":
          return renderObjectField(formItem, path);
        default:
          return null;
      }
    },
    [formValues, formErrors, filePreviews, handleChange]
  );

  const renderObjectField = (formItem, path) => (
    <div
      key={path}
      className={
        formItem.label &&
        "border p-4 rounded-md border-gray-300 dark:border-gray-600 border-dashed"
      }
    >
      {formItem.label && (
        <p className="text-sm text-muted-700 dark:text-muted-300 font-semibold mb-2">
          {t(formItem.label)}
        </p>
      )}
      <div className="mx-auto w-full space-y-4">
        {renderFormFields(formItem.fields, path)}
      </div>
    </div>
  );

  const renderSelectField = (
    formItem,
    path,
    value,
    error,
    commonProps,
    options,
    isDisabled,
    editable
  ) => {
    if (formItem.multiple) {
      return (
        <div key={path}>
          <ListBox
            key={path}
            error={error}
            multiple
            disabled={!editable || isDisabled}
            selected={value}
            setSelected={(newSelected) => {
              const updatedSelected = formItem.options.filter((option) =>
                newSelected.some((sel) => sel.value === option.value)
              );
              handleChange(
                path,
                updatedSelected,
                formItem.type,
                formItem.ts,
                formItem.multiple
              );
            }}
            options={options}
          />
          {error && <p className="text-danger-500 text-xs mt-2">{error}</p>}
        </div>
      );
    } else {
      return (
        <div key={path}>
          <Select
            {...commonProps}
            value={value}
            options={options}
            error={error}
            disabled={!editable || isDisabled}
            onChange={(e) =>
              handleChange(path, e.target.value, formItem.type, formItem.ts)
            }
          />
        </div>
      );
    }
  };

  const renderDateTimeField = (formItem, path, value, error, commonProps) => (
    <div key={path}>
      <DatePicker
        {...commonProps}
        value={value}
        onChange={(e) =>
          handleChange(
            path,
            new Date((e.target as HTMLInputElement).value),
            formItem.type
          )
        }
        icon="ion:calendar-outline"
        placeholder={t("Pick a date")}
      />
      {error && <p className="text-danger-500 text-xs mt-2">{error}</p>}
    </div>
  );

  const renderTagsField = (formItem, value) => {
    const selectedCount = Array.isArray(value) ? value.length : 0;
    return (
      <div key={formItem.name} className="card-dashed">
        <div className="flex justify-between items-center mb-5">
          <div className="text-sm text-muted-400 dark:text-muted-600">
            {t("Selected")} {formItem.name}: {selectedCount}
          </div>
          <div className="flex gap-4">
            <Button
              color="success"
              size="sm"
              onClick={() => selectAllTags(formItem.name, formItem.options)}
            >
              {t("Select All")}
            </Button>
            <Button
              color="danger"
              size="sm"
              onClick={() => clearAllTags(formItem.name)}
            >
              {t("Clear All")}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {formItem.options.map((item, index) => (
            <Checkbox
              key={index}
              label={item.name}
              checked={
                Array.isArray(value) &&
                value.some((v) => Number(v.id) === Number(item.id))
              }
              color="success"
              onChange={() => {
                setFormValues((prev) => {
                  const existingTags = Array.isArray(prev[formItem.name])
                    ? prev[formItem.name]
                    : [];
                  return existingTags.some(
                    (v) => Number(v.id) === Number(item.id)
                  )
                    ? {
                        ...prev,
                        [formItem.name]: existingTags.filter(
                          (v) => Number(v.id) !== Number(item.id)
                        ),
                      }
                    : { ...prev, [formItem.name]: [...existingTags, item] };
                });
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderFileField = (formItem, path, value, filePreview, error) => {
    switch (formItem.fileType) {
      case "avatar":
        return (
          <div key={path} className="w-full pb-5 text-center">
            <InputFileProfile
              id={path}
              value={value ? value.name : ""}
              preview={filePreview}
              previewSize="lg"
              color="primary"
              onChange={(e) => handleChange(path, e.target.files, "file")}
              onRemoveFile={() => {
                setFormValues((prev) => ({ ...prev, [path]: "" }));
                setFilePreviews((prev) => ({ ...prev, [path]: "" }));
              }}
            />
            {error && <p className="text-danger-500 text-sm mt-2">{error}</p>}
          </div>
        );
      case "image":
        return (
          <span key={path}>
            <InputFile
              id={path}
              acceptedFileTypes={[
                "image/png",
                "image/jpeg",
                "image/jpg",
                "image/gif",
                "image/svg+xml",
                "image/webp",
              ]}
              preview={filePreview}
              previewPlaceholder="/img/placeholder.svg"
              maxFileSize={formItem.maxSize || 16}
              label={`${t("Max File Size")}: ${formItem.maxSize || 16} MB`}
              labelAlt={`${t("Size")}: ${formItem.width}x${formItem.height} px`}
              bordered
              color="default"
              onChange={(files) => handleChange(path, files, "file")}
              onRemoveFile={() =>
                setFormValues((prev) => ({ ...prev, [path]: null }))
              }
            />
            {error && <p className="text-danger-500 text-sm mt-2">{error}</p>}
          </span>
        );
      default:
        return (
          <span key={path}>
            <InputFileField
              id={path}
              label={`${t("Max File Size")}: ${formItem.maxSize || 16} MB`}
              value={value ? value.name : ""}
              maxFileSize={formItem.maxSize || 16}
              acceptedFileTypes={formItem.acceptedFileTypes}
              onChange={(e) => handleChange(path, e.target.files, "file")}
            />
            {error && <p className="text-danger-500 text-sm mt-2">{error}</p>}
          </span>
        );
    }
  };

  const renderSwitchField = (formItem, path, value, error) => (
    <span key={path}>
      <ToggleSwitch
        id={path}
        name={path}
        color="primary"
        label={t(formItem.label)}
        checked={!!value}
        onChange={(e) =>
          handleChange(path, e.target.checked, "switch", formItem.ts)
        }
        setFirstErrorInputRef={(inputRef) =>
          setFirstErrorInputRef(inputRef, error)
        }
      />
      {error && <p className="text-danger-500 text-sm mt-2">{error}</p>}
    </span>
  );

  const getFormItemValue = (formItem, path) => {
    return formItem.type === "tags" ||
      (formItem.type === "select" && formItem.multiple && formItem.structure)
      ? formValues[formItem.name]
      : getNestedValue(formValues, path);
  };

  const renderFormFields = useCallback(
    (formItems, parentPath = "") => {
      const activeItems = filterFormItemsByCondition(formItems, formValues);
      return activeItems
        .flatMap((formItem, index) => {
          if (Array.isArray(formItem)) {
            const gridCols = `grid-cols-${formItem.length}`;
            return (
              <div key={index} className={`grid gap-4 ${gridCols}`}>
                {formItem.map((nestedItem) =>
                  renderFormField(nestedItem, parentPath)
                )}
              </div>
            );
          } else {
            return (
              <div key={index} className="space-y-5">
                {renderFormField(formItem, parentPath)}
              </div>
            );
          }
        })
        .filter(Boolean); // Filter out null items
    },
    [renderFormField, formValues]
  );

  const firstErrorInputRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (firstErrorInputRef.current) {
      firstErrorInputRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setTimeout(() => {
        firstErrorInputRef.current?.focus();
      }, 200);
    }
  }, [formErrors]);

  const setFirstErrorInputRef = (inputRef, error) => {
    if (error && !firstErrorInputRef.current) {
      firstErrorInputRef.current = inputRef;
    } else if (!error && firstErrorInputRef.current === inputRef) {
      firstErrorInputRef.current = null;
    }
  };

  return <>{renderFormFields(modalAction?.formItems)}</>;
};

export const FormRenderer = FormRendererBase;
