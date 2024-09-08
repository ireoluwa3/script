import { PageHeaderProps } from "./PageHeader.types";
import React, { memo, useState } from "react";
import { useRouter } from "next/router";
import { capitalize } from "lodash";
import pluralize from "pluralize";
import IconBox from "../iconbox/IconBox";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { BackButton } from "../button/BackButton";

const PageHeaderBase = ({ title, BackPath, children }: PageHeaderProps) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const breadcrumbItems = router.asPath
    .split("?")[0]
    .split("/")
    .filter((item) => item !== "")
    .map((item, index, arr) => {
      const title =
        arr.length - 1 === index
          ? pluralize(capitalize(item.replace(/-/g, " ").replace(/#/g, "")))
          : capitalize(item.replace(/-/g, " ").replace(/#/g, ""));

      const href = arr.slice(0, index + 1).join("/");

      return {
        title,
        href: `/${href}`,
      };
    });

  return (
    <div className="min-h-16 py-2 gap-5 flex items-start justify-center md:justify-between w-full rounded-lg flex-col md:flex-row">
      <div className="flex items-center gap-4">
        <IconBox
          icon={
            isHovered
              ? "heroicons-solid:chevron-left"
              : "material-symbols-light:app-badging-outline"
          }
          color="muted"
          variant="pastel"
          shape="rounded"
          size="md"
          rotating={!isHovered}
          onMouseOver={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="cursor-pointer duration-300 hover:bg-black/10 hover:text-black dark:hover:bg-white/20 hover:shadow-inner"
          onClick={() => router.back()}
        />
        <h2 className="font-sans text-lg font-light text-muted-700 dark:text-muted-300">
          {title}
          {breadcrumbItems.length > 0 && (
            <Breadcrumb separator="slash" items={breadcrumbItems} />
          )}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        {BackPath && <BackButton href={BackPath} />}
        {children}
      </div>
    </div>
  );
};

export const PageHeader = memo(PageHeaderBase);
