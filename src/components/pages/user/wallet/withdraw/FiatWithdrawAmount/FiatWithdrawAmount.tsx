import { memo, useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/elements/base/button/Button";
import { Icon } from "@iconify/react";
import { useWithdrawStore } from "@/stores/user/wallet/withdraw";
import Input from "@/components/elements/form/input/Input";
import Textarea from "@/components/elements/form/textarea/Textarea";
import { useTranslation } from "next-i18next";

const FiatWithdrawAmountBase = () => {
  const { t } = useTranslation();
  const {
    selectedWithdrawMethod,
    setSelectedWithdrawMethod,
    setStep,
    handleFiatWithdraw,
    setWithdrawAmount,
    withdrawAmount,
    loading,
  } = useWithdrawStore();
  const [customFields, setCustomFields] = useState<any>({});
  const [filePreviews] = useState({});
  const [formValues, setFormValues] = useState({});
  const [formErrors] = useState({});
  useEffect(() => {
    if (selectedWithdrawMethod?.customFields) {
      const fields = JSON.parse(selectedWithdrawMethod.customFields);
      setCustomFields(fields);
    }
  }, [selectedWithdrawMethod]);
  const handleChange = useCallback(
    (name, values) => {
      setFormValues((prevValues) => {
        const newValues = { ...prevValues };
        newValues[name] = values;
        return newValues;
      });
    },
    [setFormValues, filePreviews, customFields]
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
  const renderFormField = useCallback(
    (formItem) => {
      const { name, type, title, required } = formItem;
      const value = formValues[name];
      const error = formErrors[name];
      const commonProps = {
        key: name,
        name,
        label: title,
        placeholder: `Enter ${title}`,
        required,
        error,
        value,
        onChange: (e) => handleChange(name, e.target.value),
        setFirstErrorInputRef: (inputRef) =>
          setFirstErrorInputRef(inputRef, error),
      };
      switch (type) {
        case "input":
          return <Input {...commonProps} />;
        case "textarea":
          return <Textarea {...commonProps} />;
        default:
          return null;
      }
    },
    [formValues, formErrors, filePreviews, handleChange]
  );
  const renderFormFields = useCallback(
    (formItems) => {
      if (!Array.isArray(formItems)) return null;
      return formItems.map((formItem, index) => {
        if (Array.isArray(formItem)) {
          const gridCols = `grid-cols-${formItem.length}`;
          return (
            <div key={index} className={`grid gap-4 ${gridCols}`}>
              {formItem.map((nestedItem) => renderFormField(nestedItem))}
            </div>
          );
        } else {
          return (
            <div key={index} className="space-y-5">
              {renderFormField(formItem)}
            </div>
          );
        }
      });
    },
    [renderFormField]
  );
  return (
    <div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {selectedWithdrawMethod?.title} {t("Withdraw Confirmation")}
        </h2>
        <p className="text-sm text-muted-400">
          {t("Enter the amount you want to withdraw")}
        </p>
      </div>
      <div className="mx-auto mb-4 w-full max-w-md space-y-5 rounded px-8 pb-8">
        <div>
          <Input
            type="number"
            placeholder={t("Enter amount")}
            label={t("Amount")}
            className="w-full"
            min={Number(selectedWithdrawMethod?.minAmount)}
            max={Number(selectedWithdrawMethod?.maxAmount)}
            required
            onChange={(e) => {
              setWithdrawAmount(parseFloat(e.target.value));
            }}
          />
        </div>
        {customFields && renderFormFields(customFields)}

        <div className="mx-auto !mt-16 max-w-sm">
          <div className="flex w-full gap-4 justify-center">
            <Button
              type="button"
              size="lg"
              className="w-full"
              onClick={() => {
                setSelectedWithdrawMethod(null);
                setStep(3);
              }}
              disabled={loading}
            >
              <Icon icon="mdi:chevron-left" className="h-5 w-5" />
              {t("Go Back")}
            </Button>
            {selectedWithdrawMethod?.alias !== "paypal" && (
              <Button
                type="button"
                color="primary"
                size="lg"
                className="w-full"
                onClick={() => {
                  handleFiatWithdraw(formValues);
                }}
                disabled={!withdrawAmount || withdrawAmount === 0 || loading}
              >
                {t("Withdraw")}
                <Icon icon="mdi:chevron-right" className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export const FiatWithdrawAmount = memo(FiatWithdrawAmountBase);
