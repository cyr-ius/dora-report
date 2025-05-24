import i18n from "i18next";
import { initReactI18next } from "react-i18next";
const frModules = import.meta.glob("./fr/*.json", { eager: true });
const enModules = import.meta.glob("./en/*.json", { eager: true });

const loadTranslations = (modules: Record<string, any>) =>
  Object.values(modules).reduce((acc, mod) => ({ ...acc, ...mod.default }), {});

const fr = loadTranslations(frModules);
const en = loadTranslations(enModules);

const savedLocale = localStorage.getItem("locale") || "en";

i18n
  .use(initReactI18next)
  // .use(LanguageDetector)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    lng: savedLocale,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
