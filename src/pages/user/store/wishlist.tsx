// pages/user/wishlist.tsx
import React, { useEffect, useState } from "react";
import Layout from "@/layouts/Default";
import { useEcommerceStore } from "@/stores/user/ecommerce";
import Card from "@/components/elements/base/card/Card";
import { Icon } from "@iconify/react";
import { MashImage } from "@/components/elements/MashImage";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import Tag from "@/components/elements/base/tag/Tag";
import { capitalize } from "lodash";
import Input from "@/components/elements/form/input/Input";
import { BackButton } from "@/components/elements/base/button/BackButton";
const WishlistPage = () => {
  const { t } = useTranslation();
  const { wishlist, fetchWishlist, removeFromWishlist } = useEcommerceStore();
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    fetchWishlist();
  }, []);
  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const filteredWishlist = wishlist.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <Layout title={t("Wishlist")} color="muted">
      <main>
        <div className="flex flex-col md:flex-row gap-5 justify-between items-center">
          <h2 className="text-2xl">
            <span className="text-primary-500">{t("Your Wishlist")}</span>{" "}
            <span className="text-muted-800 dark:text-muted-200">
              {t("Products")}
            </span>
          </h2>

          <div className="flex gap-2 w-full sm:max-w-xs text-end">
            <Input
              type="text"
              placeholder={t("Search Products...")}
              value={searchTerm}
              onChange={handleSearchChange}
              icon={"mdi:magnify"}
            />
            <BackButton href={"/store"}>{t("Back to Store")}</BackButton>
          </div>
        </div>

        {filteredWishlist.length > 0 ? (
          <div className="grid gap-x-3 gap-y-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-6">
            {filteredWishlist.map((product) => (
              <div key={product.id} className="relative group">
                <Link
                  href={`/store/${product.categoryName}/${product.name.replace(
                    / /g,
                    "-"
                  )}`}
                >
                  <Card
                    className="group relative w-full h-full p-3 hover:shadow-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-400"
                    color="contrast"
                  >
                    <div className="relative w-full h-[200px]">
                      <MashImage
                        src={product.image || "/img/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={200}
                        className="rounded-md object-cover w-full h-full bg-muted-100 dark:bg-muted-900"
                      />
                      <div className="absolute top-1 left-1">
                        <Tag color="primary">
                          {capitalize(product.categoryName)}
                        </Tag>
                      </div>
                    </div>
                    <div className="mb-2">
                      <h4 className="text-muted-800 dark:text-muted-100 font-medium">
                        {product.name}
                      </h4>
                      <p className="text-muted-500 dark:text-muted-400 text-xs">
                        {product.description.length > 100
                          ? product.description.slice(0, 100) + "..."
                          : product.description}
                      </p>
                    </div>
                    <div className="divide-muted-200 dark:divide-muted-700 flex items-center justify-between">
                      <div className="pe-4">
                        <span className="text-muted-800 dark:text-muted-100 font-bold">
                          {product.price} {product.currency}
                        </span>
                      </div>
                      <Tag shape="full" className="flex items-center">
                        <span>{t("Rating")}</span>
                        <Icon
                          icon="uiw:star-on"
                          className={`h-3 w-3 text-warning-500 ${
                            product.rating === 0 ? "grayscale" : ""
                          }`}
                        />
                        <span className="text-muted-400 text-xs">
                          {product.rating.toFixed(1)} ({product.reviewsCount})
                        </span>
                      </Tag>
                    </div>
                  </Card>
                </Link>
                <div className="absolute top-5 right-5">
                  <IconButton
                    size={"sm"}
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    color={"danger"}
                    variant={"pastel"}
                  >
                    <Icon
                      icon="mdi:heart"
                      className="h-5 w-5 text-danger-500"
                    />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="my-16 w-full text-center">
            <h2>{t("No Products in Wishlist")}</h2>
            <p>{t("Your wishlist is currently empty.")}</p>
          </div>
        )}
      </main>
    </Layout>
  );
};
export default WishlistPage;
