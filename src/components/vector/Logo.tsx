import { useDashboardStore } from "@/stores/dashboard";
import React, { useMemo, type FC } from "react";
import { MashImage } from "../elements/MashImage";

interface LogoProps {
  className?: string;
}

const Logo: FC<LogoProps> = ({ className: classes }) => {
  const { isDark, settings } = useDashboardStore();

  const logoSrc = useMemo(() => {
    if (settings?.logo || settings?.logoDark) {
      return isDark ? settings?.logoDark || settings?.logo : settings?.logo;
    }
    return "";
  }, [isDark, settings]);

  return (
    <div className={`flex items-center h-[30px] w-[30px] ${classes}`}>
      <MashImage src={logoSrc} alt="Workflow" width={30} height={30} />
    </div>
  );
};

export default Logo;
