export const getAdjustedActionsForItem = (
  isParanoid,
  actions,
  item
): DropdownActionsConfig[] => {
  const isDeleted = item.deletedAt != null;

  if (isParanoid && isDeleted) {
    const filteredActions = actions?.filter(
      (action) => action.topic !== "delete"
    );

    const deleteAction = actions?.find((action) => action.topic === "delete");

    const restoreAction: DropdownActionsConfig = {
      ...deleteAction,
      name: "Restore",
      label: "Restore record",
      icon: "ph:arrow-clockwise",
      topic: "restore",
    };

    const permanentDeleteAction: DropdownActionsConfig = {
      ...deleteAction,
      name: "Delete Permanently",
      label: "Permanently delete record from the system",
      icon: "ph:trash-simple-duotone",
      topic: "permanent-delete",
    };

    if (filteredActions) {
      return [...filteredActions, restoreAction, permanentDeleteAction];
    }
  }

  return actions || [];
};

export const generateCrudActions = (
  endpoint: string,
  canView?: boolean,
  canCreate?: boolean,
  canImport?: boolean,
  canEdit?: boolean,
  canDelete?: boolean,
  isParanoid?: boolean
): {
  navActionsConfig: NavActionsConfig[];
  dropdownActionsConfig: DropdownActionsConfig[];
  showDeletedAction?: NavActionsConfig;
} => {
  const navActionsConfig: NavActionsConfig[] = [];
  const dropdownActionsConfig: DropdownActionsConfig[] = [];
  let showDeletedAction: NavActionsConfig | undefined;

  if (isParanoid) {
    showDeletedAction = {
      name: "Trash",
      label: "Trash",
      sublabel: "Show deleted",
      icon: "ph:trash-duotone",
      type: "checkbox",
      color: "danger",
      topic: "showDeleted",
    };
  }

  if (canImport) {
    navActionsConfig.push({
      name: "Import",
      label: "Import",
      icon: "solar:import-line-duotone",
      color: "primary",
      type: "modal",
      modalType: "form",
      modelSize: "2xl",
      topic: "import",
      api: `${endpoint}/import`,
      method: "POST",
    });
  }

  if (canCreate) {
    navActionsConfig.push({
      name: "Create",
      label: "Create",
      icon: "akar-icons:plus",
      color: "success",
      type: "modal",
      modalType: "form",
      modelSize: "2xl",
      topic: "create",
      api: `${endpoint}`,
      method: "POST",
    });
  }

  if (canView) {
    dropdownActionsConfig.push({
      name: "View",
      label: "View",
      icon: "ph:eye-duotone",
      type: "panel",
      side: "right",
      modelSize: "lg",
      api: `${endpoint}/:id`,
      method: "GET",
    });
  }

  if (canEdit) {
    dropdownActionsConfig.push({
      name: "Edit",
      label: "Edit",
      icon: "ph:pencil-duotone",
      type: "modal",
      modalType: "form",
      modelSize: "2xl",
      topic: "edit",
      api: `${endpoint}/:id`,
      method: "PUT",
    });
  }

  if (canDelete) {
    dropdownActionsConfig.push({
      name: "Delete",
      label: "Delete",
      icon: "ph:trash-duotone",
      type: "modal",
      modalType: "confirmation",
      topic: "delete",
      api: `${endpoint}/:id`,
      method: "DELETE",
    });
  }

  return { navActionsConfig, dropdownActionsConfig, showDeletedAction };
};
export const safeJSONParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str; // return the original string if parsing fails
  }
};

export const getNestedValue = (obj, path) => {
  if (!path) return undefined;

  // Split the path on commas to handle multiple fields and static text
  const parts = path.split(/,\s*/);

  // Map each part to its actual value or return it directly if it's a static string
  const values = parts.map((part) => {
    // Check if the part is a static string (enclosed in single quotes)
    if (part.startsWith("'") && part.endsWith("'")) {
      return part.slice(1, -1);
    }
    // Otherwise, treat it as a path to object properties
    return part.split(".").reduce((acc, key) => acc && acc[key], obj);
  });

  // Join all parts to form the final string
  return values.join("");
};

export const getObjectNestedValue = (obj, path) => {
  if (!path) return undefined;

  return path.split(".").reduce((acc, key) => acc && acc[key], obj);
};

