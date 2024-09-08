import { memo } from "react";
import Card from "@/components/elements/base/card/Card";
import { useTranslation } from "next-i18next";
import { capitalize } from "lodash";
const ProductDetailsBase = ({ product, categoryName }) => {
  const { t } = useTranslation();
  return (
    <Card
      className="text-muted-800 dark:text-muted-200 text-sm"
      color="contrast"
    >
      <h3 className="text-md font-semibold px-5 py-3">
        {t("Product Details")}
      </h3>
      <ul className="flex flex-col gap-1">
        <li className="border-b border-muted-200 dark:border-muted-700 flex justify-between px-5 pb-1">
          <p className="text-muted-500 dark:text-muted-300">{t("Name")}</p>{" "}
          {product?.name}
        </li>
        <li className="border-b border-muted-200 dark:border-muted-700 flex justify-between px-5 pb-1">
          <p className="text-muted-500 dark:text-muted-300">{t("Category")}</p>{" "}
          {categoryName}
        </li>
        <li className="border-b border-muted-200 dark:border-muted-700 flex justify-between px-5 pb-1">
          <p className="text-muted-500 dark:text-muted-300">{t("Type")}</p>{" "}
          {capitalize(product?.type)}
        </li>
        <li className="border-b border-muted-200 dark:border-muted-700 flex justify-between px-5 pb-1">
          <p className="text-muted-500 dark:text-muted-300">{t("Price")}</p>{" "}
          {product?.price} {product?.currency}
        </li>
        <li className="flex justify-between px-5 pb-2">
          <p className="text-muted-500 dark:text-muted-300">{t("Stock")}</p>{" "}
          {product?.inventoryQuantity}
        </li>
      </ul>
    </Card>
  );
};
export const ProductDetails = memo(ProductDetailsBase);
