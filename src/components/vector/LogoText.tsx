import { useDashboardStore } from "@/stores/dashboard";
import React, { useEffect, FC, useMemo } from "react";
import { MashImage } from "../elements/MashImage";

interface LogoTextProps {
  className?: string;
}

const LogoText: FC<LogoTextProps> = ({ className: classes }) => {
  const { isDark, settings } = useDashboardStore();

  const fullLogoSrc = useMemo(() => {
    if (settings?.fullLogo || settings?.fullLogoDark) {
      return isDark
        ? settings?.fullLogoDark || settings?.fullLogo
        : settings?.fullLogo;
    }
    return "";
  }, [isDark, settings]);

  return (
    <div className={`flex items-center h-[30px] w-[100px] ${classes}`}>
      <MashImage
        className="max-h-full w-full fill-current"
        src={fullLogoSrc}
        alt="Workflow"
        width={100}
        height={30}
      />
    </div>
  );
};

export default LogoText;
