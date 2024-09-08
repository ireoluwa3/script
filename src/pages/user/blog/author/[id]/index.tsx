"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { formatDate } from "date-fns";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import IconBox from "@/components/elements/base/iconbox/IconBox";
const columnConfig: ColumnConfigType[] = [
  {
    field: "title",
    label: "Title",
    sublabel: "slug",
    type: "text",
    sortable: true,
    hasImage: true,
    imageKey: "image",
    placeholder: "/img/placeholder.svg",
  },
  {
    field: "category",
    label: "Category",
    type: "tag",
    sortable: true,
    sortName: "category.name",
    getValue: (row) => row.category?.name,
    path: "/admin/content/category?name=[category.name]",
    color: "primary",
  },
  {
    field: "status",
    label: "Status",
    type: "select",
    sortable: true,
    options: [
      { value: "DRAFT", label: "Draft", color: "warning" },
      { value: "PUBLISHED", label: "Published", color: "success" },
    ],
  },
  {
    field: "createdAt",
    label: "Created At",
    type: "datetime",
    sortable: true,
    filterable: false,
    getValue: (row) => formatDate(new Date(row.createdAt), "yyyy-MM-dd"),
  },
];
const Posts = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const api = `/api/content/author/${id}`;
  return (
    <Layout title={t("Posts")} color="muted">
      {router.isReady && (
        <DataTable
          title={t("Posts")}
          endpoint={api}
          columnConfig={columnConfig}
          hasStructure={false}
          viewPath="/blog/post/[slug]"
          editPath="/user/blog/post?category=[category.slug]&id=[id]"
          canCreate={false}
          navSlot={
            <IconBox
              color="primary"
              onClick={() => router.push("/user/blog/post")}
              size={"sm"}
              shape={"rounded"}
              variant={"pastel"}
              className="cursor-pointer hover:shadow transition-all duration-300 ease-in-out hover:shadow-muted-300/30 dark:hover:shadow-muted-800/20 hover:bg-primary-500 hover:text-muted-100"
              icon="mdi:plus"
            />
          }
        />
      )}
    </Layout>
  );
};
export default Posts;
