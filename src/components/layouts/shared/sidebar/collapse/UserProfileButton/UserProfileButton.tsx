import { UserProfileButtonProps } from "./UserProfileButton.types";
import Link from "next/link";
import { MashImage } from "@/components/elements/MashImage";
import { sizes } from "@/components/elements/base/avatar/Avatar";
import { cn } from "@/utils/cn";

const UserProfileButtonBase = ({
  userName = "Clark Smith",
  userImageSrc = "/img/avatars/placeholder.webp",
  isVisible = false,
}: UserProfileButtonProps) => {
  const containerClasses =
    "flex h-16 shrink-0 items-center border-t border-primary-700 px-5";
  const linkClasses = "flex items-center gap-2 p-0.5";
  const imageContainerClasses = "mask mask-blob h-8 w-8 min-w-[1.6rem]";
  const imageClasses = "block w-full";
  const userNameClasses = cn(
    "whitespace-nowrap text-sm text-white transition-all duration-300 hover:text-white/70",
    {
      "opacity-100": isVisible,
      "opacity-0": !isVisible,
    }
  );

  return (
    <div className={containerClasses}>
      <Link href="/user/profile" className={linkClasses}>
        <span className={imageContainerClasses}>
          <MashImage
            height={sizes["xxs"]}
            width={sizes["xxs"]}
            src={userImageSrc}
            className={imageClasses}
            alt=""
          />
        </span>
        <span className={userNameClasses}>{userName}</span>
      </Link>
    </div>
  );
};

export const UserProfileButton = UserProfileButtonBase;
