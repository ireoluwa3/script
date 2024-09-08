import React, { memo, useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, useInView } from "framer-motion";
import Input from "@/components/elements/form/input/Input";
import { useTranslation } from "next-i18next";
import nextI18NextConfig from "../../../../../next-i18next.config.js";
import { localeFlagMap } from "@/utils/constants";
import { cn } from "@/utils/cn";

export const locales = nextI18NextConfig.i18n.locales.map((locale) => {
  const [code] = locale.split("-");
  return {
    code: locale,
    name: new Intl.DisplayNames([locale], { type: "language" }).of(code),
    flag: localeFlagMap[code],
  };
});

const LocalesBase = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && i18n.language) {
      const detectedLanguage = i18n.language;
      const savedLocale = localStorage.getItem("NEXT_LOCALE");
      if (savedLocale && savedLocale !== detectedLanguage) {
        i18n.changeLanguage(savedLocale);
      } else if (!detectedLanguage) {
        i18n.changeLanguage("en");
      }
    }
  }, [i18n]);

  const onToggleLanguageClick = (newLocale: string) => {
    localStorage.setItem("NEXT_LOCALE", newLocale);
    i18n.changeLanguage(newLocale).then(() => {
      const { pathname, asPath, query } = router;
      router.push({ pathname, query }, asPath, { locale: newLocale });
    });
  };

  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const filteredLocales = locales.filter((locale) =>
    locale.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full flex flex-col overflow-x-hidden slimscroll">
      <Input
        label={t("Search")}
        placeholder={t("Search Languages")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 mb-4 border border-muted-300 rounded-md"
        aria-label={t("Search Languages")}
      />
      <div
        ref={ref}
        className="flex flex-col gap-2 max-h-[calc(100vh_-_160px)] overflow-y-auto pe-1 slimscroll"
      >
        {isInView &&
          filteredLocales.map((locale) => (
            <motion.div
              key={locale.code}
              onClick={() => onToggleLanguageClick(locale.code)}
              className={cn(
                "flex items-center px-4 py-2 cursor-pointer rounded-md transition-all duration-300 ease-in-out",
                locale.code === i18n.language
                  ? "bg-primary-500 text-white dark:bg-primary-400 dark:text-white"
                  : "bg-muted-100 hover:bg-muted-200 dark:bg-muted-800 dark:hover:bg-muted-700 text-muted-700 dark:text-muted-200"
              )}
            >
              <img
                src={`/img/flag/${locale.flag}.svg`}
                alt={locale.name as any}
                width={24}
                height={"auto"}
                className="mr-3"
              />
              {locale.name}
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export const Locales = memo(LocalesBase);
