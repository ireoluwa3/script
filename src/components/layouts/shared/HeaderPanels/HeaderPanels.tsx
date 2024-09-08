import { memo } from "react";
import { HeaderPanelsProps } from "./HeaderPanels.types";
import FixedPanel from "@/components/elements/base/panel/FixedPanel";
import { Locales } from "../Locales";
import { Announcements } from "../Announcements";
import { useDashboardStore } from "@/stores/dashboard";
import { useTranslation } from "next-i18next";
const HeaderPanelsBase = ({}: HeaderPanelsProps) => {
  const { t } = useTranslation();
  const { panels } = useDashboardStore();
  return (
    <>
      <FixedPanel title={t("Languages")} name="locales">
        {panels["locales"] && <Locales />}
      </FixedPanel>

      <FixedPanel title={t("Announcements")} name="announcements">
        {panels["announcements"] && <Announcements />}
      </FixedPanel>
    </>
  );
};
export const HeaderPanels = memo(HeaderPanelsBase);
