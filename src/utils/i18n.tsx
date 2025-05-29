import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(LanguageDetector)
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    supportedLngs: ["en", "fr"],
    fallbackLng: "en",
    ns: ["common", "threat", "incident"],
    defaultNS: "common",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    interpolation: {
      escapeValue: false,
    },
  });
export default i18n;
