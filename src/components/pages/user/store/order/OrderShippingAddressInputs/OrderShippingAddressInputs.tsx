import { memo } from "react";
import Input from "@/components/elements/form/input/Input";
import { useTranslation } from "next-i18next";

const OrderShippingAddressInputsBase = ({
  shippingAddress,
  handleInputChange,
}) => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label={t("Name")}
        name="name"
        type="text"
        value={shippingAddress.name}
        onChange={handleInputChange}
      />
      <Input
        label={t("Email")}
        name="email"
        type="text"
        value={shippingAddress.email}
        onChange={handleInputChange}
      />
      <Input
        label={t("Phone")}
        name="phone"
        type="text"
        value={shippingAddress.phone}
        onChange={handleInputChange}
      />
      <Input
        label={t("Street")}
        name="street"
        type="text"
        value={shippingAddress.street}
        onChange={handleInputChange}
      />
      <Input
        label={t("City")}
        name="city"
        type="text"
        value={shippingAddress.city}
        onChange={handleInputChange}
      />
      <Input
        label={t("State")}
        name="state"
        type="text"
        value={shippingAddress.state}
        onChange={handleInputChange}
      />
      <Input
        label={t("Country")}
        name="country"
        type="text"
        value={shippingAddress.country}
        onChange={handleInputChange}
      />
      <Input
        label={t("Postal Code")}
        name="postalCode"
        type="text"
        value={shippingAddress.postalCode}
        onChange={handleInputChange}
      />
    </div>
  );
};

export const OrderShippingAddressInputs = memo(OrderShippingAddressInputsBase);
