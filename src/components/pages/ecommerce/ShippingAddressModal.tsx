import IconButton from "@/components/elements/base/button-icon/IconButton";
import Button from "@/components/elements/base/button/Button";
import Card from "@/components/elements/base/card/Card";
import Modal from "@/components/elements/base/modal/Modal";
import Input from "@/components/elements/form/input/Input";
import { Icon } from "@iconify/react";

import { useTranslation } from "next-i18next";
const ShippingAddressModal = ({
  open,
  onClose,
  onSubmit,
  address,
  setAddress,
}) => {
  const { t } = useTranslation();

  return (
    <Modal open={open} size="lg">
      <Card shape="smooth">
        <div className="flex items-center justify-between p-4 md:p-6">
          <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
            {t("Shipping Address")}
          </p>
          <IconButton size="sm" shape="full" onClick={onClose}>
            <Icon icon="lucide:x" className="h-4 w-4" />
          </IconButton>
        </div>
        <div className="p-4 md:px-6 md:py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              type="text"
              label={t("Name")}
              placeholder={t("Enter your name")}
              value={address.name}
              onChange={(e) => setAddress({ ...address, name: e.target.value })}
            />
            <Input
              type="text"
              label={t("Email")}
              placeholder={t("Enter your email")}
              value={address.email}
              onChange={(e) =>
                setAddress({ ...address, email: e.target.value })
              }
            />
            <Input
              type="text"
              label={t("Phone")}
              placeholder={t("Enter your phone number")}
              value={address.phone}
              onChange={(e) =>
                setAddress({ ...address, phone: e.target.value })
              }
            />
            <Input
              type="text"
              label={t("Street")}
              placeholder={t("Enter your street address")}
              value={address.street}
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
            />
            <Input
              type="text"
              label={t("City")}
              placeholder={t("Enter your city")}
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />
            <Input
              type="text"
              label={t("State")}
              placeholder={t("Enter your state")}
              value={address.state}
              onChange={(e) =>
                setAddress({ ...address, state: e.target.value })
              }
            />
            <Input
              type="text"
              label={t("Postal Code")}
              placeholder={t("Enter your postal code")}
              value={address.postalCode}
              onChange={(e) =>
                setAddress({ ...address, postalCode: e.target.value })
              }
            />
            <Input
              type="text"
              label={t("Country")}
              placeholder={t("Enter your country")}
              value={address.country}
              onChange={(e) =>
                setAddress({ ...address, country: e.target.value })
              }
            />
          </div>
        </div>
        <div className="p-4 md:p-6">
          <div className="flex w-full justify-end gap-2">
            <Button shape="smooth" onClick={onClose}>
              {t("Cancel")}
            </Button>
            <Button
              variant="solid"
              color="primary"
              shape="smooth"
              onClick={onSubmit}
            >
              {t("Confirm")}
            </Button>
          </div>
        </div>
      </Card>
    </Modal>
  );
};

export default ShippingAddressModal;
