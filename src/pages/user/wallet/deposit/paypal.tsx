import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/layouts/Default";
import { useDashboardStore } from "@/stores/dashboard";
import { Icon } from "@iconify/react";
import Button from "@/components/elements/base/button/Button";
import $fetch from "@/utils/api";
import { toast } from "sonner";
import { useTranslation } from "next-i18next";
const PaymentSuccessPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { orderId } = router.query as {
    orderId: string;
  };
  const { profile } = useDashboardStore();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");
  const [depositAmount, setDepositAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [payerName, setPayerName] = useState(
    `${profile?.firstName} ${profile?.lastName}`
  );
  const [payerEmail, setPayerEmail] = useState(profile?.email || "");
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!orderId) return;
      try {
        const { data, error } = await $fetch({
          url: `/api/finance/deposit/fiat/paypal/details`,
          method: "POST",
          silent: true,
          params: { orderId },
        });
        if (error) {
          toast.error(error);
          setPaymentStatus("failed");
          setIsLoading(false);
          return;
        }
        setPaymentStatus(data.status);
        const purchaseUnit = data.purchase_units[0];
        setCurrencyCode(purchaseUnit.amount.currency_code);
        setDepositAmount(
          parseFloat(purchaseUnit.amount.breakdown.item_total.value)
        );
        setTaxAmount(parseFloat(purchaseUnit.amount.breakdown.tax_total.value));
        setTotalAmount(parseFloat(purchaseUnit.amount.value));
        setPayerName(data.payer?.name?.given_name || "");
        setPayerEmail(data.payer?.email_address || "");
      } catch (error) {
        console.error(error);
        setPaymentStatus("failed");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPaymentDetails();
  }, [orderId, profile]);
  const formatPrice = (amount: number, currency: string) => {
    // Dummy formatting function, replace with your actual formatting logic
    return `${amount.toFixed(2)} ${currency}`;
  };
  if (isLoading) {
    return (
      <Layout title={t("Processing...")} color="muted">
        <div className="my-auto text-center flex flex-col justify-center space-y-5 py-20 items-center text-muted-800 dark:text-muted-200">
          <Icon
            icon="mdi:loading"
            className="animate-spin text-4xl text-primary-500 h-24 w-24"
          />
          <h1 className="text-2xl font-bold">{t("Processing Payment...")}</h1>
          <p>{t("Please wait while we process your payment.")}</p>
        </div>
      </Layout>
    );
  }
  return (
    <Layout title={t("Deposit Success")} color="muted">
      {paymentStatus === "COMPLETED" ? (
        <div className="my-auto text-center flex flex-col justify-center space-y-5 text-muted-800 dark:text-muted-200 py-20">
          <h1 className="text-2xl font-bold text-success-500">
            {t("Payment Successful")}
          </h1>
          <p>
            {t(
              "Your payment has been processed successfully. Here are the details"
            )}
          </p>
          <div className="overflow-hidden font-sans">
            <div className="border-muted-200 dark:border-muted-700 flex flex-col justify-between gap-y-8 border-b p-8 sm:flex-row sm:items-center">
              <h3 className="text-md font-medium">
                {t("Order")}{" "}
                {orderId}
              </h3>
              <p>
                {t("Payer")}{" "}
                {payerName} ({payerEmail})
              </p>
            </div>
            <div className="flex flex-col">
              <table className="min-w-full divide-y divide-muted-200 dark:divide-muted-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                      {t("Description")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                      {t("Currency")}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase">
                      {t("Amount")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-white dark:bg-muted-900 divide-muted-200 dark:divide-muted-700">
                  <tr>
                    <td className="px-6 py-4 text-left whitespace-nowrap text-sm font-medium">
                      {t("Deposit to")}
                      {currencyCode}
                      {t("Wallet")}
                    </td>
                    <td className="px-6 py-4 text-left whitespace-nowrap text-sm">
                      {currencyCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {formatPrice(depositAmount, currencyCode)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-left whitespace-nowrap text-sm font-medium">
                      {t("Tax")}
                    </td>
                    <td className="px-6 py-4 text-left whitespace-nowrap text-sm">
                      {currencyCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {formatPrice(taxAmount, currencyCode)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-left whitespace-nowrap text-sm font-medium">
                      {t("Total")}
                    </td>
                    <td className="px-6 py-4 text-left whitespace-nowrap text-sm">
                      {currencyCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {formatPrice(totalAmount, currencyCode)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p>
            {t("Congratulations! You have successfully deposited")}{" "}
            {formatPrice(depositAmount, currencyCode)}{" "}
            {t("to your")}{" "}
            {currencyCode} {t("Wallet.")}
          </p>
          <Button
            onClick={() => router.push("/user/wallet/FIAT")}
            color="primary"
          >
            <Icon icon="mdi:chevron-left" className="h-5 w-5" />
            {t("Go Back")}
          </Button>
        </div>
      ) : (
        <div>
          <h1>{t("Payment Failed")}</h1>
          <p>
            {t(
              "There was an issue processing your payment. Please try again later."
            )}
          </p>
        </div>
      )}
    </Layout>
  );
};
export default PaymentSuccessPage;
