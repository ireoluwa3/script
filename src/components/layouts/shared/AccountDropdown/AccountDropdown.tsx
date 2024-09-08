import React from "react";
import Link from "next/link";
import { MashImage } from "@/components/elements/MashImage";
import Dropdown from "@/components/elements/base/dropdown/Dropdown";
import { Icon } from "@iconify/react";
import { useLogout } from "@/hooks/useLogout";
import { useDashboardStore } from "@/stores/dashboard";
import { useTranslation } from "next-i18next";
import Button from "@/components/elements/base/button/Button";

const AccountDropdownBase = () => {
  const { t } = useTranslation();
  const logout = useLogout();
  const { profile } = useDashboardStore();

  if (!profile) {
    return (
      <>
        <Link href="/login">
          <Button color="primary" shape="rounded" variant="outlined">
            <Icon
              icon="material-symbols-light:login-outline"
              className="h-5 w-5 me-1"
            />
            {t("Login")}
          </Button>
        </Link>
        <Link href="/register">
          <Button shape="rounded" variant="outlined" color="muted">
            <Icon icon="bx:bxs-user-plus" className="h-5 w-5 me-1" />
            {t("Register")}
          </Button>
        </Link>
      </>
    );
  }

  return (
    <Dropdown
      title={t("My Account")}
      orientation="end"
      indicator={false}
      toggleImage={
        <MashImage
          src={profile?.avatar || `/img/avatars/placeholder.webp`}
          height={350}
          width={350}
          alt=""
        />
      }
    >
      <Link
        href="/user/wallet"
        className="group mx-2 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300 hover:bg-muted-100 dark:hover:bg-muted-800"
      >
        <Icon
          icon="ph:wallet"
          className="h-5 w-5 stroke-muted-400 text-muted-400 transition-colors duration-300 dark:group-hover:stroke-primary-500 dark:group-hover:text-primary-500"
        />
        <div className="option-content flex flex-col">
          <span className="block font-sans text-sm font-medium leading-tight text-muted-800 dark:text-muted-100">
            {t("Assets")}
          </span>
          <span className="block font-sans text-xs leading-tight text-muted-400">
            {t("View your assets")}
          </span>
        </div>
      </Link>
      <Link
        href="/user/profile"
        className="group mx-2 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300 hover:bg-muted-100 dark:hover:bg-muted-800"
      >
        <Icon
          icon="ph:user-circle-duotone"
          className="h-5 w-5 stroke-muted-400 text-muted-400 transition-colors duration-300 dark:group-hover:stroke-primary-500 dark:group-hover:text-primary-500"
        />
        <div className="option-content flex flex-col">
          <span className="block font-sans text-sm font-medium leading-tight text-muted-800 dark:text-muted-100">
            {t("Profile")}
          </span>
          <span className="block font-sans text-xs leading-tight text-muted-400">
            {t("View your profile")}
          </span>
        </div>
      </Link>
      {/* api management */}
      <Link
        href="/user/api"
        className="group mx-2 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300 hover:bg-muted-100 dark:hover:bg-muted-800"
      >
        <Icon
          icon="carbon:api"
          className="h-5 w-5 stroke-muted-400 text-muted-400 transition-colors duration-300 dark:group-hover:stroke-primary-500 dark:group-hover:text-primary-500"
        />
        <div className="option-content flex flex-col">
          <span className="block font-sans text-sm font-medium leading-tight text-muted-800 dark:text-muted-100">
            {t("API Management")}
          </span>
          <span className="block font-sans text-xs leading-tight text-muted-400">
            {t("Manage your API keys")}
          </span>
        </div>
      </Link>
      <button
        onClick={logout}
        type="button"
        name="logout"
        aria-label="Logout"
        className="group mx-2 flex w-[calc(100%_-_1rem)] cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-start transition-all duration-300 hover:bg-muted-100 dark:hover:bg-muted-800"
      >
        <Icon
          icon="ph:lock-duotone"
          className="h-5 w-5 stroke-muted-400 text-muted-400 transition-colors duration-300 dark:group-hover:stroke-primary-500 dark:group-hover:text-primary-500"
        />
        <span className="option-content flex flex-col">
          <span className="block font-sans text-sm font-medium leading-tight text-muted-800 dark:text-muted-100">
            {t("Logout")}
          </span>
          <span className="block font-sans text-xs leading-tight text-muted-400">
            {t("Logout from account")}
          </span>
        </span>
      </button>
    </Dropdown>
  );
};

export const AccountDropdown = AccountDropdownBase;
