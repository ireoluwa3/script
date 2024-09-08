import IconBox from "@/components/elements/base/iconbox/IconBox";
import { HeaderProps } from "./Header.types";
import Breadcrumb from "@/components/elements/base/breadcrumb/Breadcrumb";
import { AnimatedTooltip } from "@/components/elements/base/tooltips/AnimatedTooltip";
import Link from "next/link";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { capitalize } from "lodash";
import { useTranslation } from "next-i18next";
const HeaderBase = ({ modelName, postTitle }: HeaderProps) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const breadcrumbItems = router.asPath
    .split("?")[0] // This splits the path at the '?' and takes the first part, excluding the query.
    .split("/")
    .filter((item) => item !== "")
    .map((item, index, arr) => {
      return {
        title: capitalize(item.replace(/-/g, " ").replace(/#/g, "")),
        href: "/" + arr.slice(0, index + 1).join("/"),
      };
    });
  return (
    <div className="min-h-16 py-2 gap-5 flex items-start justify-center md:justify-between w-fullrounded-lg flex-col md:flex-row mb-2">
      <div className="flex items-center gap-4">
        <IconBox
          icon={
            isHovered
              ? "heroicons-solid:chevron-left"
              : "material-symbols-light:app-badging-outline"
          }
          color="muted"
          variant={"pastel"}
          shape={"rounded"}
          size={"md"}
          rotating={!isHovered}
          onMouseOver={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="cursor-pointer duration-300 hover:bg-black/10 hover:text-black dark:hover:bg-white/20 hover:shadow-inner"
          onClick={() => router.back()}
        />
        <h2 className="font-sans text-lg font-light text-muted-700 dark:text-muted-300">
          {modelName} {postTitle || "Analytics"}
          <Breadcrumb separator="slash" items={breadcrumbItems} />
        </h2>
      </div>
      <AnimatedTooltip content={t("Records")}>
        <Link href={router.asPath.replace("analysis", "")} passHref>
          <IconButton
            variant="pastel"
            aria-label="Records"
            color="primary"
            size={"lg"}
          >
            <Icon icon="solar:database-bold-duotone" className="h-6 w-6" />
          </IconButton>
        </Link>
      </AnimatedTooltip>
    </div>
  );
};
export const Header = HeaderBase;
