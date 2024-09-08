import { memo } from "react";
import ListWidgetItem from "@/components/widgets/ListWidgetItem";
import IconBox from "@/components/elements/base/iconbox/IconBox";
import { formatDate } from "date-fns";
import { useTranslation } from "next-i18next";
const OrderDeliveryDateBase = ({ shipping }) => {
  const { t } = useTranslation();
  return (
    <li>
      <ListWidgetItem
        href="#"
        avatarSize="xs"
        avatar={
          <IconBox
            icon="ph:truck-duotone"
            className="!h-8 !w-8 !rounded-lg bg-success-500/10"
            iconClasses="!h-5 !w-5 text-success-500"
          />
        }
        title={t("Estimated Delivery")}
        text={
          shipping.deliveryDate
            ? formatDate(new Date(shipping.deliveryDate), "dd MMM yyyy")
            : "Pending"
        }
        itemAction={<></>}
      />
    </li>
  );
};
export const OrderDeliveryDate = memo(OrderDeliveryDateBase);