export const setNestedValue = (obj, path, value) => {
  if (!path) {
    console.error("Path is undefined or empty:", path);
    return;
  }

  const keys = path.split(".");
  const lastKey = keys.pop();

  const lastObj = keys.reduce((acc, key) => {
    if (acc && typeof acc === "object" && Object.isExtensible(acc)) {
      if (typeof acc[key] !== "object" || acc[key] === null) {
        acc[key] = {}; // Ensure the path is initialized as an object
      }
      return acc[key];
    }
    return undefined;
  }, obj);

  if (lastObj && Object.isExtensible(lastObj)) {
    lastObj[lastKey] = value;
  } else {
    console.error("Cannot add property", lastKey, "object is not extensible");
  }
};

export const robustJSONParse = (input) => {
  let parsed;
  try {
    parsed = JSON.parse(input);
  } catch (error) {
    return input; // Return the input if it can't be parsed
  }
  // Recursively parse if the result is still a string
  if (typeof parsed === "string") {
    return robustJSONParse(parsed);
  }
  return parsed;
};

/**
 * Evaluates a condition based on the provided values.
 * @param condition - The condition object to evaluate.
 * @param values - The values to use for evaluation.
 * @returns `true` if the condition is met, otherwise `false`.
 * @example { "status": "active" } => true if values.status === "active"
 */
export const evaluateCondition = (
  condition: Record<string, any>,
  values: Record<string, any>
): boolean => {
  if (!condition) return true; // If condition is undefined or null, return true
  const [conditionField, conditionValue] = Object.entries(condition)[0];
  const fieldValue = getNestedValue(values, conditionField);

  if (Array.isArray(conditionValue)) {
    return conditionValue.includes(fieldValue);
  } else {
    return fieldValue === conditionValue;
  }
};

export const isEditable = (
  editableCondition: Record<string, any> | undefined,
  values: Record<string, any>
): boolean => {
  if (!editableCondition) return true;
  const [conditionField, conditionValue] = Object.entries(editableCondition)[0];
  const fieldValue = getNestedValue(values, conditionField);

  if (Array.isArray(conditionValue)) {
    return conditionValue.includes(fieldValue);
  } else {
    return fieldValue === conditionValue;
  }
};

/**
 * Filters form items based on their conditions.
 * @param formItems - The form items to filter.
 * @param values - The values to use for condition evaluation.
 * @returns The filtered form items.
 */
export const filterFormItemsByCondition = (
  formItems: any[],
  values: Record<string, any>
): any[] => {
  if (!Array.isArray(formItems)) return [];

  return formItems
    .map((formItem) => {
      if (Array.isArray(formItem)) {
        return formItem.filter((nestedItem) =>
          evaluateCondition(nestedItem.condition, values)
        );
      } else {
        return formItem.condition
          ? evaluateCondition(formItem.condition, values)
            ? formItem
            : null
          : formItem;
      }
    })
    .filter(Boolean); // Filter out null items
};

export const parseMultipleSelect = (values, structure) => {
  const parseValue = (value, labelTemplate) => {
    const tokens = labelTemplate.split(/(?<!\.)\.\' \'\.(?!\.)/);
    return tokens
      .map((token) =>
        token
          .trim()
          .split(".")
          .reduce((acc, key) => acc && acc[key], value)
      )
      .join(" ");
  };

  return values.map((v) => ({
    value: v[structure.value],
    label: parseValue(v, structure.label),
  }));
};

export const stringFilterOptions = [
  { value: "startsWith", label: "Starts With" },
  { value: "endsWith", label: "Ends With" },
  { value: "like", label: "Include" },
  { value: "notLike", label: "Exclude" },
  { value: "equal", label: "Equal" },
  { value: "notEqual", label: "Not Equal" },
  { value: "substring", label: "Substring" },
  { value: "regexp", label: "Regexp" },
  { value: "notRegexp", label: "Not Regexp" },
];

export const numberFilterOptions = [
  { value: "greaterThan", label: "Greater Than" },
  { value: "greaterThanOrEqual", label: "Greater Than or Equal" },
  { value: "lessThan", label: "Less Than" },
  { value: "lessThanOrEqual", label: "Less Than or Equal" },
  { value: "between", label: "Between" },
  { value: "notBetween", label: "Not Between" },
];
