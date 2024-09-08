import { useState, useEffect } from "react";
import Button from "@/components/elements/base/button/Button";
import { useTranslation } from "next-i18next";
import ColorInput from "@/components/elements/form/input/colorInput";

const themeFields = {
  primary: [
    "50",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
  info: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
  success: [
    "50",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
  warning: [
    "50",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
  danger: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
  muted: [
    "50",
    "100",
    "150",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "850",
    "900",
    "950",
    "1000",
  ],
};

const defaultColors = {
  muted: {
    50: "#f9f9fa",
    100: "#f3f3f4",
    150: "#ededee",
    200: "#dfdfe1",
    300: "#cfcfd3",
    400: "#9e9ea7",
    500: "#6e6e76",
    600: "#4b4b55",
    700: "#3f3f46",
    800: "#27272a",
    850: "#252529",
    900: "#1c1c1f",
    950: "#141416",
    1000: "#0b0b0d",
  },
  primary: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
  },
  info: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
  },
  success: {
    50: "#f0fdfa",
    100: "#ccfbf1",
    200: "#99f6e4",
    300: "#5eead4",
    400: "#2dd4bf",
    500: "#14b8a6",
    600: "#0d9488",
    700: "#0f766e",
    800: "#115e59",
    900: "#134e4a",
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },
  danger: {
    50: "#fff1f2",
    100: "#ffe4e6",
    200: "#fecdd3",
    300: "#fda4af",
    400: "#fb7185",
    500: "#f43f5e",
    600: "#e11d48",
    700: "#be123c",
    800: "#9f1239",
    900: "#881337",
  },
};

const ThemeCustomizer = ({
  formData,
  handleInputChange,
  handleCancel,
  handleSave,
  hasChanges,
  isLoading,
}) => {
  const { t } = useTranslation();
  const [colorValues, setColorValues] = useState({});
  const [categoryChanges, setCategoryChanges] = useState({});

  useEffect(() => {
    if (formData.themeColors) {
      setColorValues(formData.themeColors);
    } else if (typeof window !== "undefined") {
      const initialColorValues = Object.entries(themeFields).reduce(
        (acc, [color, shades]) => {
          acc[color] = {};
          shades.forEach((shade) => {
            const varName = `--color-${color}-${shade}`;
            acc[color][shade] = getComputedStyle(document.documentElement)
              .getPropertyValue(varName)
              .trim();
          });
          return acc;
        },
        {}
      );
      setColorValues(initialColorValues);
    }
  }, [formData.themeColors]);

  const handleChange = (color, shade, value) => {
    const varName = `--color-${color}-${shade}`;
    document.documentElement.style.setProperty(varName, value);
    const updatedColors = {
      ...colorValues,
      [color]: {
        ...colorValues[color],
        [shade]: value,
      },
    };
    handleInputChange({ name: "themeColors", value: updatedColors });
    setColorValues(updatedColors);
    setCategoryChanges((prev) => ({ ...prev, [color]: true }));
  };

  const handleReset = (color) => {
    const updatedColors = {
      ...colorValues,
      [color]: defaultColors[color],
    };
    Object.entries(defaultColors[color]).forEach(([shade, value]) => {
      const varName = `--color-${color}-${shade}`;
      document.documentElement.style.setProperty(varName, value as string);
    });
    handleInputChange({ name: "themeColors", value: updatedColors });
    setColorValues(updatedColors);
    setCategoryChanges((prev) => ({ ...prev, [color]: true }));
  };

  const saveCategoryChanges = async (color) => {
    handleSave();
    setCategoryChanges((prev) => ({ ...prev, [color]: false }));
  };

  return (
    <div className="grid w-full grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4 ltablet:col-span-4">
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-medium tracking-wide text-muted-800 dark:text-muted-100">
            {t("Theme Customizer")}
          </h3>
          <p className="max-w-xs text-sm text-muted-400">
            {t("Manage theme colors and shades.")}
          </p>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-8 ltablet:col-span-8">
        <div className="lg:max-w-xl space-y-6">
          {Object.entries(themeFields).map(([color, shades]) => (
            <div key={color} className="space-y-4">
              <h4 className="text-md font-semibold text-muted-700 dark:text-muted-200">
                {t(color.charAt(0).toUpperCase() + color.slice(1))}
              </h4>
              <div className="grid w-full grid-cols-12 gap-x-6 gap-y-4">
                {shades.map((shade) => {
                  const value = colorValues[color]?.[shade] || "#ffffff";
                  return (
                    <div
                      key={shade}
                      className="col-span-12 md:col-span-6 lg:col-span-4 flex items-center space-x-4"
                    >
                      <ColorInput
                        label={`${color}-${shade}`}
                        type="color"
                        value={value}
                        onChange={(e) =>
                          handleChange(color, shade, e.target.value)
                        }
                        noPadding
                        icon="fluent:color-20-filled"
                      />
                    </div>
                  );
                })}
              </div>
              {categoryChanges[color] && (
                <div className="flex justify-end space-x-4">
                  <Button color="default" onClick={() => handleReset(color)}>
                    {t("Reset")}
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => saveCategoryChanges(color)}
                    loading={isLoading}
                  >
                    {t("Save Changes")}
                  </Button>
                </div>
              )}
            </div>
          ))}
          {hasChanges && (
            <div className="col-span-12 flex justify-end space-x-4">
              <Button color="default" onClick={handleCancel}>
                {t("Cancel")}
              </Button>
              <Button color="primary" onClick={handleSave} loading={isLoading}>
                {t("Save Changes")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
