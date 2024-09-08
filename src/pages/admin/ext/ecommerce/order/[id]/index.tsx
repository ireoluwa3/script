import React, { useEffect, useState } from "react";
import Layout from "@/layouts/Default";
import { useTranslation } from "next-i18next";
import $fetch from "@/utils/api";
import { capitalize, debounce } from "lodash";
import { useRouter } from "next/router";
import { BackButton } from "@/components/elements/base/button/BackButton";
import { OrderShippingAddressDetails } from "@/components/pages/user/store/order/OrderShippingAddressDetails";
import { OrderShippingAddressInputs } from "@/components/pages/user/store/order/OrderShippingAddressInputs";
import { OrderShippingDetails } from "@/components/pages/user/store/order/OrderShippingDetails";
import Card from "@/components/elements/base/card/Card";
import Button from "@/components/elements/base/button/Button";
import Select from "@/components/elements/form/select/Select";
import { toast } from "sonner";
import OrderUserInfo from "@/components/pages/user/store/order/OrderUserInfo/OrderUserInfo";
import OrderDownloadOptions from "@/components/pages/user/store/order/OrderDownloadOptions/OrderDownloadOptions";
import OrderProductListAdmin from "@/components/pages/user/store/order/OrderProductListAdmin/OrderProductListAdmin";

interface Order {
  id: string;
  userId: string;
  status: string;
  shippingId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  productId: string | null;
  products: Product[];
  user: User;
  shippingAddress: ShippingAddress | null;
  shipping: Shipment | null;
}

interface Product {
  name: string;
  price: number;
  status: boolean;
  type: string;
  image: string;
  currency: string;
  walletType: string;
  category: Category;
  ecommerceOrderItem: EcommerceOrderItem;
}

interface Category {
  name: string;
}

interface EcommerceOrderItem {
  id: string;
  quantity: number;
  key: string | null;
  filePath: string | null;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
}

interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface Shipment {
  id: string;
  loadId: string;
  loadStatus: string;
  shipper: string;
  transporter: string;
  goodsType: string;
  weight: number;
  volume: number;
  description: string;
  vehicle: string;
  cost: number;
  tax: number;
  deliveryDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

const api = "/api/admin/ext/ecommerce/order";

const EcommerceOrders = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [order, setOrder] = useState<Order | null>(null);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });
  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<string>("");

  const handleShipmentAssignment = async () => {
    if (!selectedShipment) {
      toast.error("Please select a shipment");
      return;
    }

    const { data, error } = await $fetch({
      url: `${api}/${id}/shipment`,
      method: "PUT",
      body: {
        shipmentId: selectedShipment,
      },
      silent: true,
    });

    if (!error) {
      fetchOrder();
    }
  };

  const fetchOrder = async () => {
    const { data, error } = await $fetch({
      url: `${api}/${id}`,
      silent: true,
    });

    if (!error) {
      setShipments(data.shipments);
      if (!data.order) return;
      setOrder(data.order);
      if (data.order.shippingAddress)
        setShippingAddress(data.order.shippingAddress);
      setOrderStatus(data.order.status); // Set initial order status
    }
  };

  const debounceFetchOrder = debounce(fetchOrder, 100);

  useEffect(() => {
    if (router.isReady) {
      debounceFetchOrder();
    }
  }, [router.isReady]);

  const handleShippingUpdate = async () => {
    const { data, error } = await $fetch({
      url: `${api}/${id}/shipping`,
      method: "PUT",
      body: {
        shippingAddress,
      },
      silent: true,
    });

    if (!error) {
      fetchOrder();
      setIsEditingShipping(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value;
    const { data, error } = await $fetch({
      url: `${api}/${id}`,
      method: "PUT",
      body: {
        status: newStatus,
      },
      silent: true,
    });

    if (!error) {
      setOrderStatus(newStatus);
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <Layout title={`${t("Order")} ${id || "Loading"}`} color="muted">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold dark:text-white">
          {t("Order")} {id} {t("Details")}
        </h1>
        <BackButton href="/admin/ext/ecommerce/order" />
      </div>
      {order ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="col-span-1 md:col-span-8 flex flex-col gap-4">
            <Card className="p-4">
              <OrderUserInfo order={order} />
              {order.products[0].type === "PHYSICAL" && (
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2 dark:text-white">
                    {t("Shipping Address")}
                  </h2>
                  {!isEditingShipping ? (
                    <div>
                      <OrderShippingAddressDetails
                        shippingAddress={shippingAddress}
                      />
                      {order.status === "PENDING" && (
                        <Button
                          color="primary"
                          onClick={() => setIsEditingShipping(true)}
                          className="mt-4"
                        >
                          {t("Edit Shipping Address")}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <>
                      <OrderShippingAddressInputs
                        shippingAddress={shippingAddress}
                        handleInputChange={handleInputChange}
                      />
                      <div className="flex justify-end col-span-2">
                        <Button
                          color="primary"
                          onClick={handleShippingUpdate}
                          className="mt-4"
                        >
                          {t("Update Shipping Address")}
                        </Button>
                        <Button
                          color="muted"
                          onClick={() => setIsEditingShipping(false)}
                          className="mt-4 ml-2"
                        >
                          {t("Cancel")}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </Card>

            {order.status === "PENDING" && (
              <div>
                <Card className="p-4">
                  {order.products[0].type === "PHYSICAL" ? (
                    order.shipping ? (
                      <>
                        <h2 className="text-lg font-semibold mb-2 dark:text-white">
                          {t("Shipment Details")}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <OrderShippingDetails shipping={order.shipping} />
                        </div>
                      </>
                    ) : (
                      <>
                        <h2 className="text-lg font-semibold mb-5 dark:text-white">
                          {t("Assign Shipment")}
                        </h2>
                        <Select
                          value={selectedShipment || ""}
                          onChange={(e) => setSelectedShipment(e.target.value)}
                          options={[
                            {
                              value: "",
                              label: capitalize(t("Select Shipment")),
                            },
                            ...shipments.map((shipment) => ({
                              value: shipment.id,
                              label: `${shipment.loadId} - ${shipment.shipper}`,
                            })),
                          ]}
                        />
                        <div className="flex justify-end">
                          <Button
                            color="primary"
                            onClick={handleShipmentAssignment}
                            className="mt-4"
                          >
                            {t("Assign Shipment")}
                          </Button>
                        </div>
                      </>
                    )
                  ) : (
                    <OrderDownloadOptions
                      order={order}
                      orderItem={order.products[0]?.ecommerceOrderItem}
                      fetchOrder={fetchOrder}
                    />
                  )}
                </Card>
              </div>
            )}
          </div>
          <div className="col-span-1 md:col-span-4">
            <OrderProductListAdmin products={order.products} />
            {orderStatus === "PENDING" && (
              <Card className="mt-4 p-4">
                <h2 className="text-lg font-semibold mb-4 dark:text-white">
                  {t("Edit Order Status")}
                </h2>
                <Select
                  value={orderStatus}
                  onChange={handleStatusChange}
                  options={[
                    { value: "COMPLETED", label: t("COMPLETED") },
                    { value: "CANCELLED", label: t("CANCELLED") },
                    { value: "REJECTED", label: t("REJECTED") },
                  ]}
                />
              </Card>
            )}
          </div>
        </div>
      ) : (
        <p className="dark:text-gray-300">{t("Loading order details...")}</p>
      )}
    </Layout>
  );
};

export default EcommerceOrders;
export const permission = "Access Ecommerce Order Management";
