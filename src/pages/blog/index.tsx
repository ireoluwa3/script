import Layout from "@/layouts/Default";
import { useEffect, useRef, useState } from "react";
import $fetch from "@/utils/api";
import { PostsSlider } from "@/components/pages/blog/PostsSlider";
import { PostsGrid } from "@/components/pages/blog/PostsGrid";
import { debounce } from "lodash";
import { MashImage } from "@/components/elements/MashImage";
import { EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import Link from "next/link";
import Card from "@/components/elements/base/card/Card";
import Tag from "@/components/elements/base/tag/Tag";
import { useTranslation } from "next-i18next";
export default function Blog() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter] = useState({
    name: {
      value: "",
      operator: "startsWith",
    },
  });
  const [sort] = useState({ field: "createdAt", rule: "desc" });
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    perPage: 10,
    totalPages: 0,
  });
  const fetchData = async () => {
    const endpoint = "/api/content/post";
    const params: Record<string, string> = {};
    if (pagination.currentPage !== undefined) {
      params["page"] = String(pagination.currentPage);
    }
    if (pagination.perPage !== undefined) {
      params["perPage"] = String(pagination.perPage);
    }
    if (sort.field !== undefined && sort.field !== "") {
      params["sortField"] = sort.field;
    }
    if (sort.rule !== undefined) {
      params["sortOrder"] = sort.rule;
    }
    if (filter.name.value !== "") {
      params["filter"] = JSON.stringify(filter);
    }
    const queryString = new URLSearchParams(params).toString();
    const url = `${endpoint}?${queryString}`;
    const { data, error } = await $fetch({
      url,
      silent: true,
    });
    if (!error) {
      setItems(data.items);
      setPagination(data.pagination);
    }
  };
  const fetchCategories = async () => {
    const { data, error } = await $fetch({
      url: "/api/content/category",
      silent: true,
    });
    if (!error) {
      setCategories(data);
    }
  };
  const [tags, setTags] = useState<Tag[]>([]);
  const fetchTags = async () => {
    const { data, error } = await $fetch({
      url: "/api/content/tag",
      silent: true,
    });
    if (!error) {
      setTags(data);
    }
  };
  // Create a debounced version of fetchData
  const debouncedFetchData = useRef(debounce(fetchData, 5)).current;
  const debouncedFetchCategories = useRef(debounce(fetchCategories, 5)).current;
  const debouncedFetchTags = useRef(debounce(fetchTags, 5)).current;
  useEffect(() => {
    debouncedFetchData();
    debouncedFetchCategories();
    debouncedFetchTags();
  }, []);
  return (
    <Layout title={t("Blog")} color="muted">
      <div className="space-y-5 max-w-5xl lg:mx-auto">
        <div className="pb-5">
          <PostsSlider content={items} />
        </div>
        <div className="relative">
          <hr className="border-muted-200 dark:border-muted-700" />
          <Link href="/blog/category" passHref>
            <span className="absolute inset-0 -top-2 text-center font-semibold text-xs text-muted-500 dark:text-muted-400">
              <span className="bg-muted-50 dark:bg-muted-900 px-2">
                {t("Categories")}
              </span>
            </span>
          </Link>
        </div>

        <div className="w-full max-w-5xl lg:mx-auto">
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
                  <Link
                    href={`/blog/category/${category.slug}`}
                    passHref
                    key={index}
                  >
                    <Card
                      shape="curved"
                      color={"contrast"}
                      className="group p-3 transition duration-300 ease-in-out transform hover:-translate-y-1"
                    >
                      <div className="relative w-full h-32">
                        <MashImage
                          src={category.image || "/img/placeholder.svg"}
                          alt={category.name}
                          className="rounded-lg object-cover w-full h-full"
                          fill
                        />
                      </div>
                      <div>
                        <div className="mt-1">
                          <h3 className="line-clamp-2 text-gray-800 dark:text-gray-100 text-md">
                            {category.name}
                          </h3>
                          <div>
                            <p className="text-muted-400 font-sans text-xs">
                              {category.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        <div className="relative">
          <hr className="border-muted-200 dark:border-muted-700" />
          <span className="absolute inset-0 -top-2 text-center font-semibold text-xs text-muted-500 dark:text-muted-400">
            <span className="bg-muted-50 dark:bg-muted-900 px-2">
              {t("Latest Posts")}
            </span>
          </span>
        </div>
        <PostsGrid posts={items} />
      </div>

      <div className="relative mt-10 mb-5">
        <hr className="border-muted-200 dark:border-muted-700" />
        <span className="absolute inset-0 -top-2 text-center font-semibold text-xs text-muted-500 dark:text-muted-400">
          <span className="bg-muted-50 dark:bg-muted-900 px-2">
            {t("Our Tag Cloud")}
          </span>
        </span>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {tags.map((tag, index) => {
          return (
            <Link href={`/blog/tag/${tag.slug}`} passHref key={index}>
              <Tag
                shape="rounded"
                className="group p-3 transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                {tag.name}
              </Tag>
            </Link>
          );
        })}
      </div>
    </Layout>
  );
}
