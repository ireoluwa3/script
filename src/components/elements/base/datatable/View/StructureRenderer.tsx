import React, { Suspense, useCallback, useMemo } from "react";
import { MashImage } from "@/components/elements/MashImage";
import Input from "@/components/elements/form/input/Input";
import Textarea from "@/components/elements/form/textarea/Textarea";
import Select from "@/components/elements/form/select/Select";
import ToggleSwitch from "@/components/elements/form/toggle-switch/ToggleSwitch";
import DatePicker from "@/components/elements/form/datepicker/DatePicker";
import Checkbox from "@/components/elements/form/checkbox/Checkbox";
import Card from "@/components/elements/base/card/Card";
import {
  getNestedValue,
  parseMultipleSelect,
  robustJSONParse,
  safeJSONParse,
  setNestedValue,
} from "@/utils/datatable";
import {
  evaluateCondition,
  filterFormItemsByCondition,
} from "@/utils/datatable";
import { CustomFields } from "./CustomFields";
import { Tags } from "./Tags";
import { useTranslation } from "next-i18next";
import InfoBlock from "@/components/elements/base/infoBlock";
import { capitalize } from "lodash";

const lazyImport = (componentKey) => {
  return React.lazy(() =>
    import(`@/components/elements/structures/${componentKey}`).catch(() => {
      const { t } = useTranslation();
      return {
        default: () => (
          <Card shape="smooth" color="danger" className="p-6">
            <h5 className="font-sans text-base font-semibold text-muted-800">
              {t("Failed to load `")} {componentKey}`
            </h5>
            <p className="font-sans text-sm text-muted-400">
              {t(
                "There was an error loading the component. Please try again or contact support if the problem persists."
              )}
            </p>
          </Card>
        ),
      };
    })
  );
};
const componentsMap = {
  Input,
  Textarea,
  DatePicker,
  Image: MashImage,
  Select,
  ToggleSwitch,
  InfoBlock,
  Checkbox,
};
const StructureRenderer = ({ formValues, modalItem }) => {
  const { t } = useTranslation();

  const initializeValues = (formItems) => {
    const initialValues = {};
    const initialPreviews = {};

    const deepParseObject = (obj) => {
      if (typeof obj !== "object" || obj === null) return obj;
      const parsedObj = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        if (typeof obj[key] === "string") {
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

    const setInitialValue = (path, itemValue, formItem) => {
      if (!path) return;
      switch (formItem.ts) {
        case "number":
          itemValue = parseFloat(itemValue);
          if (isNaN(itemValue)) itemValue = formItem.defaultValue || 0;
          break;
        case "boolean":
          itemValue = itemValue === true || itemValue === "true";
          break;
        case "object":
          if (typeof itemValue === "string") {
            itemValue = robustJSONParse(itemValue);
          }
          itemValue = itemValue || formItem.defaultValue || {};
          break;
        case "string":
        default:
          itemValue = itemValue || formItem.defaultValue || null;
          break;
      }
      setNestedValue(initialValues, path, itemValue);
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
              : undefined;
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
              ? item.fields
                ? getNestedValue(parsedModalItem, path)
                : parsedModalItem[item.name]
              : undefined;

            if (typeof value === "string") {
              value = robustJSONParse(value);
            }

            break;
          case "file":
            value = parsedModalItem
              ? getNestedValue(parsedModalItem, path)
              : undefined;
            if (value instanceof File) {
              initialPreviews[path] = URL.createObjectURL(value);
            } else if (typeof value === "string") {
              initialPreviews[path] = value;
            }
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
  };

  const { initialValues } = useMemo(
    () => initializeValues(formValues),
    [modalItem]
  );
  const getFormItemValue = (formItem, path) => {
    return (formItem.type === "select" &&
      formItem.multiple &&
      formItem.structure) ||
      formItem.type === "tags" ||
      (formItem.type === "object" && !formItem.fields)
      ? initialValues[formItem.name]
      : getNestedValue(initialValues, path);
  };
  const isChecked = (value) => {
    if (typeof value === "boolean") {
      return value;
    } else if (typeof value === "string") {
      return value === "true";
    } else {
      return false;
    }
  };
  const renderField = useCallback(
    (formItem, parentPath = "") => {
      const path = parentPath
        ? `${parentPath}.${formItem.name}`
        : formItem.name;
      const value = getFormItemValue(formItem, path);

      if (formItem.notNull && !value) return null;

      if (
        formItem.condition &&
        !evaluateCondition(formItem.condition, initialValues)
      )
        return null;
      const commonProps = {
        name: path,
        label: formItem.label,
        placeholder: formItem.placeholder,
        readOnly: true,
      };

      if (formItem.fields && !formItem.type) {
        return renderObjectField(formItem, path);
      }

      const Component = formItem.component
        ? componentsMap[formItem.component]
        : null;
      if (Component) {
        return <Component {...formItem} value={value} />;
      }

      switch (formItem.type) {
        case "input":
        case "select":
          return <Input key={path} {...commonProps} value={value} />;
        case "datetime":
          return <DatePicker key={path} {...commonProps} value={value} />;
        case "textarea":
          return <Textarea key={path} {...commonProps} value={value} />;
        case "file":
          return (
            <MashImage
              key={path}
              src={value || "/img/placeholder.svg"}
              alt={formItem.label}
              width={64}
              height={64}
            />
          );
        case "switch":
        case "checkbox":
          return (
            <Checkbox
              key={path}
              {...commonProps}
              checked={isChecked(value)}
              color={formItem.color || "primary"}
            />
          );
        case "customFields":
          if (!Array.isArray(value)) return null;
          return <CustomFields key={path} value={value} />;
        case "component":
          const DynamicComponent = lazyImport(formItem.filepath);
          const filteredData = Object.keys(formItem.props).reduce(
            (obj, key) => {
              obj[key] = value[formItem.name]?.[key];
              return obj;
            },
            {}
          );
          return (
            <Suspense
              key={path}
              fallback={
                <div>
                  {t("Loading")}
                  {formItem.name}...
                </div>
              }
            >
              <DynamicComponent
                field={formItem.props}
                data={filteredData}
                key={formItem.name}
              />
            </Suspense>
          );
        case "tags":
          return (
            <Tags key={path} {...commonProps} value={value} item={formItem} />
          );
        case "object":
          if (!formItem.fields) {
            if (typeof value === "object") {
              return Object.entries(value).map(([key, val]) => (
                <Input
                  key={`${path}.${key}`}
                  name={`${path}.${key}`}
                  label={capitalize(key)}
                  value={val as string}
                  readOnly
                />
              ));
            }
            return (
              <Input
                key={path}
                {...commonProps}
                value={JSON.stringify(value)}
              />
            );
          }
          return renderObjectField(formItem, path);
        default:
          return (
            <p key={path}>
              {t("Unknown field type")} {formItem.type}
            </p>
          );
      }
    },
    [initialValues, t]
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
        {renderFields(formItem.fields, path)}
      </div>
    </div>
  );
  const renderFields = useCallback(
    (formItems, parentPath = "") => {
      const activeItems = filterFormItemsByCondition(formItems, initialValues);
      return activeItems.map((formItem, index) => {
        const fieldClassName = formItem.className || "";
        if (Array.isArray(formItem)) {
          const gridCols = `grid-cols-${formItem.length}`;
          return (
            <div
              key={index}
              className={`grid gap-4 ${gridCols} ${fieldClassName}`}
            >
              {formItem.map((nestedItem) =>
                renderField(nestedItem, parentPath)
              )}
            </div>
          );
        } else if (formItem.fields && !formItem.type) {
          const layoutClass = formItem.fields
            ? `flex justify-start ${
                formItem.grid === "column" ? "flex-col" : "flex-row"
              } gap-x-5 gap-y-2`
            : "col-span-1";
          return (
            <div key={index} className={`${layoutClass} ${fieldClassName}`}>
              {formItem.fields
                ? renderFields(formItem.fields, "")
                : renderField(formItem, "")}
            </div>
          );
        } else {
          return (
            <div key={index} className={`col-span-1 ${fieldClassName}`}>
              {renderField(formItem, parentPath)}
            </div>
          );
        }
      });
    },
    [renderField, initialValues]
  );
  return <div className="space-y-4">{renderFields(formValues)}</div>;
};
export default StructureRenderer;
