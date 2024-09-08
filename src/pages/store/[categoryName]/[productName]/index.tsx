"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/layouts/Default";
import $fetch from "@/utils/api";
import Input from "@/components/elements/form/input/Input";
import Card from "@/components/elements/base/card/Card";
import { Icon } from "@iconify/react";
import Button from "@/components/elements/base/button/Button";
import { MashImage } from "@/components/elements/MashImage";
import Link from "next/link";
import { BackButton } from "@/components/elements/base/button/BackButton";
import { useDashboardStore } from "@/stores/dashboard";
import { Tab } from "@/components/elements/base/tab";
import { capitalize, debounce } from "lodash";
import { useEcommerceStore } from "@/stores/user/ecommerce";
import { ProductReview } from "@/components/pages/user/store/product/ProductReview";
import { ProductDetails } from "@/components/pages/user/store/product/ProductDetails";
import { DownloadProduct } from "@/components/pages/user/store/product/DownloadProduct";
import { useWalletStore } from "@/stores/user/wallet";
import { useTranslation } from "next-i18next";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { toast } from "sonner";
import ShippingAddressModal from "@/components/pages/ecommerce/ShippingAddressModal";

const ProductPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { categoryName, productName } = router.query as {
    categoryName: string;
    productName: string;
  };
  const [amount, setAmount] = useState(1);
  const [discount, setDiscount] = useState<any>(null);
  const { profile, getSetting } = useDashboardStore();
  const {
    product,
    fetchProduct,
    wishlist,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
  } = useEcommerceStore();
  const { wallet, fetchWallet } = useWalletStore();

  const [mainTab, setMainTab] = useState("DESCRIPTION");

  const tabs = [
    { value: "DESCRIPTION", label: "Description" },
    { value: "REVIEWS", label: "Reviews" },
  ];

  const fetchProductData = async () => {
    await fetchWishlist();
    await fetchProduct(productName);
  };
  const debouncedFetchProduct = debounce(fetchProductData, 100);

  useEffect(() => {
    if (router.isReady && productName) {
      debouncedFetchProduct();
    }
  }, [router.isReady, productName]);

  const [isFetched, setIsFetched] = useState(false);
  const fetchWalletData = async () => {
    if (
      product &&
      (!wallet ||
        wallet.type !== product.walletType ||
        wallet.currency !== product.currency)
    ) {
      setIsFetched(true);
      await fetchWallet(product.walletType, product.currency);
    }
  };

  useEffect(() => {
    if (!isFetched && product) {
      fetchWalletData();
    }
  }, [isFetched, product]);

  const handleDiscount = async (code: string) => {
    const { data, error } = await $fetch({
      url: `/api/ext/ecommerce/discount/${product?.id}`,
      method: "POST",
      body: { code },
    });
    if (!error) {
      setDiscount(data);
    }
  };

  const debouncedDiscount = debounce(handleDiscount, 500);

  const [showShippingModal, setShowShippingModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const handlePurchase = async () => {
    if (
      getSetting("ecommerceRestrictions") === "true" &&
      (!profile?.kyc?.status ||
        (parseFloat(profile?.kyc?.level || "0") < 2 &&
          profile?.kyc?.status !== "APPROVED"))
    ) {
      await router.push("/user/profile?tab=kyc");
      toast.error(t("Please complete your KYC to purchase this product"));
      return;
    }

    if (product?.type !== "DOWNLOADABLE") {
      setShowShippingModal(true);
    } else {
      await finalizePurchase();
    }
  };

  const finalizePurchase = async () => {
    const { data, error } = await $fetch({
      url: `/api/ext/ecommerce/order`,
      method: "POST",
      body: {
        productId: product?.id,
        discountId: discount?.id,
        amount,
        shippingAddress:
          product?.type !== "DOWNLOADABLE" ? shippingAddress : undefined,
      },
    });
    if (!error) {
      if (product) await fetchWallet(product.walletType, product.currency);
      router.push(`/user/store/${data.id}`);
    }
  };

  const handleWishlistToggle = (product) => {
    if (wishlist.find((item) => item.id === product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Layout title={`${capitalize(product?.name)}`} color="muted">
      <main>
        <div className="flex flex-col md:flex-row gap-5 justify-between items-center">
          <h2 className="text-2xl">
            <span className="text-primary-500">
              {capitalize(product?.name)}
            </span>{" "}
            <span className="text-muted-800 dark:text-muted-200">
              {t("Details")}
            </span>
          </h2>
          <BackButton href={`/store/${categoryName}`} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-6">
          <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-5">
            <div className="relative h-[400px]">
              <MashImage
                src={product?.image || "/img/placeholder.svg"}
                fill
                alt={product?.name || "Product Image"}
                className="rounded-lg object-cover h-[400px] w-full"
              />
              {profile && (
                <div className="absolute top-5 right-5">
                  <IconButton
                    size={"sm"}
                    onClick={() => handleWishlistToggle(product)}
                    color={
                      wishlist.find((item) => item.id === product?.id)
                        ? "danger"
                        : "muted"
                    }
                    variant={"pastel"}
                  >
                    <Icon
                      icon="mdi:heart"
                      className={`h-5 w-5 ${
                        wishlist.find((item) => item.id === product?.id)
                          ? "text-danger-500"
                          : "text-muted-300"
                      }`}
                    />
                  </IconButton>
                </div>
              )}
            </div>
            <div className="flex gap-2 border-b border-muted-200 dark:border-muted-800">
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  value={tab.value}
                  label={tab.label}
                  tab={mainTab}
                  setTab={setMainTab}
                  color="primary"
                />
              ))}
            </div>
            <div className="w-full flex flex-col h-full">
              <div className="flex-1">
                {mainTab === "DESCRIPTION" ? (
                  <Card
                    className="text-md text-muted-800 dark:text-muted-200 p-5"
                    color="contrast"
                  >
                    <p>{product?.description}</p>
                  </Card>
                ) : (
                  <ProductReview />
                )}
              </div>
            </div>
          </div>
          <div className="col-span-1 space-y-5">
            <ProductDetails product={product} categoryName={categoryName} />
            <Card
              className="text-muted-800 dark:text-muted-200 flex flex-col justify-between text-sm"
              color="contrast"
            >
              <div className="w-full">
                <h3 className="text-md font-semibold px-5 py-3">
                  {t("Purchase")}
                </h3>
                <ul className="flex flex-col gap-1">
                  <li className="flex justify-between border-b border-muted-200 dark:border-muted-700 px-5 pb-1">
                    <p className="text-muted-500 dark:text-muted-300">
                      {t("Balance")}
                    </p>
                    <span className="flex">
                      {wallet?.balance || 0} {product?.currency}
                      <Link href={`/user/wallet/deposit`}>
                        <Icon
                          icon="ei:plus"
                          className="h-5 w-5 text-success-500"
                        />
                      </Link>
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-muted-200 dark:border-muted-700 px-5 pb-1">
                    <p className="text-muted-500 dark:text-muted-300">
                      {t("Discount")}
                    </p>
                    <span>{discount?.percentage ?? 0}%</span>
                  </li>
                  <li className="flex justify-between border-b border-muted-200 dark:border-muted-700 px-5 pb-1">
                    <p className="text-muted-500 dark:text-muted-300">
                      {t("Total to Pay")}
                    </p>
                    <span>
                      {product &&
                        product?.price -
                          (product?.price * (discount?.percentage ?? 0)) /
                            100}{" "}
                      {product?.currency}
                    </span>
                  </li>
                </ul>
                {product?.type !== "DOWNLOADABLE" && (
                  <div className="pt-4 px-5">
                    <Input
                      type="number"
                      label={t("Amount")}
                      placeholder={t("Enter amount")}
                      value={amount}
                      onChange={(e) => setAmount(parseInt(e.target.value))}
                      min={1}
                      max={product?.inventoryQuantity}
                      disabled={!wallet}
                    />
                  </div>
                )}
                <div className="pt-4 px-5">
                  <Input
                    type="text"
                    label={t("Discount Code")}
                    placeholder={t("Enter discount code")}
                    onChange={(e) => {
                      debouncedDiscount(e.target.value);
                    }}
                  />
                </div>
                <div className="pb-5 px-5">
                  <Button
                    type="button"
                    shape="rounded"
                    color="primary"
                    className="w-full mt-4"
                    onClick={() => handlePurchase()}
                    disabled={
                      !wallet ||
                      !amount ||
                      amount === 0 ||
                      (product ? amount > product?.inventoryQuantity : false) ||
                      (product
                        ? product.price -
                            (product.price * (discount?.percentage || 0)) /
                              100 >
                          wallet?.balance
                        : false)
                    }
                  >
                    {t("Purchase")}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <ShippingAddressModal
        open={showShippingModal}
        onClose={() => setShowShippingModal(false)}
        onSubmit={() => {
          setShowShippingModal(false);
          finalizePurchase();
        }}
        address={shippingAddress}
        setAddress={setShippingAddress}
      />
    </Layout>
  );
};

export default ProductPage;
