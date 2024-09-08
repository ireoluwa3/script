import { ErrorObject } from "ajv";
import AjvSingleton from "./ajv";
import path from "path";

export function sanitizePath(inputPath: string): string {
  // Normalize the path to resolve any '..' sequences
  const normalizedPath = path.normalize(inputPath);

  // Check if the normalized path is still within the intended directory
  if (normalizedPath.includes("..")) {
    throw new Error("Invalid path: Path traversal detected");
  }

  return normalizedPath;
}

function convertBooleanStrings(value: any): any {
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  } else if (typeof value === "object" && value !== null) {
    for (const key in value) {
      value[key] = convertBooleanStrings(value[key]);
    }
  }
  return value;
}

export function validateSchema<T>(value: T, schema: object): T {
  const ajv = AjvSingleton.getInstance();
  const validate = ajv.compile(schema);

  // Convert boolean strings in the value before validation
  const transformedValue = convertBooleanStrings(value);

  if (!validate(transformedValue)) {
    const errors = validate.errors?.reduce((acc, error) => {
      let path = error.instancePath.replace(/^\//, "").replace(/\//g, ".");
      if (path === "") {
        path = error.params.missingProperty as string;
      }
      const customMessage = formatErrorMessage(path, error, schema);
      acc[path] = customMessage;
      return acc;
    }, {} as Record<string, string>);

    throw new Error(JSON.stringify(formatAjvErrors(errors || {})));
  }

  return transformedValue as T;
}

function formatErrorMessage(
  path: string,
  error: ErrorObject,
  schema: any
): string {
  const fieldName = toFriendlyName(path);
  const fieldSchema = getFieldSchema(path, schema);
  let message = error.message || "";

  switch (error.keyword) {
    case "required":
      message = `${fieldName} is required.`;
      break;
    case "minLength":
      message = `${fieldName} must be at least ${error.params.limit} characters long.`;
      break;
    case "maxLength":
      message = `${fieldName} must be no more than ${error.params.limit} characters long.`;
      break;
    case "minimum":
      message = `${fieldName} must be at least ${error.params.limit}.`;
      break;
    case "maximum":
      message = `${fieldName} must not exceed ${error.params.limit}.`;
      break;
    case "enum":
      const allowedValues = error.params.allowedValues.join(", ");
      message = `${fieldName} must be one of the following: ${allowedValues}.`;
      break;
    case "pattern":
      message = `${fieldName} is incorrectly formatted. Expected format: ${
        fieldSchema.expectedFormat ||
        fieldSchema.placeholder ||
        error.params.pattern
      }`;
      break;
    case "type":
      message = `${fieldName} must be a ${error.params.type}. ${
        fieldSchema.example ? `Example: ${fieldSchema.example}` : ""
      }`;
      break;
    default:
      message = `${fieldName} ${message}.`;
      break;
  }

  return message;
}

function getFieldSchema(path, schema) {
  return path
    .split(".")
    .reduce(
      (schema, key) => schema.properties && schema.properties[key],
      schema
    );
}

function formatAjvErrors(
  errors: Record<string, string>
): Record<string, string[]> {
  const errorMessages: Record<string, string[]> = {};

  for (const key in errors) {
    errorMessages[key] = [errors[key]];
  }

  return errorMessages;
}

function toFriendlyName(path: string): string {
  // Extract the last part of the path
  const lastSegment = path.split(".").pop() || path;

  // Replace camelCase with spaces and capitalize the first letter
  return lastSegment
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}
