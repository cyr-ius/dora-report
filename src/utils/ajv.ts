import { customizeValidator } from "@rjsf/validator-ajv8";
import localizer from "ajv-i18n";
import Ajv2020 from "ajv/dist/2020.js";

export type AjvLocale = keyof typeof localizer;

export const getValidatorForLanguage = (lang: string) => {
  const locale = (lang as AjvLocale) in localizer ? (lang as AjvLocale) : "en";
  const selectedLocalizer = localizer[locale];
  return customizeValidator({ AjvClass: Ajv2020 }, selectedLocalizer);
};
