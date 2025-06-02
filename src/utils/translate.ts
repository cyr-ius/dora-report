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
    default: {
      const stringTranslor = englishStringTranslator(stringToTranslate, params);
      return t(stringTranslor, t(stringTranslor));
    }
  }
};

export const translateSchema = (
  schema: any,
  t: any,
  ns = "translation",
  path = ""
): RJSFSchema => {
  if (!schema || typeof schema !== "object") return schema;

  const newSchema = { ...schema };

  // Générer ou traduire le title
  if (!newSchema.title || typeof newSchema.title === "string") {
    const tPath = `${ns}:${concatPath(path, "title")}`;
    const key = getLastKey(path.replace("items", ""));
    newSchema.title = t(tPath, key);
  }

  // Traduction de la description
  if (typeof newSchema.description === "string") {
    const tPath = `${ns}:${concatPath(path, "description")}`;
    newSchema.description = t(tPath, newSchema.description);
  }

  // Remplacement enum → oneOf avec { const, title } (même valeur, mais title traduit)
  if (Array.isArray(newSchema.enum)) {
    newSchema.oneOf = newSchema.enum.map((value: any) => ({
      const: value,
      title: t(`${ns}:${concatPath(path, `enum.${value}`)}`, value),
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
        return [key, translateSchema(value, t, ns, concatPath(path, key))];
      })
    );
  }

  // Récursion dans les items (tableaux)
  if (newSchema.items) {
    newSchema.items = translateSchema(newSchema.items, t, ns, `${path}.items`);
  }

  if (newSchema.items) {
    // cas tableau de type unique
    if (!Array.isArray(newSchema.items)) {
      newSchema.items = translateSchema(
        newSchema.items,
        t,
        ns,
        concatPath(path, "items")
      );
    } else {
      // cas tuple
      newSchema.items = newSchema.items.map((item: any, index: any) =>
        translateSchema(item, t, ns, concatPath(path, `items[${index}]`))
      );
    }
  }

  // Traduction des définitions dans $defs
  if (newSchema.$defs && typeof newSchema.$defs === "object") {
    newSchema.$defs = Object.fromEntries(
      Object.entries(newSchema.$defs).map(([key, def]) => [
        key,
        translateSchema(def, t, ns, concatPath(path, `$defs.${key}`)),
      ])
    );
  }
  return newSchema;
};

export const translateUiSchema = (
  uiSchema: UiSchema,
  t: TFunction,
  ns = "translation",
  path: string = ""
): UiSchema => {
  if (!uiSchema || typeof uiSchema !== "object") return uiSchema;

  const newUISchema: UiSchema = { ...uiSchema };

  // Traduire les champs ui:*
  ["ui:title", "ui:description", "ui:help", "ui:enumNames"].forEach((key) => {
    const value = newUISchema[key];
    if (typeof value === "string") {
      const rKey = key.replace("ui:", "");
      const tPath = `${ns}:${concatPath(path, rKey)}`;
      newUISchema[key] = t(tPath, value);
    }
    if (Array.isArray(value)) {
      newUISchema[key] = t(`${ns}:${concatPath(path, "enum")}`, {
        returnObjects: true,
      }) as string[];
    }
  });

  // Traduire les champs dans ui:options
  if (
    newUISchema["ui:options"] &&
    typeof newUISchema["ui:options"] === "object"
  ) {
    const options = { ...newUISchema["ui:options"] };

    ["title", "description", "help"].forEach((optKey) => {
      const val = options[optKey];
      if (typeof val === "string") {
        const optPath = concatPath(path, optKey);
        options[optKey] = t(`${ns}:${optPath}`, val);
      }
    });

    newUISchema["ui:options"] = options;
  }

  // Traduire récursivement tous les sous-éléments du uiSchema
  const translated = Object.fromEntries(
    Object.entries(newUISchema).map(([key, val]) => {
      if (key.startsWith("ui:")) return [key, val];
      return [
        key,
        translateUiSchema(val as UiSchema, t, ns, concatPath(path, key)),
      ];
    })
  );

  // Traduction récursive des enfants avec titres imbriqués
  const translateDeep = (obj: any, currentPath: string): any => {
    if (Array.isArray(obj)) {
      return obj.map((item) => translateDeep(item, currentPath));
    } else if (typeof obj === "object" && obj !== null) {
      const copy: any = { ...obj };

      if (
        typeof copy.title === "string" &&
        copy.field == "LayoutHeaderField" &&
        !copy._translated
      ) {
        if (!copy.title.includes(".")) {
          copy.title = t(`${ns}:${copy.title}.title`, copy.title);
          copy._translated = true;
        }
      }

      for (const [k, v] of Object.entries(copy)) {
        if (k !== "title") {
          copy[k] = translateDeep(v, concatPath(currentPath, k));
        }
      }

      return copy;
    }
    return obj;
  };

  // Traduire aussi les enfants potentiels imbriqués
  return translateDeep(translated, path);
};

const concatPath = (base: string, suffix: string): string =>
  base ? `${base}.${suffix}` : suffix;

const getLastKey = (path: string): string => {
  const parts = path.split(".");
  return parts[parts.length - 1];
};
