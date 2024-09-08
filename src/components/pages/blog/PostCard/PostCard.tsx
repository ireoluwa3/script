import { PostCardProps } from "./PostCard.types";
import React from "react";
import Link from "next/link";
import { MashImage } from "@/components/elements/MashImage";
import Card from "@/components/elements/base/card/Card";
import Tag from "@/components/elements/base/tag/Tag";
import Avatar from "@/components/elements/base/avatar/Avatar";
import { formatDate } from "date-fns";

const PostCardBase = ({ post }: PostCardProps) => {
  return (
    <Link href={`/blog/${post.slug}`} passHref>
      <Card
        shape="curved"
        className="group relative w-full h-full p-3 hover:shadow-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-400"
      >
        <div className="relative w-full h-[200px]">
          <MashImage
            src={post.image || "/img/placeholder.svg"}
            alt={post.title}
            className="rounded-md object-cover w-full h-full bg-muted-100 dark:bg-muted-900"
            fill
          />
          <Tag
            shape="full"
            color="primary"
            variant="pastel"
            className="absolute start-3 top-3 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            {post.category?.name}
          </Tag>
        </div>
        <div>
          <div className="mb-6 mt-3">
            <h3 className="line-clamp-2 text-gray-800 dark:text-gray-100">
              {post.title}
            </h3>
          </div>
          <div className="mt-auto flex items-center gap-2">
            <Avatar
              src={post.author?.user?.avatar || "/img/avatars/1.svg"}
              text={post.author?.user?.firstName}
              size="xs"
              className="bg-muted-500/20 text-muted-500"
            />
            <div className="leading-none">
              <h4 className="text-muted-800 dark:text-muted-100 font-sans text-sm font-medium leading-tight">
                {post.author?.user?.firstName}
              </h4>
              <p className="text-muted-400 font-sans text-xs">
                {formatDate(
                  new Date(post.createdAt || new Date()),
                  "MMM dd, yyyy"
                )}
              </p>
            </div>
            {/* {post.author?.user?.id === user?.id && (
              <Link
                href={`/blog/author/post?type=edit&slug=${post.slug}`}
                passHref
              >
                <button className="ms-auto">
                  <Icon name="lucide:edit-3" />
                  <span>Edit</span>
                </button>
              </Link>
            )} */}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export const PostCard = PostCardBase;
