import { memo, ReactNode } from "react";
import ButtonLink from "../../button-link/ButtonLink";
import { Icon } from "@iconify/react";
import { useTranslation } from "next-i18next";
interface BackButtonProps {
  href: string;
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
}
const BackButtonBase = ({ href, size = "md", children }: BackButtonProps) => {
  const { t } = useTranslation();
  return (
    <ButtonLink href={href} shape="rounded" color="muted" size={size}>
      <Icon
        icon="line-md:chevron-left"
        className={`"h-4 w-4 ${!children && "mr-2"}"`}
      />
      {children || t("Back")}
    </ButtonLink>
  );
};
export const BackButton = memo(BackButtonBase);
