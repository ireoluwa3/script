// pages/store/[categoryName].tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/layouts/Default";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Card from "@/components/elements/base/card/Card";
import { MashImage } from "@/components/elements/MashImage";
import Input from "@/components/elements/form/input/Input";
import Tag from "@/components/elements/base/tag/Tag";
import { capitalize, debounce } from "lodash";
import { useEcommerceStore } from "@/stores/user/ecommerce";
import { BackButton } from "@/components/elements/base/button/BackButton";
import Button from "@/components/elements/base/button/Button";
import { useTranslation } from "next-i18next";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { useDashboardStore } from "@/stores/dashboard";
const CategoryPage = () => {
  const { t } = useTranslation();
  const { profile } = useDashboardStore();
  const router = useRouter();
  const { categoryName } = router.query as {
    categoryName: string;
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [displayLimit, setDisplayLimit] = useState<number>(9);
  const {
    products,
    setCategory,
    wishlist,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
  } = useEcommerceStore();
  const setCategoryData = async () => {
    await setCategory(categoryName);
    fetchWishlist();
  };
  const debouncedSetCategoryData = debounce(setCategoryData, 100);
  useEffect(() => {
    if (router.isReady) {
      debouncedSetCategoryData();
    }
  }, [router.isReady]);
  const loadMore = () => {
    setDisplayLimit(displayLimit + 9);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const handleWishlistToggle = (product) => {
    if (wishlist.find((item) => item.id === product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  const filteredProducts = products
    .slice(0, displayLimit)
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  return (
    <Layout title={`${capitalize(categoryName)} Products`}>
      <div className="flex flex-col md:flex-row gap-5 justify-between items-center">
        <h2 className="text-2xl">
          <span className="text-primary-500">{capitalize(categoryName)}</span>{" "}
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
          <BackButton href={`/store`} />
        </div>
      </div>

      <div className="relative my-5">
        <hr className="border-muted-200 dark:border-muted-700" />
        <span className="absolute inset-0 -top-2 text-center font-semibold text-xs text-muted-500 dark:text-muted-400">
          <span className="bg-muted-50 dark:bg-muted-900 px-2">
            {searchTerm ? `Matching "${searchTerm}"` : `All Products`}
          </span>
        </span>
      </div>

      {filteredProducts.length > 0 && (
        <div className="grid gap-x-3 gap-y-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="relative group">
              <Link
                href={`/store/${categoryName}/${product.name.replace(
                  / /g,
                  "-"
                )}`}
              >
                <Card
                  className="group relative w-full h-full p-3 hover:shadow-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-400"
                  shadow="hover"
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
                      <Tag color="primary">{capitalize(categoryName)}</Tag>
                    </div>
                  </div>
                  <div className="my-2">
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
              {profile && (
                <div className="absolute top-5 right-5">
                  <IconButton
                    size={"sm"}
                    onClick={() => handleWishlistToggle(product)}
                    color={
                      wishlist.find((item) => item.id === product.id)
                        ? "danger"
                        : "muted"
                    }
                    variant={"pastel"}
                  >
                    <Icon
                      icon="mdi:heart"
                      className={`h-5 w-5 ${
                        wishlist.find((item) => item.id === product.id)
                          ? "text-danger-500"
                          : "text-muted-300"
                      }`}
                    />
                  </IconButton>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {filteredProducts.length > 0 &&
        filteredProducts.length < products.length && (
          <div className="my-16 flex items-center justify-center">
            <Button
              type="button"
              className="rounded-lg bg-default px-4 py-2 flex items-center gap-2"
              onClick={loadMore}
            >
              <Icon icon="ph:dots-nine-bold" className="h-4 w-4" />
              <span>{t("Load more")}</span>
            </Button>
          </div>
        )}

      {filteredProducts.length === 0 && (
        <div className="my-16 w-full text-center">
          <h2>{t("No Products Available")}</h2>
          <p>{t("Sorry, there are no products available yet.")}</p>
        </div>
      )}
    </Layout>
  );
};
export default CategoryPage;
