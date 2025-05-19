import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import {
  getTemplate,
  getUiOptions,
  TranslatableString,
  type FieldTemplateProps,
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema
} from '@rjsf/utils';
import { cloneElement, isValidElement, type ReactNode } from 'react';

/** The `FieldTemplate` component is the template used by `SchemaField` to render any field. It renders the field
 * content, (label, description, children, errors and help) inside of a `WrapIfAdditional` component.
 *
 * @param props - The `FieldTemplateProps` for this component
 */
export default function FieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: FieldTemplateProps<T, S, F>) {
  const {
    children,
    displayLabel,
    hidden,
    required,
    rawErrors = [],
    errors,
    help,
    description,
    rawDescription,
    uiSchema,
    registry,
  } = props;
  const uiOptions = getUiOptions<T, S, F>(uiSchema);
  const WrapIfAdditionalTemplate = getTemplate<'WrapIfAdditionalTemplate', T, S, F>(
    'WrapIfAdditionalTemplate',
    registry,
    uiOptions,
  );

  if (hidden) {
    return <div style={{ display: 'none' }}>{children}</div>;
  }

  function translateElementText(element: React.ReactNode): React.ReactNode {
    const { translateString } = registry;

    if (typeof element === 'string') {
      return translateString("%1" as TranslatableString, [element])
    }

    if (Array.isArray(element)) {
      return element.map(translateElementText);
    }

    if (isValidElement(element)) {
      const { children,name,uiSchema, ...props } = element.props as { children?: ReactNode , name?: string, uiSchema?: any, [key: string]: any };

      let translatedUiSchema = uiSchema;
      if (uiSchema?.['ui:title']) {
        translatedUiSchema = {
          ...uiSchema,
          'ui:title': translateString('%1' as TranslatableString, [uiSchema['ui:title']])
        };
      }


      const translatedProps = {
        ...props,
        ...(name && { name: translateString("%1" as TranslatableString, [name])}),
        ...(translatedUiSchema && { uiSchema: translatedUiSchema })
      };
      return cloneElement(element, translatedProps, translateElementText(children));
    }

    if (Array.isArray(element)) {
      return element.map(translateElementText);
    }

    return element;
  }

  return (
    <WrapIfAdditionalTemplate {...props}>
      <FormControl fullWidth={true} error={rawErrors.length ? true : false} required={required}>
        {translateElementText(children)}
        {displayLabel && rawDescription ? (
          <Typography variant='caption' color='textSecondary'>
            {description}
          </Typography>
        ) : null}
        {errors}
        {help}
      </FormControl>
    </WrapIfAdditionalTemplate>
  );
}
