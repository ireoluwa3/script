import React from "react";
import Link from "next/link";
import LogoText from "@/components/vector/LogoText";
import ThemeSwitcher from "@/components/widgets/ThemeSwitcher";

const MinimalHeader = () => {
  return (
    <div className="absolute start-0 top-0 w-full px-3 z-30">
      <div className="mx-auto lg:max-w-[1152px]">
        <div className="flex min-h-[3.6rem] items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <LogoText className="h-7 md:h-8 text-muted-900 dark:text-white" />
            </Link>
          </div>
          <div className="flex items-center justify-end">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinimalHeader;
