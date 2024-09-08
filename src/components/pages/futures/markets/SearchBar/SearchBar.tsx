import { memo } from "react";
import Input from "@/components/elements/form/input/Input";
import useFuturesMarketStore from "@/stores/futures/market";
import { useTranslation } from "next-i18next";
const SearchBarBase = () => {
  const { t } = useTranslation();
  const { setSearchQuery } = useFuturesMarketStore();
  return (
    <Input
      size={"sm"}
      icon={"bx:bx-search"}
      type="text"
      placeholder={t("Search pairs...")}
      onChange={(e) => setSearchQuery(e.target.value)}
      warning
      shape={"rounded-sm"}
    />
  );
};
export const SearchBar = memo(SearchBarBase);
