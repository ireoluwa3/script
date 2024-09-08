import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/layouts/Default";
import $fetch from "@/utils/api";
import Card from "@/components/elements/base/card/Card";
import Button from "@/components/elements/base/button/Button";
import Input from "@/components/elements/form/input/Input";
import ListBox from "@/components/elements/form/listbox/Listbox";
import { useTranslation } from "next-i18next";

interface Option {
  value: string;
  label: string;
}

const P2POfferEditor: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<{
    paymentMethods: Option[];
    currencies: {
      FIAT: Option[];
      SPOT: Option[];
      ECO: Option[];
    };
    chains: { [key: string]: string[] };
  } | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<Option | null>(null);
  const [walletType, setWalletType] = useState<Option | null>(null);
  const [chain, setChain] = useState<Option | null>(null);
  const [currency, setCurrency] = useState<Option | null>(null);
  const [price, setPrice] = useState<string>("");
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (router.isReady) {
      fetchFormData();
    }
  }, [router.isReady]);

  useEffect(() => {
    if (formData && id) {
      fetchOfferData();
    }
  }, [formData, id]);

  useEffect(() => {
    if (walletType && formData) {
      // Preserve the currency if it matches the new walletType's currencies
      setCurrency((prevCurrency) => {
        const matchingCurrency = formData.currencies[walletType.value].find(
          (cur) => cur.value === prevCurrency?.value
        );
        return matchingCurrency || null;
      });
    }
  }, [walletType, formData]);

  useEffect(() => {
    if (currency && formData) {
      // Ensure that the chain is valid for the selected currency
      const validChains = formData.chains[currency.value] || [];
      if (!validChains.includes(chain?.value || "")) {
        setChain(null); // Reset chain only if the current chain is not valid for the selected currency
      }
    }
  }, [currency, formData, chain]);

  const fetchFormData = async () => {
    const { data, error } = await $fetch({
      url: "/api/ext/p2p/offer/manage/data",
      silent: true,
    });
    if (!error && data) {
      setFormData(data);
    }
  };

  const fetchOfferData = async () => {
    if (!id) return;
    const { data, error } = await $fetch({
      url: `/api/ext/p2p/offer/${id}`,
      silent: true,
    });
    if (!error && data) {
      setPaymentMethodId(
        formData?.paymentMethods.find(
          (method) => method.value === data.paymentMethodId
        ) || null
      );

      const walletOption =
        [
          { value: "FIAT", label: t("Fiat") },
          { value: "SPOT", label: t("Spot") },
          { value: "ECO", label: t("Funding") },
        ].find((type) => type.value === data.walletType) || null;

      setWalletType(walletOption);

      if (walletOption && formData) {
        const selectedCurrency =
          formData.currencies[walletOption.value].find(
            (cur) => cur.value === data.currency
          ) || null;

        setCurrency(selectedCurrency);

        if (selectedCurrency) {
          const availableChains = formData.chains[selectedCurrency.value];
          if (availableChains) {
            const selectedChain = availableChains.find(
              (chain) => chain === data.chain
            );
            setChain(
              selectedChain
                ? { value: selectedChain, label: selectedChain }
                : null
            );
          } else {
            setChain(null);
          }
        }
      }

      setPrice(data.price ? data.price.toString() : "");
      setMinAmount(data.minAmount ? data.minAmount.toString() : "");
      setMaxAmount(data.maxAmount ? data.maxAmount.toString() : "");
    }
  };

  const handleSubmit = async () => {
    const body = {
      paymentMethodId: paymentMethodId?.value,
      walletType: walletType?.value,
      chain: chain?.value,
      currency: currency?.value,
      price: parseFloat(price),
      minAmount: parseFloat(minAmount),
      maxAmount: parseFloat(maxAmount),
    };

    const method = id ? "PUT" : "POST";
    const url = id
      ? `/api/ext/p2p/offer/manage/${id}`
      : `/api/ext/p2p/offer/manage`;

    const { error } = await $fetch({
      url,
      method,
      body,
    });

    if (!error) {
      router.push(`/user/p2p`);
    }
  };

  const getCurrencyOptions = () => {
    if (!walletType || !formData) return [];
    return formData.currencies[walletType.value] || [];
  };

  const getChainOptions = () => {
    if (!currency || !formData || !formData.chains) return [];
    return (
      formData.chains[currency.value]?.map((chain) => ({
        value: chain,
        label: chain,
      })) || []
    );
  };

  if (!formData) return null;

  return (
    <Layout title={t("P2P Offer Editor")} color="muted">
      <Card className="p-5 mb-5 text-muted-800 dark:text-muted-100">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-lg mb-4 md:mb-0">
            {id ? t("Editing Offer") : t("New P2P Offer")}
          </h1>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push(`/user/p2p`)}
              variant="outlined"
              shape="rounded"
              size="md"
              color="danger"
            >
              {t("Cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              variant="outlined"
              shape="rounded"
              size="md"
              color="success"
            >
              {t("Save")}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="flex flex-col">
            <ListBox
              label={t("Payment Method")}
              options={formData.paymentMethods}
              selected={paymentMethodId}
              setSelected={setPaymentMethodId}
            />
            <small className="text-warning-500 mt-1 text-xs">
              {t(
                "Select the payment method you wish to use for this P2P offer."
              )}
            </small>
          </div>
          <div className="flex flex-col">
            <ListBox
              label={t("Wallet Type")}
              options={[
                { value: "FIAT", label: t("Fiat") },
                { value: "SPOT", label: t("Spot") },
                { value: "ECO", label: t("Funding") },
              ]}
              selected={walletType}
              setSelected={(selectedOption) => {
                setWalletType(selectedOption);
              }}
            />
            <small className="text-warning-500 mt-1 text-xs">
              {t(
                "Choose the wallet type for the transaction: Fiat, Spot, or Funding."
              )}
            </small>
          </div>
          <div className="flex flex-col">
            <ListBox
              label={t("Currency")}
              options={getCurrencyOptions()}
              selected={currency}
              setSelected={(selectedOption) => {
                setCurrency(selectedOption);
              }}
            />
            <small className="text-warning-500 mt-1 text-xs">
              {t(
                "Select the currency for this offer based on the chosen wallet type."
              )}
            </small>
          </div>
          {walletType?.value === "ECO" && (
            <div className="flex flex-col">
              <ListBox
                label={t("Chain")}
                options={getChainOptions()}
                selected={chain}
                setSelected={setChain}
              />
              <small className="text-warning-500 mt-1 text-xs">
                {t(
                  "Specify the blockchain network if the wallet type is Funding."
                )}
              </small>
            </div>
          )}

          <div className="flex flex-col">
            <Input
              label={t("Price")}
              placeholder={t("Enter price per unit")}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <small className="text-warning-500 mt-1 text-xs">
              {t("Enter the price per unit of the selected currency.")}
            </small>
          </div>
          <div className="flex flex-col">
            <Input
              label={t("Minimum Amount")}
              placeholder={t("Enter minimum transaction amount")}
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
            />
            <small className="text-warning-500 mt-1 text-xs">
              {t(
                "Specify the minimum amount allowed for a transaction in this offer."
              )}
            </small>
          </div>
          <div className="flex flex-col">
            <Input
              label={t("Maximum Amount")}
              placeholder={t("Enter maximum transaction amount")}
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
            />
            <small className="text-warning-500 mt-1 text-xs">
              {t(
                "Specify the maximum amount allowed for a transaction in this offer."
              )}
            </small>
          </div>
        </div>
      </Card>
    </Layout>
  );
};

export default P2POfferEditor;
