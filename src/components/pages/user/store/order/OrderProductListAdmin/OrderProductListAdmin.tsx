import React from "react";
import ListWidgetItem from "@/components/widgets/ListWidgetItem";
import { MashImage } from "@/components/elements/MashImage";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Card from "@/components/elements/base/card/Card";
import { useTranslation } from "next-i18next";

const OrderProductListAdmin = ({ products }) => {
  const { t } = useTranslation();
  return (
    <Card className="p-4">
      <h4 className="mb-4 font-sans text-xs font-medium uppercase text-muted-500">
        {t("Products")}
      </h4>
      <ul className="inner-list">
        {products.map((product, index) => (
          <li key={index}>
            <ListWidgetItem
              href="#"
              avatarSize="xxs"
              avatar={
                <MashImage
                  src={product.image || "/img/placeholder.svg"}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="rounded-lg"
                />
              }
              title={product.name}
              text={`${product.price} ${product.currency}`}
              itemAction={
                <div className="flex items-center gap-2">
                  <Link
                    href={`/store/${product.category?.name}/${product.name}`}
                    className="cursor-pointer text-muted-400 transition-colors duration-300 hover:text-primary-500"
                  >
                    <Icon icon="lucide:arrow-right" />
                  </Link>
                </div>
              }
            />
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default OrderProductListAdmin;
