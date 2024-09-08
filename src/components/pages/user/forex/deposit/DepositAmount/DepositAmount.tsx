import { memo, useCallback, useMemo } from "react";
import Button from "@/components/elements/base/button/Button";
import { Icon } from "@iconify/react";
import Input from "@/components/elements/form/input/Input";
import { useDepositStore } from "@/stores/user/forex/deposit";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
// Loading indicator component
const LoadingIndicator = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center h-96">
      <div className="flex flex-col items-center space-y-4">
        <Icon
          icon="mdi:loading"
          className="h-12 w-12 animate-spin text-primary-500"
        />
        <p className="text-xl text-primary-500">{t("Processing deposit...")}</p>
      </div>
    </div>
  );
};
// Displays deposital details like min/max amounts and fees
const DepositDetails = ({
  selectedDepositMethod,
  selectedCurrency,
  depositAmount,
  balance,
  fee,
  minFee,
  totalDeposit,
  remainingBalance,
}) => {
  const { t } = useTranslation();
  return (
    <div className="card-dashed text-sm mt-5">
      <div className="text-md mb-2 font-semibold text-muted-800 dark:text-muted-100">
        {selectedDepositMethod?.chain} {t("Network Deposit Information")}
      </div>
      <div className="flex justify-between">
        <p className="text-muted-600 dark:text-muted-300">{t("Min Amount")}</p>
        <p
          className={
            !depositAmount ||
            depositAmount < selectedDepositMethod?.limits?.deposit?.min
              ? "text-red-500"
              : "text-muted-600 dark:text-muted-300"
          }
        >
          {selectedDepositMethod?.limits?.deposit?.min || 0}{" "}
        </p>
      </div>
      <div className="flex justify-between">
        <p className="text-muted-600 dark:text-muted-300">{t("Max Amount")}</p>
        <p className="text-muted-600 dark:text-muted-300">
          {balance || selectedDepositMethod?.limits?.deposit?.max}{" "}
        </p>
      </div>
      <div className="flex justify-between border-b border-dashed pb-2 border-muted-300 dark:border-muted-700 mb-2">
        <p className="text-muted-600 dark:text-muted-300">
          {t("Deposit Fee")}{" "}
          {minFee > 0 && (depositAmount * fee) / 100 < minFee && (
            <span className="text-muted-600 dark:text-muted-300">
              {t("Min Fee")} ({minFee})
            </span>
          )}
        </p>
        <p className="text-muted-600 dark:text-muted-300">{fee}</p>
      </div>

      <div className="flex justify-between border-b border-dashed pb-2 border-muted-300 dark:border-muted-700 mb-2">
        <p className="text-muted-600 dark:text-muted-300">
          {t("Total Deposit")}
        </p>
        <p className="text-muted-600 dark:text-muted-300">{totalDeposit}</p>
      </div>
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
const calculateFees = (method, amount) => {
  let fee = 0;
  let percentageFee = 0;
  let minFee = 0;
  // Apply fixed fee if available
  if (method.fixedFee) {
    fee += method.fixedFee;
  }
  // Apply percentage fee if available
  if (method.percentageFee) {
    percentageFee = method.percentageFee;
    fee += (percentageFee * amount) / 100;
  }
  // Apply dynamic fee structure if available
  if (typeof method.fee === "object") {
    percentageFee = parseFloat(method.fee?.percentage || 0);
    if (percentageFee > 0) {
      fee += (percentageFee * amount) / 100;
    }
    minFee = parseFloat(method.fee?.min || 0);
    if (minFee > 0) {
      fee = Math.max(minFee, fee); // Ensures that the fee does not fall below minFee
    }
  }
  return { fee, minFee };
};
const DepositForm = ({
  selectedWalletType,
  selectedCurrency,
  onBack,
  onDeposit,
  loading,
}) => {
  const { depositAmount, setDepositAmount, currencies, selectedDepositMethod } =
    useDepositStore();
  const balance = useMemo(() => {
    return (
      currencies
        .find((currency) => currency.value === selectedCurrency)
        ?.label.split(" - ")[1] || 0
    );
  }, [currencies, selectedCurrency]);
  const handleChangeAmount = useCallback(
    (e) => {
      setDepositAmount(parseFloat(e.target.value));
    },
    [setDepositAmount]
  );
  // Calculate fees
  const { fee, minFee } = useMemo(() => {
    return selectedWalletType.value === "FIAT"
      ? { fee: 0, minFee: 0 }
      : calculateFees(selectedDepositMethod, depositAmount || 0);
  }, [selectedDepositMethod, depositAmount]);
  const totalDeposit = useMemo(
    () => (depositAmount || 0) + fee,
    [depositAmount, fee]
  );
  const remainingBalance = useMemo(
    () => balance - totalDeposit,
    [balance, totalDeposit]
  );
  const isDepositValid = useMemo(() => {
    return (
      depositAmount > 0 &&
      remainingBalance >= 0 &&
      depositAmount >= (selectedDepositMethod?.limits?.deposit?.min || 0) &&
      depositAmount <= (balance || selectedDepositMethod?.limits?.deposit?.max)
    );
  }, [depositAmount, remainingBalance, balance, selectedDepositMethod]);
  const { t } = useTranslation();
  return (
    <div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {selectedCurrency} {t("Deposit Confirmation")}
        </h2>
        <p className="text-sm text-muted-400">
          {t("Enter the amount you want to deposit")}
        </p>
      </div>
      <div className="mx-auto mb-4 w-full max-w-md rounded px-8 pb-8">
        <Input
          type="number"
          value={depositAmount}
          placeholder={t("Enter amount")}
          label={t("Amount")}
          min={selectedDepositMethod?.limits?.deposit?.min || 0}
          max={balance || selectedDepositMethod?.limits?.deposit?.max}
          required
          onChange={handleChangeAmount}
          error={
            depositAmount &&
            depositAmount < (selectedDepositMethod?.limits?.deposit?.min || 0)
              ? "Amount is less than minimum"
              : undefined ||
                depositAmount >
                  (balance || selectedDepositMethod?.limits?.deposit?.max)
              ? "Amount is more your balance"
              : undefined
          }
        />
        <DepositDetails
          selectedDepositMethod={selectedDepositMethod}
          selectedCurrency={selectedCurrency}
          depositAmount={depositAmount}
          balance={balance}
          fee={fee}
          minFee={minFee}
          totalDeposit={totalDeposit}
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
              onClick={onDeposit}
              disabled={!isDepositValid || loading}
            >
              {t("Deposit")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
const DepositAmountBase = () => {
  const {
    loading,
    setStep,
    selectedCurrency,
    handleDeposit,
    setSelectedDepositMethod,
    selectedWalletType,
  } = useDepositStore();
  const router = useRouter();
  const { id } = router.query as {
    id: string;
  };
  if (loading || !id) return <LoadingIndicator />;
  return (
    <DepositForm
      selectedCurrency={selectedCurrency}
      onBack={() => {
        setSelectedDepositMethod(null);
        setStep(selectedWalletType.value === "FIAT" ? 2 : 3);
      }}
      onDeposit={() => handleDeposit(id)}
      loading={loading}
      selectedWalletType={selectedWalletType}
    />
  );
};
export const DepositAmount = memo(DepositAmountBase);
