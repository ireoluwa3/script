import Layout from "@/layouts/Default";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDashboardStore } from "@/stores/dashboard";
import $fetch from "@/utils/api";
import { toast } from "sonner";
import Button from "@/components/elements/base/button/Button";
import { Icon } from "@iconify/react";
import { useTranslation } from "next-i18next";
const StripeSession = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { profile } = useDashboardStore();
  const { sessionId } = router.query as {
    sessionId: string;
  };
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [lineItems, setLineItems] = useState<
    Array<{
      id: string;
      description: string;
      currency: string;
      amount: number;
    }>
  >([]);
  useEffect(() => {
    if (!sessionId || !profile) return;
    const verifyPayment = async () => {
      try {
        const { data, error } = await $fetch({
          url: `/api/finance/deposit/fiat/stripe/verify`,
          method: "POST",
          silent: true,
          params: { sessionId },
        });
        if (error) toast.error(error);
        setPaymentStatus(data.status);
        setLineItems(
          data.line_items.map((item: any) => ({
            id: item.id,
            description: item.description,
            currency: item.currency.toUpperCase(),
            amount: item.amount,
          }))
        );
      } catch (error) {
        console.error(error);
        setPaymentStatus("failed");
      } finally {
        setIsLoading(false);
      }
    };
    if (sessionId) {
      verifyPayment();
    }
  }, [sessionId, profile]);
  const total = lineItems.reduce((acc, item) => acc + item.amount, 0);
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
      <div>
        {paymentStatus === "succeeded" ? (
          <div className="my-auto text-center flex flex-col justify-center space-y-5 text-muted-800 dark:text-muted-200 py-20">
            {/* Placeholder for success animation */}
            <h1 className="text-2xl font-bold text-success-500">
              {t("Payment Successful")}
            </h1>
            <p>
              {t(
                "Your payment has been processed successfully. Here are the details"
              )}
            </p>
            {/* Example card component displaying payment details */}
            <div className="overflow-hidden font-sans">
              <div className="border-muted-200 dark:border-muted-700 flex flex-col justify-between gap-y-8 border-b p-8 sm:flex-row sm:items-center">
                <h3 className="text-md font-medium">
                  {t("Order")}{" "}
                  {sessionId}
                </h3>
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
                  <tbody className="divide-y bg-white dark:bg-muted-900  divide-muted-200 dark:divide-muted-700">
                    {lineItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-left whitespace-nowrap text-sm font-medium">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 text-left whitespace-nowrap text-sm">
                          {item.currency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          {item.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p>
              {t("Congratulations! You have successfully deposited")}{" "}
              {total} {lineItems[0]?.currency}{" "}
              {t("to your wallet.")}
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
            {/* Placeholder for error icon */}
            <h1>{t("Payment Failed")}</h1>
            <p>
              {t(
                "There was an issue processing your payment. Please try again later."
              )}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};
export default StripeSession;
