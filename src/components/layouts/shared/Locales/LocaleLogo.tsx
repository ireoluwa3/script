import React, { memo, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { locales } from "./Locales";
import { Icon } from "@iconify/react";

const LocaleLogoBase = () => {
  const { i18n } = useTranslation();
  const [currentLocale, setCurrentLocale] = React.useState(() =>
    locales.find((locale) => locale.code === i18n.language)
  );

  useEffect(() => {
    const locale = locales.find((locale) => locale.code === i18n.language);
    setCurrentLocale(locale);
  }, [i18n.language]);

  if (!currentLocale) {
    return (
      <Icon
        icon="iconoir:language"
        className="h-4 w-4 text-muted-500 transition-colors duration-300 group-hover:text-primary-500"
      />
    );
  }

  return (
    <img
      src={`/img/flag/${currentLocale.flag}.svg`}
      alt={currentLocale.name as any}
      width={16}
      height={"auto"}
    />
  );
};

export const LocaleLogo = memo(LocaleLogoBase);
