import { customizeValidator } from "@rjsf/validator-ajv8";
import localizer from "ajv-i18n";
import Ajv2020 from "ajv/dist/2020.js";

type AjvLocale = keyof typeof localizer;
const savedLocale = (localStorage.getItem("locale") as AjvLocale) || "en";
const selectedLocalizer = localizer[savedLocale];
export const validator = customizeValidator(
  { AjvClass: Ajv2020 },
  selectedLocalizer
);
