import Layout from "@/layouts/Default";
import { useEffect, useRef, useState } from "react";
import $fetch from "@/utils/api";
import { debounce } from "lodash";
import Link from "next/link";
import { PageHeader } from "@/components/elements/base/page-header";
import Tag from "@/components/elements/base/tag/Tag";
import { useTranslation } from "next-i18next";
export default function Blog() {
  const { t } = useTranslation();
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
  const debouncedFetchTags = useRef(debounce(fetchTags, 5)).current;
  useEffect(() => {
    debouncedFetchTags();
  }, []);
  return (
    <Layout title={t("Blog")} color="muted">
      <div className="space-y-5 max-w-5xl lg:mx-auto">
        <PageHeader title={t("Blog Tags")} />

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
      </div>
    </Layout>
  );
}
