import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import {
  getTemplate,
  getUiOptions,
  TranslatableString,
  type FieldTemplateProps,
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema,
} from "@rjsf/utils";
import { cloneElement, Fragment, isValidElement, type ReactNode } from "react";

/** The `FieldTemplate` component is the template used by `SchemaField` to render any field. It renders the field
 * content, (label, description, children, errors and help) inside of a `WrapIfAdditional` component.
 *
 * @param props - The `FieldTemplateProps` for this component
 */
export default function FieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: FieldTemplateProps<T, S, F>) {
  const {
    children,
    displayLabel,
    hidden,
    required,
    rawErrors = [],
    errors,
    help,
    rawDescription,
    description,
    uiSchema,
    registry,
  } = props;
  const uiOptions = getUiOptions<T, S, F>(uiSchema);
  const WrapIfAdditionalTemplate = getTemplate<
    "WrapIfAdditionalTemplate",
    T,
    S,
    F
  >("WrapIfAdditionalTemplate", registry, uiOptions);
  const { translateString } = registry;

  if (hidden) {
    return <div style={{ display: "none" }}>{children}</div>;
  }

  function translateElementText(element: React.ReactNode): React.ReactNode {
    if (typeof element === "string") {
      return translateString("%1" as TranslatableString, [element]);
    }

    if (Array.isArray(element)) {
      return element.map((child, index) => (
        <Fragment key={index}>{translateElementText(child)}</Fragment>
      ));
    }

    if (isValidElement(element)) {
      const {
        children,
        name,
        uiSchema,
        description,
        rawDescription,
        ...props
      } = element.props as {
        children?: ReactNode;
        name?: string;
        uiSchema?: any;
        description?: string;
        help?: ReactNode;
        rawDescription?: string;
        [key: string]: any;
      };

      let translatedHelp = help;
      if (isValidElement(help) && help.type !== Fragment) {
        const helpProps = help.props as { help?: string; [key: string]: any };
        if (typeof helpProps.help === "string") {
          translatedHelp = cloneElement(help, {
            ...helpProps,
            ...(helpProps.help && {
              help: translateString("%1" as TranslatableString, [
                helpProps.help,
              ]),
            }),
          });
        }
      }

      let translatedUiSchema = uiSchema;
      if (uiSchema?.["ui:title"] || uiSchema?.["ui:description"]) {
        translatedUiSchema = {
          ...uiSchema,
          "ui:title": translateString("%1" as TranslatableString, [
            uiSchema["ui:title"],
          ]),
          "ui:description": translateString("%1" as TranslatableString, [
            uiSchema["ui:description"],
          ]),
        };
      }

      const translatedProps = {
        ...props,
        ...(name && {
          name: translateString("%1" as TranslatableString, [name]),
        }),
        ...(description && {
          description: translateString("%1" as TranslatableString, [
            description,
          ]),
        }),
        ...(rawDescription && {
          rawDescription: translateString("%1" as TranslatableString, [
            rawDescription,
          ]),
        }),
        ...(translatedUiSchema && { uiSchema: translatedUiSchema }),
        ...(translatedHelp &&
          element.type !== Fragment && { help: translatedHelp }),
      };

      return cloneElement(
        element,
        translatedProps,
        translateElementText(children)
      );
    }

    if (Array.isArray(element)) {
      return element.map(translateElementText);
    }

    return element;
  }

  return (
    <WrapIfAdditionalTemplate {...props}>
      {translateElementText(
        <FormControl fullWidth error={rawErrors.length > 0} required={required}>
          {children}
          {displayLabel && rawDescription ? (
            <Typography variant="caption" color="textSecondary">
              {description}
            </Typography>
          ) : null}
          {errors}
          {help}
        </FormControl>
      )}
    </WrapIfAdditionalTemplate>
  );
}
