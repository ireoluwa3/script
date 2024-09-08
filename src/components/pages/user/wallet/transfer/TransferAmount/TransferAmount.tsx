import { memo, useCallback, useMemo } from "react";
import Button from "@/components/elements/base/button/Button";
import { Icon } from "@iconify/react";
import Input from "@/components/elements/form/input/Input";
import { useTransferStore } from "@/stores/user/wallet/transfer";
import { useTranslation } from "next-i18next";

const LoadingIndicator = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center h-96">
      <div className="flex flex-col items-center space-y-4">
        <Icon
          icon="mdi:loading"
          className="h-12 w-12 animate-spin text-primary-500"
        />
        <p className="text-xl text-primary-500">
          {t("Processing transfer...")}
        </p>
      </div>
    </div>
  );
};

const TransferDetails = ({ selectedCurrency, remainingBalance }) => {
  const { t } = useTranslation();
  return (
    <div className="card-dashed text-sm mt-5">
      <div className="flex justify-between">
        <p className="text-muted-600 dark:text-muted-300">
          {t("Remaining Balance")}
        </p>
        <p className="text-muted-600 dark:text-muted-300">
          {remainingBalance > 0 ? remainingBalance : `--`} {selectedCurrency}
        </p>
      </div>
    </div>
  );
};

const TransferForm = ({ selectedCurrency, onBack, onTransfer, loading }) => {
  const { transferAmount, setTransferAmount, currencies } = useTransferStore();
  const balance = useMemo(() => {
    return (
      currencies?.from
        ?.find((currency) => currency.value === selectedCurrency)
        ?.label.split(" - ")[1] || 0
    );
  }, [currencies, selectedCurrency]);

  const handleChangeAmount = useCallback(
    (e) => {
      const value = parseFloat(e.target.value);
      // Ensure value cannot be less than 0
      if (value >= 0) {
        setTransferAmount(value);
      }
    },
    [setTransferAmount]
  );

  const remainingBalance = useMemo(() => {
    return balance - transferAmount;
  }, [balance, transferAmount]);

  const isTransferValid = useMemo(() => {
    return transferAmount > 0 && remainingBalance >= 0;
  }, [transferAmount, remainingBalance]);

  const { t } = useTranslation();
  return (
    <div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {selectedCurrency} {t("to")} {selectedCurrency}{" "}
          {t("Transfer Confirmation")}
        </h2>
        <p className="text-sm text-muted-400">
          {t("Enter the amount you want to transfer")}
        </p>
      </div>
      <div className="mx-auto mb-4 w-full max-w-md rounded px-8 pb-8">
        <Input
          type="number"
          value={transferAmount}
          placeholder={t("Enter amount")}
          label={t("Amount")}
          required
          onChange={handleChangeAmount}
          min="0" // Enforces non-negative input at the browser level
        />
        <TransferDetails
          selectedCurrency={selectedCurrency}
          remainingBalance={remainingBalance}
        />
        <div className="mx-auto !mt-8 max-w-sm">
          <div className="flex w-full gap-4 justify-center">
            <Button type="button" size="lg" onClick={onBack} disabled={loading}>
              <Icon icon="mdi:chevron-left" className="h-5 w-5" />
              {t("Go Back")}
            </Button>
            <Button
              type="button"
              color="primary"
              size="lg"
              onClick={onTransfer}
              disabled={!isTransferValid || loading}
            >
              {t("Transfer")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TransferAmountBase = () => {
  const { loading, setStep, selectedCurrency, handleTransfer } =
    useTransferStore();

  if (loading) return <LoadingIndicator />;

  return (
    <TransferForm
      selectedCurrency={selectedCurrency}
      onBack={() => {
        setStep(4);
      }}
      onTransfer={handleTransfer}
      loading={loading}
    />
  );
};

export const TransferAmount = memo(TransferAmountBase);
