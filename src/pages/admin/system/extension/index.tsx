"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/layouts/Default";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import Card from "@/components/elements/base/card/Card";
import { MashImage } from "@/components/elements/MashImage";
import Tag from "@/components/elements/base/tag/Tag";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { capitalize, debounce } from "lodash";
import $fetch from "@/utils/api";
import { useRouter } from "next/router";

type Extension = {
  id: string;
  productId: string;
  name: string;
  title: string;
  description: string;
  link: string;
  status: boolean;
  version: string;
  image: string;
};

const api = "/api/admin/system/extension";

const Extension = () => {
  const { t } = useTranslation();
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const router = useRouter();

  const fetchData = async () => {
    const { data, error } = await $fetch({
      url: api,
      silent: true,
    });

    if (!error) setExtensions(data);
  };

  const debouncedFetchData = debounce(fetchData, 100);
  useEffect(() => {
    if (router.isReady) debouncedFetchData();
  }, [router.isReady]);

  return (
    <Layout title={t("Extensions")} color="muted">
      <div className="grid gap-x-3 gap-y-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {extensions.map((product) => (
          <div key={product.id} className="relative group">
            <Link href={`/admin/system/extension/${product.productId}`}>
              <Card
                className="relative p-3 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl rounded-lg"
                color="contrast"
              >
                <div className="relative w-full h-full">
                  <MashImage
                    src={product.image || "/img/placeholder.svg"}
                    alt={product.name}
                    className="rounded-lg object-cover"
                  />
                  <div className="absolute bottom-1 right-1">
                    <Tag color={product.status ? "success" : "danger"}>
                      {product.status ? "Active" : "Inactive"}
                    </Tag>
                  </div>
                </div>
                <div className="mb-2">
                  <h4 className="text-muted-800 dark:text-muted-100 font-medium">
                    {product.title}
                  </h4>
                  <p className="text-muted-500 dark:text-muted-400 text-sm">
                    {product.description.length > 250
                      ? product.description.slice(0, 250) + "..."
                      : product.description}
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-800 dark:text-muted-100">
                    Version
                  </span>
                  <span className="text-muted-800 dark:text-muted-100">
                    {parseFloat(product.version) >= 4 ? product.version : "N/A"}
                  </span>
                </div>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  );
};
export default Extension;
export const permission = "Access Extension Management";
