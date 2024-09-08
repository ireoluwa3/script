"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import $fetch from "@/utils/api";
import Layout from "@/layouts/Default";
import { TracingBeam } from "@/components/ui/Beam";
import { MacbookScroll } from "@/components/ui/MacBookScroll";
import Tag from "@/components/elements/base/tag/Tag";
import Avatar from "@/components/elements/base/avatar/Avatar";
import Link from "next/link";
import { CommentSection } from "@/components/pages/blog/CommentSection";
import { useTranslation } from "next-i18next";

export default function Post() {
  const { t } = useTranslation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const router = useRouter();
  const { category, slug } = router.query;

  const fetchData = async () => {
    if (!slug) return;
    const { data, error } = await $fetch({
      url: `/api/content/post/${slug}`,
      silent: true,
    });
    if (!error && data) {
      setPost(data);
      setComments(data.comments);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category, slug]);

  if (!post) return null; // Ensure post data is loaded before rendering

  const { title, content, image } = post; // Extract title and content from the post

  return (
    <Layout title={title || "Blog"} color="muted">
      <TracingBeam>
        <div className="max-w-prose mx-auto antialiased pt-4 relative">
          <div className="overflow-hidden w-full hidden md:block">
            <MacbookScroll
              showGradient={false}
              title={
                <div className="flex flex-col gap-2 justify-center items-center">
                  <div>
                    <Link href={`/blog/category/${post.category?.name}`}>
                      <Tag color="primary" variant="outlined">
                        {post.category?.name}
                      </Tag>
                    </Link>
                  </div>
                  <span className="text-7xl">{title}</span>
                  <div className="text-sm flex gap-2 items-center mt-8">
                    <span>
                      {t("By")} {post.author?.user?.firstName}{" "}
                      {post.author?.user?.lastName}
                    </span>
                    <Avatar
                      src={
                        post.author?.user?.avatar ||
                        "/img/avatars/placeholder.webp"
                      }
                      alt={`${post.author?.user?.firstName} ${post.author?.user?.lastName}`}
                      size="sm"
                      className="ml-2"
                    />
                    <span className="text-muted-600 dark:text-muted-400">
                      {new Date(
                        post.createdAt || new Date()
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                    </span>
                  </div>
                </div>
              }
              src={image || "/img/placeholder.svg"}
            />
          </div>
          <div className="block md:hidden">
            <div className="flex flex-col gap-2 justify-center items-center">
              <div>
                <Link href={`/blog/category/${post.category?.name}`}>
                  <Tag color="primary" variant="outlined">
                    {post.category?.name}
                  </Tag>
                </Link>
              </div>
              <span className="text-7xl text-center">{title}</span>
              <div className="text-sm flex gap-2 items-center mt-8">
                <span>
                  {t("By")}
                  {post.author?.user?.firstName} {post.author?.user?.lastName}
                </span>
                <Avatar
                  src={
                    post.author?.user?.avatar || "/img/avatars/placeholder.webp"
                  }
                  alt={`${post.author?.user?.firstName} ${post.author?.user?.lastName}`}
                  size="sm"
                  className="ml-2"
                />
                <span className="text-muted-600 dark:text-muted-400">
                  {new Date(post.createdAt || new Date()).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}{" "}
                </span>
              </div>
            </div>
          </div>
          <div
            className="prose mx-auto max-w-prose prose-pre:max-w-[90vw] pe-20 md:pe-0 dark:prose-dark"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <CommentSection
            comments={comments}
            postId={post.id}
            fetchData={fetchData}
          />
        </div>
      </TracingBeam>
    </Layout>
  );
}
