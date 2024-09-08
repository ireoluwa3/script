import { memo, useCallback, useMemo } from "react";
import Button from "@/components/elements/base/button/Button";
import { Icon } from "@iconify/react";
import Input from "@/components/elements/form/input/Input";
import { useWithdrawStore } from "@/stores/user/forex/withdraw";
import { ethers } from "ethers";
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
        <p className="text-xl text-primary-500">
          {t("Processing withdrawal...")}
        </p>
      </div>
    </div>
  );
};
const validateAddress = (address) => {
  return ethers.isAddress(address);
};
// Displays withdrawal details like min/max amounts and fees
const WithdrawDetails = ({
  selectedWithdrawMethod,
  selectedCurrency,
  withdrawAmount,
  balance,
  fee,
  minFee,
  totalWithdraw,
  remainingBalance,
}) => {
  const { t } = useTranslation();
  return (
    <div className="card-dashed text-sm mt-5">
      <div className="text-md mb-2 font-semibold text-muted-800 dark:text-muted-100">
        {selectedWithdrawMethod?.chain} {t("Network Withdraw Information")}
      </div>
      <div className="flex justify-between">
        <p className="text-muted-600 dark:text-muted-300">{t("Min Amount")}</p>
        <p
          className={
            !withdrawAmount ||
            withdrawAmount < selectedWithdrawMethod?.limits?.withdraw?.min
              ? "text-red-500"
              : "text-muted-600 dark:text-muted-300"
          }
        >
          {selectedWithdrawMethod?.limits?.withdraw?.min || 0}{" "}
        </p>
      </div>
      <div className="flex justify-between">
        <p className="text-muted-600 dark:text-muted-300">{t("Max Amount")}</p>
        <p className="text-muted-600 dark:text-muted-300">
          {balance || selectedWithdrawMethod?.limits?.withdraw?.max}{" "}
        </p>
      </div>
      <div className="flex justify-between border-b border-dashed pb-2 border-muted-300 dark:border-muted-700 mb-2">
        <p className="text-muted-600 dark:text-muted-300">
          {t("Withdraw Fee")}{" "}
          {minFee > 0 && (withdrawAmount * fee) / 100 < minFee && (
            <span className="text-muted-600 dark:text-muted-300">
              {t("Min Fee")} ({minFee})
            </span>
          )}
        </p>
        <p className="text-muted-600 dark:text-muted-300">{fee}</p>
      </div>

      <div className="flex justify-between border-b border-dashed pb-2 border-muted-300 dark:border-muted-700 mb-2">
        <p className="text-muted-600 dark:text-muted-300">
          {t("Total Withdraw")}
        </p>
        <p className="text-muted-600 dark:text-muted-300">{totalWithdraw}</p>
      </div>
      <div className="flex justify-between">
        <p className="text-muted-600 dark:text-muted-300">
          {t("Remaining Balance")}
        </p>
        <p className="text-muted-600 dark:text-muted-300">
          {remainingBalance >= 0 ? remainingBalance : `--`} {selectedCurrency}
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
const WithdrawForm = ({
  selectedWalletType,
  selectedCurrency,
  onBack,
  onWithdraw,
  loading,
}) => {
  const {
    account,
    withdrawAmount,
    setWithdrawAmount,
    currencies,
    selectedWithdrawMethod,
  } = useWithdrawStore();
  const handleChangeAmount = useCallback(
    (e) => {
      setWithdrawAmount(parseFloat(e.target.value));
    },
    [setWithdrawAmount]
  );
  // Calculate fees
  const { fee, minFee } = useMemo(() => {
    return selectedWalletType.value === "FIAT"
      ? { fee: 0, minFee: 0 }
      : calculateFees(selectedWithdrawMethod, withdrawAmount || 0);
  }, [selectedWithdrawMethod, withdrawAmount]);
  const totalWithdraw = useMemo(
    () => (withdrawAmount || 0) + fee,
    [withdrawAmount, fee]
  );
  const remainingBalance = useMemo(
    () => account.balance - totalWithdraw,
    [account.balance, totalWithdraw]
  );
  const isWithdrawValid = useMemo(() => {
    return (
      withdrawAmount > 0 &&
      remainingBalance >= 0 &&
      withdrawAmount >= (selectedWithdrawMethod?.limits?.withdraw?.min || 0) &&
      withdrawAmount <=
        (account.balance || selectedWithdrawMethod?.limits?.withdraw?.max)
    );
  }, [
    withdrawAmount,
    remainingBalance,
    account.balance,
    selectedWithdrawMethod,
  ]);
  const { t } = useTranslation();
  return (
    <div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {t("Withdraw Confirmatio")}
        </h2>
        <p className="text-sm text-muted-400">
          {t("Enter the amount you want to withdraw to your")}{" "}
          {selectedWalletType.label} {selectedCurrency} {t("wallet")}
        </p>
      </div>
      <div className="mx-auto mb-4 w-full max-w-md rounded px-8 pb-8">
        <Input
          type="number"
          value={withdrawAmount}
          placeholder={t("Enter amount")}
          label={t("Amount")}
          min={selectedWithdrawMethod?.limits?.withdraw?.min || 0}
          max={account.balance || selectedWithdrawMethod?.limits?.withdraw?.max}
          required
          onChange={handleChangeAmount}
          error={
            withdrawAmount &&
            withdrawAmount <
              (selectedWithdrawMethod?.limits?.withdraw?.min || 0)
              ? "Amount is less than minimum"
              : undefined ||
                withdrawAmount >
                  (account.balance ||
                    selectedWithdrawMethod?.limits?.withdraw?.max)
              ? "Amount is more your balance"
              : undefined
          }
        />
        <WithdrawDetails
          selectedWithdrawMethod={selectedWithdrawMethod}
          selectedCurrency={selectedCurrency}
          withdrawAmount={withdrawAmount}
          balance={account.balance}
          fee={fee}
          minFee={minFee}
          totalWithdraw={totalWithdraw}
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
              onClick={onWithdraw}
              disabled={!isWithdrawValid || loading}
            >
              {t("Withdraw")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
const WithdrawAmountBase = () => {
  const {
    loading,
    setStep,
    selectedCurrency,
    handleWithdraw,
    setSelectedWithdrawMethod,
    selectedWalletType,
  } = useWithdrawStore();
  const router = useRouter();
  const { id } = router.query as {
    id: string;
  };
  if (loading || !id) return <LoadingIndicator />;
  return (
    <WithdrawForm
      selectedCurrency={selectedCurrency}
      onBack={() => {
        setSelectedWithdrawMethod(null);
        setStep(selectedWalletType.value === "FIAT" ? 2 : 3);
      }}
      onWithdraw={() => handleWithdraw(id)}
      loading={loading}
      selectedWalletType={selectedWalletType}
    />
  );
};
export const WithdrawAmount = memo(WithdrawAmountBase);
