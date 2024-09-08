import { useDashboardStore } from "@/stores/dashboard";
import { SubMenuItemProps } from "./SubMenuItem.types";
import { useMenuContext } from "@/context/MenuContext";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const SubMenuItemBase = ({
  href,
  title,
  collapse = false,
  sideblock = false,
}: SubMenuItemProps) => {
  const { t } = useTranslation();
  const { activeSidebarMenu, setActive } = useMenuContext();
  const { setIsSidebarOpenedMobile, setSidebarOpened } = useDashboardStore();

  const router = useRouter();

  const isActive =
    router.pathname.startsWith(href) || activeSidebarMenu === title;

  const handleClick = () => {
    setIsSidebarOpenedMobile(false);
    setSidebarOpened(false);
    setActive(title.toLowerCase().replace(/ /g, "-") + "-menu");
  };

  const baseClass = "relative flex items-center text-sm transition-colors";
  const activeBaseClass =
    'after:absolute after:top-0 after:h-full after:w-1 after:content-[""]';

  const activeClass = `text-white ${activeBaseClass} after:-end-[2.4px] after:rounded-full after:bg-primary-400`;
  const inactiveClass = "text-white/70 hover:text-white";
  const activeDarkClass = `text-primary-500 ${activeBaseClass} after:end-[-2.4px] after:rounded-xl after:bg-primary-500 dark:after:bg-primary-400 dark:text-primary-400`;
  const inactiveDarkClass =
    "text-muted-400 hover:text-muted-500 dark:text-muted-400 dark:hover:text-muted-300";

  const dynamicClass = cn(
    collapse
      ? "ms-6 me-12 min-h-[27.2px] border-r-[2px] border-primary-800 duration-300"
      : sideblock
      ? "ms-9 me-7 min-h-[27.2px] border-r-[3px] border-muted-100 dark:border-muted-800"
      : "ms-3 me-5 min-h-[24px] border-r-[2px] border-muted-200/80 duration-200 dark:border-muted-800/80",

    isActive
      ? collapse
        ? activeClass
        : activeDarkClass
      : collapse
      ? inactiveClass
      : inactiveDarkClass
  );

  const linkClass = `${baseClass} ${dynamicClass}`;

  return (
    <li>
      <Link onClick={handleClick} className={linkClass} href={href}>
        {t(title)}
      </Link>
    </li>
  );
};

export const SubMenuItem = SubMenuItemBase;
