import { UserProfileButtonProps } from "./UserProfileButton.types";
import Link from "next/link";
import { MashImage } from "@/components/elements/MashImage";
import { sizes } from "@/components/elements/base/avatar/Avatar";
import { useTranslation } from "next-i18next";
const UserProfileButtonBase = ({
  userName = "Clark C.",
  userImageSrc = "/img/avatars/placeholder.webp",
}: UserProfileButtonProps) => {
  const { t } = useTranslation();
  return (
    <div className="mb-2 flex items-center">
      <Link
        href="/user/profile"
        className="flex h-[68px] items-center gap-2 px-6"
      >
        <span className="mask mask-blob h-12 w-12 shrink-0">
          <MashImage
            height={sizes["xs"]}
            width={sizes["xs"]}
            src={userImageSrc}
            className="block w-full"
            alt={userName}
          />
        </span>

        <div>
          <span className="block font-sans text-xs uppercase leading-tight text-muted-400">
            {t("Welcome")}
          </span>
          <span className="block font-sans text-base font-normal leading-tight text-muted-800 dark:text-muted-100">
            {userName}
          </span>
        </div>
      </Link>
    </div>
  );
};
export const UserProfileButton = UserProfileButtonBase;
