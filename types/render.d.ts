// Define type for a field option
interface FieldOption {
  value: string | number;
  label: string;
}

// Define type for a basic field
interface BasicField {
  type: "input" | "file" | "textarea" | "datetime" | "switch" | "select";
  label: string;
  name: string;
  placeholder?: string;
  icon?: string;
  fileType?: string;
  width?: number;
  height?: number;
  maxSize?: number;
  ts?: "string" | "boolean" | "number";
  options?: FieldOption[];
  component?: string;
  notNull?: boolean;
}

// Define type for a field with nested fields
interface ObjectField {
  type: "object";
  label: string;
  name: string;
  fields: (BasicField | BasicField[] | ObjectField)[];
  grid?: "row" | "column";
}

// Define type for a component field
interface ComponentField {
  type: "component";
  name: string;
  filepath: string;
  props: Record<string, unknown>;
}

// Define type for get and set operations
interface GetOperation {
  get: (UserInformationField | ComponentField | ObjectField)[];
}

interface SetOperation {
  set: (BasicField | BasicField[] | ObjectField)[];
}
