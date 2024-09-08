import { memo } from "react";
import { useTranslation } from "next-i18next";

const OrderShippingAddressDetailsBase = ({ shippingAddress }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      <ul className="text-muted-800 dark:text-gray-300">
        <li className="flex divide-x divide-muted-200 border-t border-x border-muted-200 text-sm dark:divide-gray-700 dark:border-gray-700">
          <div className="w-1/4 p-2 text-muted-400 dark:text-gray-400">
            {t("Name")}
          </div>
          <div className="flex-1 p-2 font-medium text-muted-800 dark:text-gray-300">
            {shippingAddress.name}
          </div>
        </li>
        <li className="flex divide-x divide-muted-200 border-t border-x border-muted-200 text-sm dark:divide-gray-700 dark:border-gray-700">
          <div className="w-1/4 p-2 text-muted-400 dark:text-gray-400">
            {t("Email")}
          </div>
          <div className="flex-1 p-2 font-medium text-muted-800 dark:text-gray-300">
            {shippingAddress.email}
          </div>
        </li>
        <li className="flex divide-x divide-muted-200 border border-muted-200 text-sm dark:divide-gray-700 dark:border-gray-700">
          <div className="w-1/4 p-2 text-muted-400 dark:text-gray-400">
            {t("Phone")}
          </div>
          <div className="flex-1 p-2 font-medium text-muted-800 dark:text-gray-300">
            {shippingAddress.phone}
          </div>
        </li>
      </ul>
      <ul className="text-muted-800 dark:text-gray-300">
        <li className="flex divide-x divide-muted-200 border-t border-x border-muted-200 text-sm dark:divide-gray-700 dark:border-gray-700">
          <div className="w-1/4 p-2 text-muted-400 dark:text-gray-400">
            {t("Street")}
          </div>
          <div className="flex-1 p-2 font-medium text-muted-800 dark:text-gray-300">
            {shippingAddress.street}
          </div>
        </li>
        <li className="flex divide-x divide-muted-200 border-t border-x border-muted-200 text-sm dark:divide-gray-700 dark:border-gray-700">
          <div className="w-1/4 p-2 text-muted-400 dark:text-gray-400">
            {t("City")}
          </div>
          <div className="flex-1 p-2 font-medium text-muted-800 dark:text-gray-300">
            {shippingAddress.city}
          </div>
        </li>
        <li className="flex divide-x divide-muted-200 border-t border-x border-muted-200 text-sm dark:divide-gray-700 dark:border-gray-700">
          <div className="w-1/4 p-2 text-muted-400 dark:text-gray-400">
            {t("State")}
          </div>
          <div className="flex-1 p-2 font-medium text-muted-800 dark:text-gray-300">
            {shippingAddress.state}
          </div>
        </li>
        <li className="flex divide-x divide-muted-200 border-t border-x border-muted-200 text-sm dark:divide-gray-700 dark:border-gray-700">
          <div className="w-1/4 p-2 text-muted-400 dark:text-gray-400">
            {t("Country")}
          </div>
          <div className="flex-1 p-2 font-medium text-muted-800 dark:text-gray-300">
            {shippingAddress.country}
          </div>
        </li>
        <li className="flex divide-x divide-muted-200 border border-muted-200 text-sm dark:divide-gray-700 dark:border-gray-700">
          <div className="w-1/4 p-2 text-muted-400 dark:text-gray-400">
            {t("Postal Code")}
          </div>
          <div className="flex-1 p-2 font-medium text-muted-800 dark:text-gray-300">
            {shippingAddress.postalCode}
          </div>
        </li>
      </ul>
    </div>
  );
};

export const OrderShippingAddressDetails = memo(
  OrderShippingAddressDetailsBase
);
