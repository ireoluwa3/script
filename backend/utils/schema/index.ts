export const baseStringSchema = (
  description,
  maxLength = 255,
  minLength = 0,
  nullable = false,
  pattern: string | null = null,
  expectedFormat: string | null = null
) => {
  const schema: any = {
    type: "string",
    description: description,
    maxLength: maxLength,
    minLength: minLength,
    nullable: nullable,
  };
  if (pattern) {
    schema.pattern = pattern;
  }
  if (expectedFormat) {
    schema.expectedFormat = expectedFormat;
  }
  return schema;
};

export const baseNumberSchema = (description, nullable = false) => ({
  type: "number",
  description: description,
  nullable: nullable,
});

export const baseBooleanSchema = (description) => ({
  type: "boolean",
  description: description,
});

export const baseEnumSchema = (description, enumOptions) => ({
  type: "string",
  description: description,
  enum: enumOptions,
});

export const baseIntegerSchema = (description, nullable = false) => ({
  type: "integer",
  description: description,
  nullable: nullable,
});

export const baseObjectSchema = (
  description,
  additionalProperties = false,
  nullable = false
) => ({
  type: "object",
  description: description,
  additionalProperties: additionalProperties,
  nullable: nullable,
});

export const baseDateTimeSchema = (description, nullable = false) => ({
  type: "string",
  format: "date-time",
  description: description,
  nullable: nullable,
});
