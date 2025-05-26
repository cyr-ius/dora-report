import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import {
  TranslatableString,
  englishStringTranslator,
  replaceStringParameters,
} from "@rjsf/utils";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

export const translateString = (
  stringToTranslate: TranslatableString,
  params?: string[]
): string => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation();
  switch (stringToTranslate) {
    case TranslatableString.NewStringDefault:
      return ""; // Use an empty string for the new additionalProperties string default value
    case TranslatableString.KeyLabel:
      params = params?.map((item) => t(item));
      return t(replaceStringParameters("%1 Key", params)); // Add "Name" onto the end of the WrapIfAdditionalTemplate key label
    default:
      return t(englishStringTranslator(stringToTranslate, params));
  }
};

export const translateSchema = (
  schema: any,
  t: any,
  path = "form"
): RJSFSchema => {
  if (!schema || typeof schema !== "object") return schema;

  const newSchema = { ...schema };

  // Générer ou traduire le title
  if (!newSchema.title || typeof newSchema.title === "string") {
    newSchema.title = t(`${path}.title`, t(path, t(getLastKey(path))));
  }

  // Traduction de la description
  if (typeof newSchema.description === "string") {
    newSchema.description = t(`${path}.description`, t(newSchema.description));
  }

  // Remplacement enum → oneOf avec { const, title } (même valeur, mais title traduit)
  if (Array.isArray(newSchema.enum)) {
    newSchema.oneOf = newSchema.enum.map((value: any) => ({
      const: value,
      title: t(`${path}.enum.${value}`, t(value))
    }));
    delete newSchema.enum;
  }

  // Récursivité sur les propriétés
  if (newSchema.properties) {
    newSchema.properties = Object.fromEntries(
      Object.entries(newSchema.properties).map(([key, value]) => {
        if (typeof value === "boolean") {
          return [key, value];
        }
        return [key, translateSchema(value, t, `${path}.${key}`)];
      })
    );
  }

  // Récursion dans les items (tableaux)
  if (newSchema.items) {
    newSchema.items = translateSchema(newSchema.items, t, `${path}.items`);
  }
  if (newSchema.items) {
    // cas tableau de type unique
    if (!Array.isArray(newSchema.items)) {
      newSchema.items = translateSchema(newSchema.items, t, `${path}.items`);
    } else {
      // cas tuple
      newSchema.items = newSchema.items.map((item: any, index: any) =>
        translateSchema(item, t, `${path}.items[${index}]`)
      );
    }
  }

  // Traduction des définitions dans $defs
  if (newSchema.$defs && typeof newSchema.$defs === "object") {
    newSchema.$defs = Object.fromEntries(
      Object.entries(newSchema.$defs).map(([key, def]) => [
        key,
        translateSchema(def, t, `${path}.$defs.${key}`),
      ])
    );
  }
  return newSchema;
};

export const translateUiSchema = (
  uiSchema: UiSchema,
  t: TFunction,
  path = "form"
): UiSchema => {
  if (!uiSchema || typeof uiSchema !== "object") return uiSchema;

  const newUISchema: UiSchema = { ...uiSchema };

  // Traduire les champs ui:*
  ["ui:title", "ui:description", "ui:help", "ui:enumNames"].forEach((key) => {
    const value = newUISchema[key];
    if (typeof value === "string") {
      const rKey = key.replace("ui:", "");
      newUISchema[key] = t(`${path}.${rKey}`, value);
    }
    if (Array.isArray(value)) {
      newUISchema[key] = t(`${path}.enum`, { returnObjects: true }) as string[];
    }
  });
  

  // Traduire les champs dans ui:options (title, description, help)
  if (
    newUISchema["ui:options"] &&
    typeof newUISchema["ui:options"] === "object"
  ) {
    const options = { ...newUISchema["ui:options"] };

    ["title", "description", "help"].forEach((optKey) => {
      const val = options[optKey];
      if (typeof val === "string") {
        options[optKey] = t(`${path}.options.${optKey}`, val);
      }
    });

    newUISchema["ui:options"] = options;
  }

  // Traduction récursive des enfants avec titres imbriqués
  const translateDeep = (obj: any, currentPath: string): any => {
    if (Array.isArray(obj)) {
      return obj.map((item) => translateDeep(item, currentPath));
    } else if (typeof obj === "object" && obj !== null) {
      const copy: any = { ...obj };

      if (typeof copy.title === "string") {
        const titleKey = `${currentPath}.title`;
        copy.title = t(
          titleKey,
          t(`${path}.${copy.title}.title`, t(copy.title))
        );
      }

      for (const [k, v] of Object.entries(copy)) {
        if (k !== "title") {
          copy[k] = translateDeep(v, `${currentPath}.${k}`);
        }
      }

      return copy;
    }
    return obj;
  };

  // Traduire récursivement tous les sous-éléments du uiSchema
  const translated = Object.fromEntries(
    Object.entries(newUISchema).map(([key, val]) => {
      if (key.startsWith("ui:")) return [key, val];
      return [key, translateUiSchema(val as UiSchema, t, `${path}.${key}`)];
    })
  );

  // Traduire aussi les enfants potentiels imbriqués
  return translateDeep(translated, path);
};

function getLastKey(path: string): string {
  const parts = path.split(".");
  return parts[parts.length - 1];
}
