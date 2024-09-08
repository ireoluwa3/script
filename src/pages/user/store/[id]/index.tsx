import Layout from "@/layouts/Default";
import React, { useEffect, useState } from "react";
import { useDashboardStore } from "@/stores/dashboard";
import { useRouter } from "next/router";
import $fetch from "@/utils/api";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Button from "@/components/elements/base/button/Button";
import Card from "@/components/elements/base/card/Card";
import IconBox from "@/components/elements/base/iconbox/IconBox";
import ListWidgetItem from "@/components/widgets/ListWidgetItem";
import { BackButton } from "@/components/elements/base/button/BackButton";
import Tag from "@/components/elements/base/tag/Tag";
import { BarCode } from "@/components/pages/user/store/order/BarCode";
import { OrderRecipient } from "@/components/pages/user/store/order/OrderRecipient";
import { OrderShippingDetails } from "@/components/pages/user/store/order/OrderShippingDetails";
import { OrderShippingCost } from "@/components/pages/user/store/order/OrderShippingCost";
import { OrderDeliveryDate } from "@/components/pages/user/store/order/OrderDeliveryDate";
import { OrderProductList } from "@/components/pages/user/store/order/OrderProductList";
import { useTranslation } from "next-i18next";

type Order = {
  id: string;
  userId: string;
  status: "COMPLETED" | "PENDING" | "CANCELLED";
  shippingId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  products: {
    name: string;
    price: number;
    status: boolean;
    type: "DOWNLOADABLE" | "PHYSICAL";
    image: string;
    currency: string;
    walletType: string;
    category: {
      name: string;
    };
    ecommerceOrderItem: {
      quantity: number;
      key: string;
      filePath: string;
    };
  }[];
  shipping: Shipping;
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
};
type Shipping = {
  id: string;
  loadId: string;
  loadStatus: "PENDING" | "TRANSIT" | "DELIVERED" | "CANCELLED";
  shipper: string;
  transporter: string;
  goodsType: string;
  weight: number;
  volume: number;
  description: string;
  vehicle: string;
  cost?: number;
  tax?: number;
  deliveryDate?: string;
  createdAt?: string;
  updatedAt?: string;
};
const OrderReceipt = () => {
  const { t } = useTranslation();
  const { profile } = useDashboardStore();
  const router = useRouter();
  const { id } = router.query as {
    id: string;
  };
  const [order, setOrder] = useState<Order | null>(null);
  const fetchOrder = async () => {
    const { data, error } = await $fetch({
      url: `/api/ext/ecommerce/order/${id}`,
      silent: true,
    });
    if (!error) {
      setOrder(data);
    }
  };
  useEffect(() => {
    if (router.isReady) {
      fetchOrder();
    }
  }, [router.isReady]);
  const handlePrint = () => {
    const printable = document.getElementById("printable");
    if (printable) {
      // Create a new style element
      const style = document.createElement("style");
      style.innerHTML = `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable, #printable * {
            visibility: visible;
          }
          #printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `;
      // Append the style to the document head
      document.head.appendChild(style);
      // Print the content of the printable element
      window.print();
      // Remove the style after printing
      document.head.removeChild(style);
    }
  };
  if (!order) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <Icon
            icon="mdi:loading"
            className="h-12 w-12 animate-spin text-primary-500"
          />
          <p className="text-xl text-primary-500">{t("Loading order...")}</p>
        </div>
      </div>
    );
  }
  return (
    <Layout title={t("Receipt")} color="muted">
      <main>
        <div className="mb-6 flex w-full">
          <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h2 className="font-sans text-2xl font-light leading-tight text-muted-800 dark:text-muted-100">
                {t("Receipt")}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <BackButton href={`/user/store`} />
              <Button type="button" onClick={handlePrint} className="w-24">
                <Icon icon="mdi:printer" className="mr-2" />
                {t("Print")}
              </Button>
            </div>
          </div>
        </div>

        <div id="printable" className="grid grid-cols-12 gap-6">
          <div className="col-span-12 ltablet:col-span-8 lg:col-span-8">
            <Card
              color="contrast"
              className="flex w-full flex-col p-8 font-sans"
            >
              <div className="flex flex-row justify-between border-b border-muted-200 pb-6 dark:border-muted-800">
                <div className="mx-auto flex w-full flex-col">
                  <div className="flex flex-row">
                    <h3 className="text-xl">
                      <span className="block text-sm text-muted-400">
                        {t("PROOF OF DELIVERY")}
                      </span>
                      <span className="block text-base text-muted-800 dark:text-muted-100">
                        {t("Order")} {order.id}
                      </span>
                    </h3>
                  </div>
                  {order.shipping && <BarCode id={id} date={order.createdAt} />}
                </div>
                {!order.shipping && (
                  <div className="brand">
                    <Tag color="warning" shape="rounded" variant="pastel">
                      {t("PENDING")}
                    </Tag>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-5 pt-6">
                {order.products.some(
                  (product) => product.type === "PHYSICAL"
                ) ? (
                  <OrderRecipient shippingAddress={order.shippingAddress} />
                ) : (
                  <div className="flex flex-col">
                    <span className="mb-2 text-xs uppercase text-muted-400">
                      {t("Recipient")}
                    </span>
                    <ul className="text-muted-800">
                      <li className="flex divide-x divide-muted-200 border border-muted-200 text-sm dark:divide-muted-800 dark:border-muted-800">
                        <div className="flex-1 p-2 text-muted-400">
                          {t("Name")}
                        </div>
                        <div className="flex-1 p-2 font-medium text-muted-800 dark:text-muted-100">
                          {profile?.firstName} {profile?.lastName}
                        </div>
                      </li>
                      <li className="flex divide-x divide-muted-200 border border-muted-200 text-sm dark:divide-muted-800 dark:border-muted-800">
                        <div className="flex-1 p-2 text-muted-400">
                          {t("Email")}
                        </div>
                        <div className="flex-1 p-2 font-medium text-muted-800 dark:text-muted-100">
                          {profile?.email}
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
                {order.shipping && (
                  <OrderShippingDetails shipping={order.shipping} />
                )}
              </div>
              {order.shipping && (
                <OrderShippingCost shipping={order.shipping} />
              )}
            </Card>
          </div>

          <div className="col-span-12 ltablet:col-span-4 lg:col-span-4">
            <Card shape="smooth" color="contrast">
              <div className="border-b-2 border-dashed border-muted-200 p-6 dark:border-muted-800">
                <h4 className="mb-4 font-sans text-xs font-medium uppercase text-muted-500">
                  {t("Order Info")}
                </h4>

                <ul className="relative">
                  {order.shipping && (
                    <OrderDeliveryDate shipping={order.shipping} />
                  )}
                  <li>
                    <ListWidgetItem
                      href="#"
                      avatarSize="xs"
                      avatar={
                        <IconBox
                          icon="ph:envelope-duotone"
                          className="!h-8 !w-8 !rounded-lg bg-info-500/10"
                          iconClasses="!h-5 !w-5 text-info-500"
                        />
                      }
                      title={t("Support Email")}
                      text={
                        process.env.NEXT_PUBLIC_APP_EMAIL || "Not available"
                      }
                      itemAction={
                        <Link
                          href={`mailto:${process.env.NEXT_PUBLIC_APP_EMAIL}`}
                          className="cursor-pointer text-muted-400 transition-colors duration-300 hover:text-primary-500"
                        >
                          <Icon icon="lucide:arrow-right" />
                        </Link>
                      }
                    />
                  </li>
                </ul>
              </div>
              <div className="px-6 pt-6 pb-3">
                <h4 className="mb-4 font-sans text-xs font-medium uppercase text-muted-500">
                  {t("Products")}
                </h4>

                <ul className="inner-list">
                  <OrderProductList products={order.products} />
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </Layout>
  );
};
export default OrderReceipt;
