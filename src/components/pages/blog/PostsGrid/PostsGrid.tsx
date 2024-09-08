import { memo } from "react";
import Link from "next/link";
import { MashImage } from "@/components/elements/MashImage";
import Tag from "@/components/elements/base/tag/Tag";
import Card from "@/components/elements/base/card/Card";

const PostsGridBase = ({ posts }: { posts: BlogPost[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto">
      {posts
        .reduce(
          (rows: { width: number; element: JSX.Element }[][], post, i) => {
            let row: { width: number; element: JSX.Element }[] =
              rows[rows.length - 1];

            if (!row) {
              row = [];
              rows.push(row);
            }

            const remaining = 3 - row.reduce((acc, p) => acc + p.width, 0);
            const itemWidth = Math.min(
              Math.floor(Math.random() * 2) + 1,
              remaining
            );

            if (itemWidth <= remaining) {
              const className = `col-span-1 md:col-span-${itemWidth}`;
              const description = post.description || "";
              const contentSnippet =
                itemWidth === 1
                  ? description.slice(0, 150) + "..."
                  : description.slice(0, 350) + "...";

              const header = (
                <div className="relative w-full max-h-[200px] h-[200px] overflow-hidden z-1">
                  <MashImage
                    src={post.image || "/img/placeholder.svg"}
                    alt={post.title}
                    className="rounded-lg object-cover w-full h-full bg-muted-100 dark:bg-muted-900"
                    fill
                  />
                  <Tag
                    shape="rounded"
                    color="muted"
                    variant="solid"
                    className="ms-1 absolute top-2 left-2"
                  >
                    {post.category?.name}
                  </Tag>
                </div>
              );

              row.push({
                width: itemWidth,
                element: (
                  <Link key={post.id} href={`/blog/post/${post.slug}`}>
                    <Card
                      color={"contrast"}
                      className={`relative w-full h-full p-2 hover:shadow-lg cursor-pointer ${className}`}
                    >
                      {header}
                      <div className="p-2">
                        <h3 className="text-lg font-semibold text-primary-500 dark:text-primary-400">
                          {post.title}
                        </h3>
                        <div className="flex flex-col gap-1 text-xs">
                          <p className="text-muted-500 dark:text-muted-400">
                            {contentSnippet}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ),
              });

              if (remaining - itemWidth === 0) {
                rows.push([]);
              }
            }

            return rows;
          },
          []
        )
        .flatMap((row) => row.map(({ element }) => element))}
    </div>
  );
};

export const PostsGrid = memo(PostsGridBase);
