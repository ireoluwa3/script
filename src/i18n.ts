import i18n, { i18n as I18nInstance } from "i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { i18n as nextI18nConfig } from "../next-i18next.config";

class I18nSingleton {
  private static instance: I18nInstance;

  private constructor() {}

  public static getInstance(): I18nInstance {
    if (!I18nSingleton.instance) {
      i18n
        .use(HttpBackend)
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
          ...nextI18nConfig,
          ns: ["common"],
          defaultNS: "common",
          fallbackLng: "en",
          backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
          },
          react: {
            useSuspense: true,
          },
          detection: {
            order: ["navigator", "cookie", "localStorage"],
            caches: ["cookie", "localStorage"],
            lookupLocalStorage: "i18nextLng",
          },
          interpolation: {
            escapeValue: false,
          },
          lng: "en",
        });
      I18nSingleton.instance = i18n;
    }

    return I18nSingleton.instance;
  }
}

export default I18nSingleton.getInstance();
