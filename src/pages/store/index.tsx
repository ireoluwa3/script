// pages/shop/index.tsx
import React, { useEffect, useState } from "react";
import Layout from "@/layouts/Default";
import { EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useEcommerceStore } from "@/stores/user/ecommerce";
import Card from "@/components/elements/base/card/Card";
import { MashImage } from "@/components/elements/MashImage";
import { capitalize } from "lodash";
import Input from "@/components/elements/form/input/Input";
import { HeroParallax } from "@/components/ui/HeroParallax";
import Tag from "@/components/elements/base/tag/Tag";
import { HeaderCardImage } from "@/components/widgets/HeaderCardImage";
import { useRouter } from "next/router";
import Button from "@/components/elements/base/button/Button";
import { Faq } from "@/components/pages/knowledgeBase/Faq";
import { useTranslation } from "next-i18next";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { useDashboardStore } from "@/stores/dashboard";
const Shop = () => {
  const { t } = useTranslation();
  const { profile } = useDashboardStore();
  const router = useRouter();
  const {
    categories,
    fetchCategories,
    wishlist,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
  } = useEcommerceStore();
  const [activeCategory, setActiveCategory] = useState<any | null>(null);
  const [displayLimit, setDisplayLimit] = useState<number>(9);
  useEffect(() => {
    if (router.isReady && (!categories || categories.length === 0)) {
      fetchCategories();
      fetchWishlist();
    }
  }, [router.isReady]);
  useEffect(() => {
    if (categories.length && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories]);
  const loadMore = () => {
    setDisplayLimit(displayLimit + 9);
  };
  const [searchTerm, setSearchTerm] = useState("");
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
  const filteredProducts = (
    categories
      .find((category) => category.id === activeCategory?.id)
      ?.products.slice(0, displayLimit) || []
  ).filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const allCategoriesProducts = categories
    .map((category) =>
      category.products.map((product) => ({
        ...product,
        categoryName: category.name,
      }))
    )
    .flat();

  return (
    <Layout title={t("Shop")}>
      {allCategoriesProducts.length > 3 ? (
        <HeroParallax
          items={allCategoriesProducts.map((product) => ({
            title: product.name,
            link: `/store/${product?.categoryName}/${product.name.replace(
              / /g,
              "-"
            )}`,
            thumbnail: product.image,
          }))}
          title={
            <>
              <span className="text-primary-500">
                {t("Welcome to our Online Store")}
              </span>
              <br />
            </>
          }
          description={
            <>
              <span className="text-muted-500 dark:text-muted-400">
                {t("Explore our wide range of products")}
              </span>
              <br />
              <span className="text-muted-500 dark:text-muted-400">
                {t("and find the perfect one for you")}
              </span>
            </>
          }
        />
      ) : (
        <div className="mb-5">
          <HeaderCardImage
            title={t("Welcome to our Online Store")}
            description="Explore our wide range of products and find the perfect one for you"
            lottie={{
              category: "ecommerce",
              path: "delivery",
              max: 2,
              height: 220,
            }}
            size="lg"
            link={profile ? `/user/store` : undefined}
            linkLabel={t("View Your Orders")}
          />
        </div>
      )}
      <div>
        {/* Categories Carousel */}
        {categories.length > 0 && (
          <div className="mt-8 mb-5">
            <div className="relative">
              <hr className="border-muted-200 dark:border-muted-700" />
              <span className="absolute inset-0 -top-2 text-center font-semibold text-xs text-muted-500 dark:text-muted-400">
                <span className="bg-muted-50 dark:bg-muted-900 px-2">
                  {t("Categories")}
                </span>
              </span>
            </div>
            <Swiper
              modules={[EffectCoverflow, Pagination]}
              effect={"coverflow"}
              pagination={{
                clickable: true,
              }}
              centeredSlides={true}
              grabCursor={true}
              coverflowEffect={{
                rotate: 0,
                slideShadows: false,
              }}
              breakpoints={{
                0: {
                  spaceBetween: 20,
                  slidesPerView: 1,
                },
                468: {
                  spaceBetween: 20,
                  slidesPerView: 3,
                },
                768: {
                  spaceBetween: 25,
                  slidesPerView: 4,
                },
                1024: {
                  spaceBetween: 30,
                  slidesPerView: 5,
                },
                1280: {
                  spaceBetween: 35,
                  slidesPerView: 6,
                },
              }}
            >
              {categories.map((category, index) => {
                return (
                  <SwiperSlide key={index} className="py-5 pb-10">
                    <Link href={`/store/${category.name}`} passHref key={index}>
                      <div className="group transition duration-300 ease-in-out transform hover:-translate-y-1">
                        <div className="relative w-full h-[120px]">
                          <MashImage
                            src={category.image || "/img/placeholder.svg"}
                            alt={category.name}
                            className="rounded-lg object-cover w-full h-full bg-muted-100 dark:bg-muted-900 rounded-lg"
                            fill
                          />
                        </div>
                        <div>
                          <div className="bg-muted-900 absolute inset-0 z-10 h-full w-full opacity-0 transition-opacity duration-300 group-hover:opacity-50 rounded-lg"></div>
                          <div className="absolute inset-0 z-20 flex h-full w-full flex-col justify-between p-6">
                            <h3 className="font-sans text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
                              {category.name}
                            </h3>
                            <h3 className="font-sans text-sm text-white underline opacity-0 transition-all duration-300 group-hover:opacity-100">
                              {t("View products")}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-5 justify-between items-center">
          <h2 className="text-2xl">
            <span className="text-primary-500">
              {capitalize(
                categories.find(
                  (category) => category.id === activeCategory?.id
                )?.name || "All"
              )}
            </span>{" "}
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
        {/* Products */}
        {filteredProducts.length > 0 && (
          <div className="grid gap-x-3 gap-y-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="relative group">
                <Link
                  href={`/store/${activeCategory?.name}/${product.name.replace(
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
                        className="rounded-md object-cover w-full h-full bg-muted-100 dark:bg-muted-900"
                      />
                      <div className="absolute top-1 left-1">
                        <Tag color="primary">
                          {capitalize(activeCategory?.name)}
                        </Tag>
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
                      <div className="flex items-center gap-2 ms-2 text-muted-500 dark:text-muted-400">
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
          filteredProducts.length < (activeCategory?.products?.length || 0) && (
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
          <div className="my-16 w-full text-center text-muted-500 dark:text-muted-400">
            <h2>{t("No Products Available")}</h2>
            <p>{t("Sorry, there are no products available yet.")}</p>
          </div>
        )}
      </div>

      <Faq category="ECOMMERCE" />
    </Layout>
  );
};
export default Shop;
